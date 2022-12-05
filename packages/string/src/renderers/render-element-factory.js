import { safeHtml } from '@async-to-html/render/safe-html/safe-html.js';

export const renderElementFactory = (item, { render, ...props }, ...args) => {
  let value;
  switch (item.nodeType) {
    case 1:
      value = item.outerHTML;
      break;
    case 3:
      value = item.nodeValue;
      break;
    case 8:
      value = `<!--${item.nodeValue}-->`;
      break;
    case 11:
      value = Array.from(item.childNodes)
        .map((child) => {
          switch (child.nodeType) {
            case 1:
              return child.outerHTML;
            case 3:
              return child.nodeValue;
            case 8:
              return `<!--${child.nodeValue}-->`;
          }
        })
        .join('');
      break;
  }
  return render(safeHtml(value), { ...props, render }, ...args);
};
