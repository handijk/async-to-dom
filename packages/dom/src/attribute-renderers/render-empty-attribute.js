export const renderEmptyAttributeFactory = (_item, { key, element }) => {
  element.setAttribute(key, '');
  return element;
};
