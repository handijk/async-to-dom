export const createAbortablePromise = async ({
  signal = null,
  promise = null,
} = {}) => {
  let resolveAbortPromise;
  const abortPromise = new Promise((resolve) => {
    resolveAbortPromise = resolve;
  });
  const abort = () => {
    resolveAbortPromise({ aborted: true, result: signal.reason });
  };
  if (signal) {
    if (signal.aborted) {
      abort();
    } else {
      signal.addEventListener('abort', abort);
    }
  }
  if (!promise) {
    return abortPromise.then((result) => {
      signal.removeEventListener('abort', abort);
      return result;
    });
  }
  const { result, aborted } = await Promise.race([
    promise.then((value) => ({ aborted: false, result: value })),
    abortPromise,
  ]);
  if (signal) {
    signal.removeEventListener('abort', abort);
  }

  return { result, aborted };
};
