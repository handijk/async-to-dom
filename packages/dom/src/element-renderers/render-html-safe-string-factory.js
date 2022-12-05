import { getSafeString } from '@async-to-html/render/safe-html/safe-html.js';

export const renderHtmlSafeStringFactory = (
  item,
  { placeholder, document }
) => {
  const template = document.createElement('template');
  template.innerHTML = getSafeString(item);
  placeholder.replaceWith(template.content);
  return placeholder;
};
