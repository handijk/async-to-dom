export const isElement = (item) =>
  !!item?.nodeType && [1, 3, 8, 11].indexOf(item.nodeType) !== -1;
