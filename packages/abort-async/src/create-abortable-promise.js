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
    return abortPromise;
  }
  const { result, aborted } = await Promise.race([
    promise.then((result) => ({ aborted: false, result })),
    abortPromise,
  ]);

  return { result, aborted };
};
