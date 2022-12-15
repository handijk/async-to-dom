export const createAsyncIterableMapFn =
  ({ render, ...props }, ...args) =>
  (value, signal) =>
    render(value, { ...props, render, signal }, ...args);
