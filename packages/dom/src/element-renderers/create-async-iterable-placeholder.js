export const createAsyncIterablePlaceholder = ({
  placeholder,
  before,
  after,
  i,
}) => {
  const remove = () => {
    let currentElement = before.nextSibling;
    while (currentElement !== after) {
      const removeElement = currentElement;
      currentElement = currentElement.nextSibling;
      removeElement.remove();
    }
  };
  const replaceOrRemove = () => {
    if (i === 0) {
      placeholder.replaceWith(before, after);
    } else {
      remove();
    }
  };
  return {
    replaceWith: (...elements) => {
      replaceOrRemove();
      after.before(...elements);
    },
    remove: replaceOrRemove,
  };
};
