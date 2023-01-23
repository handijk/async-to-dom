import { createAbortablePromise } from './create-abortable-promise.js';
import { returnUntilDone } from './return-until-done.js';

export const createAbortableAsyncIterable = async function* ({
  asyncIterable,
  signal = null,
}) {
  const asyncIterator = asyncIterable[Symbol.asyncIterator]();
  let allDone = false;
  try {
    while (true) {
      const { result, aborted } = await createAbortablePromise({
        signal,
        promise: asyncIterator.next(),
      });
      if (aborted) {
        allDone = true;
        return returnUntilDone(asyncIterator);
      }
      if (result.done) {
        return result.value;
      }
      yield result.value;
    }
  } finally {
    if (!allDone) {
      await returnUntilDone(asyncIterator);
    }
  }
};
