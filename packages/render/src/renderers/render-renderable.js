export const renderRenderable = (item, { render, ...props }, ...args) =>
  render(
    item.render({ ...props, render }, ...args),
    { ...props, render },
    ...args
  );
