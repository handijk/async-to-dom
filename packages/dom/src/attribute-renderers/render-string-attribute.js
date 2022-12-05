export const renderStringAttributeFactory = (item, { element, key }) => {
  element.setAttribute(key, item);
  return element;
};
