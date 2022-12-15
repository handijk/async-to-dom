import { createAbortingAsyncIterable } from '@async-to-html/abort-async/create-aborting-async-iterable.js';
import { createAsyncIterableMapFn } from './create-async-iterable-map-fn.js';

export const renderAsyncIteratorFactory = async (
  item,
  { signal, ...props },
  ...args
) => {
  const asyncIterable = createAbortingAsyncIterable({
    asyncIterable: item,
    signal,
    mapFn: createAsyncIterableMapFn(props, ...args),
  });
  let returnValue;
  for await (const value of asyncIterable) {
    returnValue = value;
  }
  return returnValue;
};
