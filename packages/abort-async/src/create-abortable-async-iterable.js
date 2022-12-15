import { createAbortablePromise } from './create-abortable-promise.js';
import { returnUntilDone } from './return-until-done.js';

export const createAbortableAsyncIterable = async function* ({
  asyncIterable,
  signal = null,
}) {
  const asyncIterator = asyncIterable[Symbol.asyncIterator]();
  try {
    while (true) {
      const { result, aborted } = await createAbortablePromise({
        signal,
        promise: asyncIterator.next(),
      });
      if (aborted) {
        return returnUntilDone(asyncIterator);
      }
      if (result.done) {
        return result.value;
      }
      yield result.value;
    }
  } finally {
    await returnUntilDone(asyncIterator);
  }
};
