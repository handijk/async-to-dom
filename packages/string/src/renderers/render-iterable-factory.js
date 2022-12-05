export const renderIterableFactory = async (
  item,
  { render, ...props },
  ...args
) => {
  const rendered = await Promise.all(
    item.map((child) => render(child, { ...props, render }, ...args))
  );
  return rendered.join('');
};
