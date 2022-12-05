import {
  ASYNC_ITERABLE_PLACEHOLDER_AFTER,
  ASYNC_ITERABLE_PLACEHOLDER_BEFORE,
  ASYNC_ITERABLE_PLACHOLDER,
} from '../constants.js';
import { createAbortableAsyncIterable } from '@async-to-html/abort-async/create-abortable-async-iterable.js';

export const renderAsyncIteratorFactory = async (
  item,
  { placeholder, document, render, signal, ...props },
  ...args
) => {
  let returnValue;
  const before = document.createComment(ASYNC_ITERABLE_PLACEHOLDER_BEFORE);
  const after = document.createComment(ASYNC_ITERABLE_PLACEHOLDER_AFTER);
  placeholder.replaceWith(before, after);

  const asyncIterable = createAbortableAsyncIterable({
    asyncIterable: item,
    signal,
  });

  for await (const { result, signal } of asyncIterable) {
    let currentElement = before.nextSibling;
    while (currentElement !== after) {
      const removeElement = currentElement;
      currentElement = currentElement.nextSibling;
      removeElement.remove();
    }
    const placeholder = document.createComment(ASYNC_ITERABLE_PLACHOLDER);
    after.before(placeholder);
    returnValue = await render(
      result,
      {
        ...props,
        signal,
        render,
        document,
        placeholder,
      },
      ...args
    );
  }

  before.remove();
  after.remove();
  return returnValue;
};
