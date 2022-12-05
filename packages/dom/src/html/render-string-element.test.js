import { afterEach, describe, expect, test, vi } from 'vitest';
import { SPECIAL_PLACEHOLDER_ITEM } from '../constants.js';
import { render } from '@async-to-html/render/render.js';
import { ELEMENT_RENDERERS } from '../element-renderers/get-default-renderers.js';
import { filterResult } from './filter-result.js';
import { getResult } from './get-result.js';
import { renderStringElement } from './render-string-element.js';

vi.mock('../elements/get-default-renderers.js', () => ({
  ELEMENT_RENDERERS: [Symbol('element renderer')],
}));

vi.mock('@async-to-html/render/render.js', () => ({
  render: vi.fn(),
}));

vi.mock('./filter-result.js', () => ({
  filterResult: vi.fn(),
}));

vi.mock('./get-result.js', () => ({
  getResult: vi.fn(),
}));

describe('render string element', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('renderElement gets called with the right params', () => {
    const result = Symbol('result');
    const filteredResult = Symbol('filtered result');
    const placeholder = Symbol('placeholder');
    const document = {
      createComment: vi.fn(),
    };
    const props = {
      someProp: 'someValue',
    };
    const node = {
      nodeValue: Symbol('nodeValue'),
      replaceWith: vi.fn(),
    };
    const components = Symbol('components');
    getResult.mockReturnValueOnce(result);
    filterResult.mockReturnValueOnce(filteredResult);
    document.createComment.mockReturnValueOnce(placeholder);
    renderStringElement({ document, element: node, components, ...props });
    expect(document.createComment).toHaveBeenCalledTimes(1);
    expect(document.createComment).toHaveBeenCalledWith(
      SPECIAL_PLACEHOLDER_ITEM
    );
    expect(getResult).toHaveBeenCalledTimes(1);
    expect(getResult).toHaveBeenCalledWith(node.nodeValue, components);
    expect(node.replaceWith).toHaveBeenCalledTimes(1);
    expect(node.replaceWith).toHaveBeenCalledWith(placeholder);
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(filteredResult, {
      ...props,
      placeholder,
      renderers: ELEMENT_RENDERERS,
      document,
    });
  });
});
