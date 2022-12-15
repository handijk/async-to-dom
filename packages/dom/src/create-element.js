import { SPECIAL_PLACEHOLDER_ITEM } from './constants.js';
import { ELEMENT_RENDERERS } from './element-renderers/get-default-renderers.js';
import { ATTRIBUTE_RENDERERS } from './attribute-renderers/get-attribute-renderers.js';
import { render } from '@async-to-html/render/render.js';

export const createElement =
  ({ document, ...props } = {}) =>
  (tag, attributes = {}, ...children) =>
    async function* (...args) {
      const element = document.createElement(tag);
      yield element;
      const promise = Promise.all([
        ...Object.keys(attributes ?? {}).map((key) => {
          element.setAttribute(key, '');
          return render(attributes[key], {
            ...props,
            args,
            element,
            key,
            document,
            renderers: ATTRIBUTE_RENDERERS,
          });
        }),
        ...children.map((child) => {
          const placeholder = document.createComment(SPECIAL_PLACEHOLDER_ITEM);
          element.appendChild(placeholder);
          return render(child, {
            ...props,
            args,
            placeholder,
            document,
            renderers: ELEMENT_RENDERERS,
          });
        }),
      ]);
      return promise;
    };
