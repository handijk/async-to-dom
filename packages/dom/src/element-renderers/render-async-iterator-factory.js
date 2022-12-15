import {
  ASYNC_ITERABLE_PLACEHOLDER_AFTER,
  ASYNC_ITERABLE_PLACEHOLDER_BEFORE,
} from '../constants.js';
import { createAbortingAsyncIterable } from '@async-to-html/abort-async/create-aborting-async-iterable.js';
import { createAsyncIterableMapFn } from './create-async-iterable-map-fn.js';

export const renderAsyncIteratorFactory = async (
  item,
  { document, signal, ...props },
  ...args
) => {
  let returnValue;
  const before = document.createComment(ASYNC_ITERABLE_PLACEHOLDER_BEFORE);
  const after = document.createComment(ASYNC_ITERABLE_PLACEHOLDER_AFTER);

  const asyncIterable = createAbortingAsyncIterable({
    asyncIterable: item,
    signal,
    mapFn: createAsyncIterableMapFn(
      { document, before, after, ...props },
      ...args
    ),
  });

  for await (const result of asyncIterable) {
    returnValue = result;
  }

  before.remove();
  after.remove();
  return returnValue;
};
