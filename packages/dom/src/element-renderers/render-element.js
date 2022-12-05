export const renderElementFactory = (item, { placeholder }) => {
  placeholder.replaceWith(item);
  return item;
};
