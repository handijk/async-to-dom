export const isString = (item) =>
  typeof item === 'string' || typeof item?.toString === 'function';
