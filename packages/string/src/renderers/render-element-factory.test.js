import { afterEach, describe, expect, test, vi } from 'vitest';
import { safeHtml } from '@async-to-html/render/safe-html/safe-html.js';
import { renderElementFactory } from './render-element-factory.js';

vi.mock('@async-to-html/render/safe-html/safe-html.js', () => ({
  safeHtml: vi.fn(),
}));

describe('renderElementFactory', () => {
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

  test('call render with the element outerHTML', () => {
    const renderValue = Symbol();
    const safeHtmlValue = Symbol();
    const item = {
      nodeType: 1,
      outerHTML: 'outer-html-mocked',
    };
    safeHtml.mockReturnValueOnce(safeHtmlValue);
    render.mockReturnValueOnce(renderValue);

    const result = renderElementFactory(item, ...args);
    expect(result).toEqual(renderValue);
    expect(render).toBeCalledTimes(1);
    expect(render).toHaveBeenCalledWith(safeHtmlValue, ...args);
    expect(safeHtml).toBeCalledTimes(1);
    expect(safeHtml).toHaveBeenCalledWith(item.outerHTML);
  });

  test('call render with the text value', () => {
    const renderValue = Symbol();
    const safeHtmlValue = Symbol();
    const item = {
      nodeType: 3,
      nodeValue: 'outer-html-mocked',
    };
    safeHtml.mockReturnValueOnce(safeHtmlValue);
    render.mockReturnValueOnce(renderValue);

    const result = renderElementFactory(item, ...args);
    expect(result).toEqual(renderValue);
    expect(render).toBeCalledTimes(1);
    expect(render).toHaveBeenCalledWith(safeHtmlValue, ...args);
    expect(safeHtml).toBeCalledTimes(1);
    expect(safeHtml).toHaveBeenCalledWith(item.nodeValue);
  });

  test('call render with the comment value', () => {
    const renderValue = Symbol();
    const safeHtmlValue = Symbol();
    const item = {
      nodeType: 8,
      nodeValue: 'outer-html-mocked',
    };
    safeHtml.mockReturnValueOnce(safeHtmlValue);
    render.mockReturnValueOnce(renderValue);

    const result = renderElementFactory(item, ...args);
    expect(result).toEqual(renderValue);
    expect(render).toBeCalledTimes(1);
    expect(render).toHaveBeenCalledWith(safeHtmlValue, ...args);
    expect(safeHtml).toBeCalledTimes(1);
    expect(safeHtml).toHaveBeenCalledWith(`<!--${item.nodeValue}-->`);
  });

  test('call render with the fragment contents', () => {
    const renderValue = Symbol();
    const safeHtmlValue = Symbol();
    const item = {
      nodeType: 11,
      childNodes: [
        {
          nodeType: 1,
          outerHTML: 'child1',
        },
        {
          nodeType: 3,
          nodeValue: 'child2',
        },
        {
          nodeType: 8,
          nodeValue: 'child3',
        },
      ],
    };
    safeHtml.mockReturnValueOnce(safeHtmlValue);
    render.mockReturnValueOnce(renderValue);

    const result = renderElementFactory(item, ...args);
    expect(result).toEqual(renderValue);
    expect(render).toBeCalledTimes(1);
    expect(render).toHaveBeenCalledWith(safeHtmlValue, ...args);
    expect(safeHtml).toBeCalledTimes(1);
    expect(safeHtml).toHaveBeenCalledWith(`child1child2<!--child3-->`);
  });
});
