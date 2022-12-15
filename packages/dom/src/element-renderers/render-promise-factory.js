import { createAbortablePromise } from '@async-to-html/abort-async/create-abortable-promise.js';

export const renderPromiseFactory = async (
  promise,
  { render, placeholder, signal, ...props },
  ...args
) => {
  const { result, aborted } = await createAbortablePromise({
    signal,
    promise,
  });
  if (aborted) {
    placeholder.remove();
    return null;
  } else {
    return render(result, { ...props, render, signal, placeholder }, ...args);
  }
};
