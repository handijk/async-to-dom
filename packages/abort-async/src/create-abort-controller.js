export const createAbortController = ({ signal = null } = {}) => {
  const abortController = new AbortController();
  if (signal) {
    const abort = () => {
      abortController.abort(signal.reason);
    };
    const abortAndRemoveListener = () => {
      signal.removeEventListener('abort', abortAndRemoveListener);
      abort();
    };
    if (signal.aborted) {
      abort();
    } else {
      signal.addEventListener('abort', abortAndRemoveListener);
    }
  }
  return abortController;
};
