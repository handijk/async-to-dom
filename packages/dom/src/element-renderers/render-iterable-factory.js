import { createIterablePlaceholderFactory } from './create-iterable-placeholder-factory.js';

export const renderIterableFactory = (
  iterable,
  { placeholder, document, render, ...props },
  ...args
) => {
  const createIterablePlacholder = createIterablePlaceholderFactory({
    iterable,
    placeholder,
    document,
  });
  return Promise.all(
    Array.from(iterable, (itemIterator, i) =>
      render(
        itemIterator,
        {
          ...props,
          document,
          placeholder: createIterablePlacholder(i),
          render,
        },
        ...args
      )
    )
  );
};
