import { renderStringChildren } from './html/render-string-children.js';
import { createString } from './html/create-string.js';

export const html =
  ({ document } = {}) =>
  (strings, ...replacements) => ({
    render: async function* (...args) {
      const template = document.createElement('template');
      template.innerHTML = createString(strings, ...replacements);
      const promise = renderStringChildren(
        {
          document,
          element: template.content,
          components: replacements,
        },
        ...args
      );
      yield template.content;
      return promise;
    },
  });
