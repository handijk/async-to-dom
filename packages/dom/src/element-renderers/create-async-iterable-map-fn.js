import { createAsyncIterablePlaceholder } from './create-async-iterable-placeholder.js';

export const createAsyncIterableMapFn =
  ({ render, placeholder, before, after, ...props }, ...args) =>
  (result, signal, i) =>
    render(
      result,
      {
        ...props,
        signal,
        render,
        placeholder: createAsyncIterablePlaceholder({
          placeholder,
          before,
          after,
          i,
        }),
      },
      ...args
    );
