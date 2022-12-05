import { ITERABLE_ITEM_PLACEHOLDER } from '../constants.js';

export const renderIterableFactory = (
  item,
  { placeholder, document, render, ...props },
  ...args
) => {
  const fragment = document.createDocumentFragment();
  const promises = [];
  for (const itemIterator of item) {
    const itemPlaceholder = document.createComment(ITERABLE_ITEM_PLACEHOLDER);
    fragment.append(itemPlaceholder);
    promises.push(
      render(
        itemIterator,
        {
          ...props,
          document,
          placeholder: itemPlaceholder,
          render,
        },
        ...args
      )
    );
  }
  placeholder.replaceWith(fragment);
  return Promise.all(promises);
};
