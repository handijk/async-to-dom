import { afterEach, describe, expect, test, vi } from 'vitest';
import { getSafeString } from '..//safe-html/safe-html.js';
import { renderHtmlSafeStringFactory } from './render-html-safe-string-factory.js';

vi.mock('@async-to-html/render/safe-html/safe-html.js', () => ({
  getSafeString: vi.fn(),
}));

describe('renderHtmlSafeStringFactory', () => {
  const arg = Symbol();
  const render = vi.fn();
  const signal = Symbol('signal');
  const replaceWith = vi.fn();
  const placeholder = {
    replaceWith,
  };
  const props = { signal, placeholder, render };
  const args = [props, arg];

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('render a safe string as a normal string', () => {
    const getSafeStringValue = Symbol();
    const renderValue = Symbol();
    const item = Promise.resolve('item');
    getSafeString.mockReturnValueOnce(getSafeStringValue);
    render.mockReturnValueOnce(renderValue);

    const result = renderHtmlSafeStringFactory(item, ...args);
    expect(result).toEqual(renderValue);
    expect(getSafeString).toBeCalledTimes(1);
    expect(getSafeString).toBeCalledWith(item);
    expect(render).toBeCalledTimes(1);
    expect(render).toBeCalledWith(
      getSafeStringValue,
      { ...props, safe: false },
      arg
    );
  });
});
