import { createAbortController } from './create-abort-controller.js';
import { createAbortableAsyncIterable } from './create-abortable-async-iterable.js';
import { returnUntilDone } from './return-until-done.js';

export const createAbortingAsyncIterable = async function* ({
  asyncIterable,
  signal,
  mapFn = null,
  abortOnReturn = false,
}) {
  let asyncIterator = null;
  let abortController = null;
  let allDone = false;
  try {
    let i = 0;

    const abortableAsyncIterable = createAbortableAsyncIterable({
      asyncIterable,
      signal,
    });

    asyncIterator = abortableAsyncIterable[Symbol.asyncIterator]();
    let nextPromise = asyncIterator.next();

    while (true) {
      const { value, done } = await nextPromise;
      if (abortController?.signal && !abortController.signal.aborted) {
        abortController.abort();
      }
      if (done) {
        return value;
      }
      abortController = createAbortController({ signal });
      const returnPromise = mapFn(value, abortController.signal, i++);
      nextPromise = asyncIterator.next();
      const { next, nextResult } = await Promise.race([
        Promise.resolve(returnPromise).then((result) => ({
          nextResult: result,
          next: false,
        })),
        nextPromise.then((result) => ({ nextResult: result, next: true })),
      ]);
      allDone = nextResult?.done;
      if (next && (!nextResult?.done || abortOnReturn)) {
        abortController.abort();
      } else {
        yield returnPromise;
      }
    }
  } finally {
    if (abortController?.signal && !abortController.signal.aborted) {
      abortController.abort();
    }
    if (!allDone) {
      await returnUntilDone(asyncIterator);
    }
  }
};
