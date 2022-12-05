export const createAbortController = ({ signal = null } = {}) => {
  const abortController = new AbortController();
  if (signal) {
    const abort = () => {
      abortController.abort(signal.reason);
    };
    if (signal.aborted) {
      abort();
    } else {
      signal.addEventListener('abort', abort);
    }
  }
  return abortController;
};
