import { createAbortableAsyncIterable } from '@async-to-html/abort-async/create-abortable-async-iterable.js';

export const renderAsyncIteratorFactory = async (
  item,
  { render, signal, ...props },
  ...args
) => {
  let lastValue;
  let lastSignal;
  const asyncIterable = createAbortableAsyncIterable({
    asyncIterable: item,
    signal,
  });

  for await (const { result, signal } of asyncIterable) {
    lastValue = result;
    lastSignal = signal;
  }

  return render(lastValue, { ...props, render, signal: lastSignal }, ...args);
};
