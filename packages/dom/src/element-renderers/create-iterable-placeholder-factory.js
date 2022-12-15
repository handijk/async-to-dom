import { ITERABLE_ITEM_PLACEHOLDER } from '../constants.js';

export const createIterablePlaceholderFactory = ({
  iterable,
  placeholder,
  document,
}) => {
  const placeholders = Array.from(iterable, () =>
    document.createComment(ITERABLE_ITEM_PLACEHOLDER)
  );
  let replaced = false;
  return (i) => ({
    replaceWith: (...elements) => {
      if (!replaced) {
        const replaceWith = [...placeholders];
        replaceWith.splice(i, 1, ...elements);
        placeholder.replaceWith(...replaceWith.filter(Boolean));
        placeholders.splice(i, 1, null);
        replaced = true;
      } else {
        placeholders[i].replaceWith(...elements);
      }
    },
    remove: () => {
      if (!replaced) {
        placeholders[i] = null;
        if (placeholders.filter(Boolean).length === 0) {
          placeholder.remove();
        }
      } else {
        placeholders[i].remove();
      }
    },
  });
};
