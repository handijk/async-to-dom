import { createAbortablePromise } from '@async-to-html/abort-async/create-abortable-promise.js';

export const renderPromiseFactory = async (
  promise,
  { render, signal, ...props },
  ...args
) => {
  const { result, aborted } = await createAbortablePromise({
    signal,
    promise,
  });
  if (!aborted) {
    return render(result, { ...props, render, signal }, ...args);
  }
};
