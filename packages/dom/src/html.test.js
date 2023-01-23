import { describe, expect, test, vi } from 'vitest';
import { html as htmlFactory } from './html.js';
import { createString } from './html/create-string.js';
import { renderStringChildren } from './html/render-string-children.js';

vi.mock('./html/render-string-children.js', () => ({
  renderStringChildren: vi.fn(),
}));

vi.mock('./html/create-string.js', () => ({
  createString: vi.fn(),
}));

describe('html', () => {
  const content = Symbol();
  const document = {
    createElement: vi.fn(() => {
      return {
        innerHTML: '',
        content,
      };
    }),
  };
  const signal = Symbol();
  const x = Symbol();
  const props = {
    prop: x,
    signal,
  };
  const args = [props];

  test('string attribute value', async () => {
    const html = htmlFactory({
      document,
    });
    const item = 'henk';
    const elementIterator = html`<div title="${item}"></div>`.render(...args);
    const element = (await elementIterator.next()).value;
    await elementIterator.next();
    expect(createString).toHaveBeenCalledTimes(1);
    expect(createString).toHaveBeenCalledWith(
      ['<div title="', '"></div>'],
      item
    );
    expect(renderStringChildren).toHaveBeenCalledTimes(1);
    expect(renderStringChildren).toHaveBeenCalledWith(
      {
        document,
        components: [item],
        element: content,
      },
      props
    );
    expect(element).toBe(content);
  });
});
