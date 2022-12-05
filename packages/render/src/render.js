export const render = (item, { renderers, ...props }, ...args) => {
  for (const [matchFn, renderFn] of renderers) {
    if (matchFn(item)) {
      return renderFn(item, { ...props, renderers, render }, ...args);
    }
  }
  return Promise.reject(new TypeError('Cannot convert item to node'));
};
