import { createAbortableAsyncIterable } from '@async-to-html/abort-async/create-abortable-async-iterable.js';

export const renderAsyncIteratorFactory = async (
  item,
  { render, signal, ...props },
  ...args
) => {
  const asyncIterable = createAbortableAsyncIterable({
    asyncIterable: item,
    signal,
  });
  let returnValue;
  for await (const { result, signal } of asyncIterable) {
    returnValue = await render(result, { ...props, render, signal }, ...args);
  }
  return returnValue;
};
