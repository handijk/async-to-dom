import { SPECIAL_PLACEHOLDER_ITEM } from './constants.js';
import { ELEMENT_RENDERERS } from './element-renderers/get-default-renderers.js';
import { ATTRIBUTE_RENDERERS } from './attribute-renderers/get-attribute-renderers.js';
import { render } from '@async-to-html/render/render.js';

export const createElement =
  ({ document } = {}) =>
  (tag, attributes = {}, ...children) => ({
    render: async function* (props, ...args) {
      const element = document.createElement(tag);
      yield element;
      return Promise.all([
        ...Object.keys(attributes ?? {}).map((key) => {
          element.setAttribute(key, '');
          return render(
            attributes[key],
            {
              ...props,
              element,
              key,
              document,
              renderers: ATTRIBUTE_RENDERERS,
            },
            ...args
          );
        }),
        ...children.map((child) => {
          const placeholder = document.createComment(SPECIAL_PLACEHOLDER_ITEM);
          element.appendChild(placeholder);
          return render(
            child,
            {
              ...props,
              placeholder,
              document,
              renderers: ELEMENT_RENDERERS,
            },
            ...args
          );
        }),
      ]);
    },
  });
