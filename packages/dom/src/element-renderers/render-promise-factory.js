import { PROMISE_PLACHOLDER } from '../constants.js';
import { createAbortablePromise } from '@async-to-html/abort-async/create-abortable-promise.js';

export const renderPromiseFactory = async (
  promise,
  { render, placeholder, signal, ...props },
  ...args
) => {
  const newPlaceholder = document.createComment(PROMISE_PLACHOLDER);
  placeholder.replaceWith(newPlaceholder);
  const { result, aborted } = await createAbortablePromise({
    signal,
    promise,
  });
  if (aborted) {
    newPlaceholder.remove();
  } else {
    return render(
      result,
      { ...props, render, signal, placeholder: newPlaceholder },
      ...args
    );
  }
};
