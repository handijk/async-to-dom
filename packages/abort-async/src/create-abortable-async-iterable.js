import { createAbortController } from './create-abort-controller.js';
import { createAbortablePromise } from './create-abortable-promise.js';

const returnUntilDone = async (item) => {
  const { value, done } = await item.return();
  return done ? value : returnUntilDone(item);
};

export const createAbortableAsyncIterable = async function* ({
  asyncIterable,
  signal = null,
} = {}) {
  const asyncIterator = asyncIterable[Symbol.asyncIterator]();
  let hasReturned = false;
  let abortController = null;
  try {
    while (true) {
      const { result, aborted } = await createAbortablePromise({
        signal,
        promise: asyncIterator.next(),
      });
      if (aborted) {
        hasReturned = true;
        return {
          result: await returnUntilDone(asyncIterator),
          signal: abortController.signal,
        };
      }
      if (result.done) {
        hasReturned = true;
        return {
          result: result.value,
          signal: abortController?.signal ?? signal,
        };
      }
      if (abortController) {
        abortController.abort();
      }
      abortController = createAbortController({ signal });
      yield { result: result.value, signal: abortController.signal };
    }
  } finally {
    if (!hasReturned) {
      await returnUntilDone(asyncIterator);
    }
  }
};
