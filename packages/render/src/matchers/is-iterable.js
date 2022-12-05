export const isIterable = (item) =>
  typeof item?.[Symbol.iterator] === 'function' &&
  typeof item !== 'string' &&
  !item?.nodeType;
