import { afterEach, describe, expect, test, vi } from 'vitest';
import { getSafeString } from '@async-to-html/render/safe-html/safe-html.js';
import { renderHtmlSafeStringFactory } from './render-html-safe-string-factory.js';

vi.mock('@async-to-html/render/safe-html/safe-html.js', () => ({
  getSafeString: vi.fn(),
}));

describe('renderHtmlSafeStringFactory', () => {
  const replaceWith = vi.fn();
  const document = {
    createElement: vi.fn(),
  };
  const args = {
    document,
    placeholder: {
      replaceWith,
    },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call renderElement', () => {
    const item = Symbol();
    const element = { innerHTML: null, content: Symbol() };
    getSafeString.mockReturnValueOnce('item');
    document.createElement.mockReturnValueOnce(element);
    const result = renderHtmlSafeStringFactory(item, args);
    expect(result).toEqual(args.placeholder);
    expect(element.innerHTML).toEqual('item');
    expect(document.createElement).toBeCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('template');
    expect(getSafeString).toBeCalledTimes(1);
    expect(getSafeString).toHaveBeenCalledWith(item);
    expect(replaceWith).toBeCalledTimes(1);
    expect(replaceWith).toHaveBeenCalledWith(element.content);
  });
});
