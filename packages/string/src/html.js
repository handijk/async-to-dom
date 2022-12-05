import { encode as defaultEncode } from 'html-entities';
import { render } from '@async-to-html/render/render.js';
import { safeHtml } from '@async-to-html/render/safe-html/safe-html.js';
import { STRING_RENDERERS } from './renderers/get-default-renderers.js';

export const html =
  ({ encode = defaultEncode, ...props } = {}) =>
  (strings, ...promises) =>
  async (...args) =>
    safeHtml(
      (
        await Promise.all(
          promises.map((item) =>
            render(item, {
              ...props,
              args,
              safe: true,
              renderers: STRING_RENDERERS,
              encode,
            })
          )
        )
      )
        .reduce((acc, curr, i) => [...acc, curr, strings[i + 1]], [strings[0]])
        .join('')
    );
