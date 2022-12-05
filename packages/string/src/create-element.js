import { encode as defaultEncode } from 'html-entities';
import { render } from '@async-to-html/render/render.js';
import { safeHtml } from '@async-to-html/render/safe-html/safe-html.js';
import { STRING_RENDERERS } from './renderers/get-default-renderers.js';

export const createElement =
  ({ encode = defaultEncode, ...props } = {}) =>
  (tag, attributes, ...children) =>
  async (...args) => {
    const renderedProps = await Promise.all(
      Object.keys(attributes ?? {}).map(
        async (key) =>
          `${key}${`="${await render(attributes[key], {
            ...props,
            args,
            safe: false,
            renderers: STRING_RENDERERS,
            encode,
          })}"`}`
      )
    );
    const renderedChildren = await Promise.all(
      children.map((child) =>
        render(child, {
          ...props,
          args,
          safe: true,
          renderers: STRING_RENDERERS,
          encode,
        })
      )
    );
    return safeHtml(
      `<${tag} ${renderedProps.join(' ')}>${renderedChildren.join('')}</${tag}>`
    );
  };
