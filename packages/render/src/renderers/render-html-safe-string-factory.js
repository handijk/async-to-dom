import { getSafeString } from '../safe-html/safe-html.js';

export const renderHtmlSafeStringFactory = (
  item,
  { render, ...props },
  ...args
) => render(getSafeString(item), { ...props, render, safe: false }, ...args);
