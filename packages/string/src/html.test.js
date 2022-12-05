import { encode } from 'html-entities';
import { describe, expect, test, vi } from 'vitest';
import { render } from '@async-to-html/render/render.js';
import { safeHtml } from '@async-to-html/render/safe-html/safe-html.js';
import { STRING_RENDERERS } from './renderers/get-default-renderers.js';
import { html as htmlFactory } from './html.js';

vi.mock('./renderers/get-default-renderers.js', () => ({
  STRING_RENDERERS: [Symbol('string renderer')],
}));

vi.mock('@async-to-html/render/safe-html/safe-html.js', () => ({
  safeHtml: vi.fn(),
}));

vi.mock('html-entities', () => ({
  encode: vi.fn(),
}));

vi.mock('@async-to-html/render/render.js', () => ({
  render: vi.fn(),
}));

describe('html', () => {
  const x = Symbol();
  const props = {};
  const args = [props, x];

  test('string attribute value', async () => {
    const html = htmlFactory();
    const item = 'henk';
    const result = Symbol('result');
    safeHtml.mockReturnValueOnce(result);
    render.mockReturnValueOnce('item');
    const elementPromise = html`<div title="${item}"></div>`(...args);
    const element = await elementPromise;
    expect(render).toBeCalledTimes(1);
    expect(render).toHaveBeenCalledWith(item, {
      safe: true,
      args,
      renderers: STRING_RENDERERS,
      encode,
    });
    expect(element).toBe(result);
    expect(safeHtml).toBeCalledTimes(1);
    expect(safeHtml.mock.calls[0][0]).toMatchInlineSnapshot(
      '"<div title=\\"item\\"></div>"'
    );
  });
});
