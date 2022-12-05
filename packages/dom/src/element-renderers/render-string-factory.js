export const renderStringFactory = (item, { placeholder, document }) => {
  const element = document.createTextNode(item.toString());
  placeholder.replaceWith(element);
  return element;
};
