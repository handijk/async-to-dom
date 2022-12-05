export const renderFunctionFactory = (
  item,
  { render, args, ...props },
  ...restArgs
) => render(item(...args), { ...props, render, args }, ...restArgs);
