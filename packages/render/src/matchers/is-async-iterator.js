export const isAsyncIterator = (item) =>
  typeof item?.[Symbol.asyncIterator] === 'function';
