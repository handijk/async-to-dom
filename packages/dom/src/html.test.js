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
  const args = [x];

  test('string attribute value', async () => {
    const html = htmlFactory({
      signal,
      document,
    });
    const item = 'henk';
    const elementIterator = html`<div title="${item}"></div>`(...args);
    const element = (await elementIterator.next()).value;
    await elementIterator.next();
    expect(createString).toHaveBeenCalledTimes(1);
    expect(createString).toHaveBeenCalledWith(
      ['<div title="', '"></div>'],
      item
    );
    expect(renderStringChildren).toHaveBeenCalledTimes(1);
    expect(renderStringChildren).toHaveBeenCalledWith({
      document,
      components: [item],
      args,
      element: content,
      signal,
    });
    expect(element).toBe(content);
  });
});
