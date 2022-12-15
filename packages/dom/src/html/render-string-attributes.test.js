import { afterEach, describe, expect, test, vi } from 'vitest';
import { render } from '@async-to-html/render/render.js';
import { ATTRIBUTE_RENDERERS } from '../attribute-renderers/get-attribute-renderers.js';
import { DIRECTIVE_RENDERERS } from '../attribute-renderers/get-directive-renderers.js';
import { filterResult } from './filter-result.js';
import { getResult } from './get-result.js';
import { renderStringAttribute } from './render-string-attributes.js';
import { toDirectiveItem } from './to-directive-item.js';

vi.mock('./to-directive-item.js', () => ({
  toDirectiveItem: vi.fn(),
}));

vi.mock('./get-result.js', () => ({
  getResult: vi.fn(),
}));

vi.mock('./filter-result.js', () => ({
  filterResult: vi.fn(),
}));

vi.mock('../attributes/get-attribute-renderers.js', () => ({
  ATTRIBUTE_RENDERERS: [Symbol('attribute renderer')],
}));

vi.mock('../attributes/get-directive-renderers.js', () => ({
  DIRECTIVE_RENDERERS: [Symbol('directive renderer')],
}));

vi.mock('@async-to-html/render/render.js', () => ({
  render: vi.fn(),
}));

describe('render string attribute', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('directive', () => {
    const nameResult = [Symbol('name result'), Symbol('name result')];
    const valueResult = [Symbol('value result')];
    const filteredResult = Symbol('filtered result');
    const filteredResult2 = Symbol('filtered result2');
    const directiveItem = Symbol('directive item');
    const props = {
      someProp: 'someValue',
    };
    const node = {
      removeAttribute: vi.fn(),
    };
    const attribute = {
      name: Symbol('attributeName'),
      value: Symbol('attributeValue'),
    };
    const components = Symbol('components');
    getResult.mockReturnValueOnce(nameResult);
    getResult.mockReturnValueOnce(valueResult);
    filterResult.mockReturnValueOnce(filteredResult);
    filterResult.mockReturnValueOnce(filteredResult2);
    toDirectiveItem.mockReturnValueOnce(directiveItem);
    renderStringAttribute({ element: node, attribute, components, ...props });

    expect(getResult).toHaveBeenCalledTimes(2);
    expect(getResult).toHaveBeenNthCalledWith(1, attribute.name, components);
    expect(getResult).toHaveBeenNthCalledWith(2, attribute.value, components);
    expect(node.removeAttribute).toHaveBeenCalledTimes(1);
    expect(node.removeAttribute).toHaveBeenNthCalledWith(1, attribute.name);
    expect(toDirectiveItem).toHaveBeenCalledWith(
      filteredResult,
      filteredResult2
    );
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(directiveItem, {
      ...props,
      element: node,
      lastNamesMap: new Set(),
      renderers: DIRECTIVE_RENDERERS,
    });
  });

  test('directive', () => {
    const nameResult = [Symbol('name result'), Symbol('name result')];
    const valueResult = [Symbol('value result')];
    const filteredResult2 = Symbol('filtered result2');
    const directiveItem = Symbol('directive item');
    const props = {
      someProp: 'someValue',
    };
    const node = {
      removeAttribute: vi.fn(),
    };
    const attribute = {
      name: Symbol('attributeName'),
      value: Symbol('attributeValue'),
    };
    const components = Symbol('components');
    getResult.mockReturnValueOnce(nameResult);
    getResult.mockReturnValueOnce(valueResult);
    filterResult.mockReturnValueOnce(null);
    filterResult.mockReturnValueOnce(filteredResult2);
    toDirectiveItem.mockReturnValueOnce(directiveItem);
    renderStringAttribute({ element: node, attribute, components, ...props });

    expect(getResult).toHaveBeenCalledTimes(2);
    expect(getResult).toHaveBeenNthCalledWith(1, attribute.name, components);
    expect(getResult).toHaveBeenNthCalledWith(2, attribute.value, components);
    expect(node.removeAttribute).toHaveBeenCalledTimes(1);
    expect(node.removeAttribute).toHaveBeenNthCalledWith(1, attribute.name);
    expect(toDirectiveItem).toHaveBeenCalledWith(null, filteredResult2);
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(directiveItem, {
      ...props,
      element: node,
      lastNamesMap: new Set(),
      renderers: DIRECTIVE_RENDERERS,
    });
  });

  test('attribute name', () => {
    const nameResult = [Symbol('name result'), Symbol('name result')];
    const valueResult = [Symbol('value result')];
    const filteredResult = Symbol('filtered result');
    const directiveItem = Symbol('directive item');
    const props = {
      someProp: 'someValue',
    };
    const node = {
      removeAttribute: vi.fn(),
    };
    const attribute = {
      name: Symbol('attributeName'),
      value: null,
    };
    const components = Symbol('components');
    getResult.mockReturnValueOnce(nameResult);
    getResult.mockReturnValueOnce(valueResult);
    filterResult.mockReturnValueOnce(filteredResult);
    toDirectiveItem.mockReturnValueOnce(directiveItem);
    renderStringAttribute({ element: node, attribute, components, ...props });

    expect(getResult).toHaveBeenCalledTimes(2);
    expect(getResult).toHaveBeenNthCalledWith(1, attribute.name, components);
    expect(getResult).toHaveBeenNthCalledWith(2, attribute.value, components);
    expect(node.removeAttribute).toHaveBeenCalledTimes(1);
    expect(node.removeAttribute).toHaveBeenNthCalledWith(1, attribute.name);
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(filteredResult, {
      ...props,
      element: node,
      lastNamesMap: new Set(),
      renderers: DIRECTIVE_RENDERERS,
    });
  });

  test('attribute value', () => {
    const nameResult = [Symbol('name result')];
    const valueResult = [Symbol('value result'), Symbol('value result')];
    const filteredResult = Symbol('filtered result');
    const directiveItem = Symbol('directive item');
    const props = {
      someProp: 'someValue',
    };
    const node = {
      setAttribute: vi.fn(),
    };
    const attribute = {
      name: Symbol('attributeName'),
      value: null,
    };
    const components = Symbol('components');
    getResult.mockReturnValueOnce(nameResult);
    getResult.mockReturnValueOnce(valueResult);
    filterResult.mockReturnValueOnce(filteredResult);
    toDirectiveItem.mockReturnValueOnce(directiveItem);
    renderStringAttribute({
      document,
      element: node,
      attribute,
      components,
      ...props,
    });

    expect(getResult).toHaveBeenCalledTimes(2);
    expect(getResult).toHaveBeenNthCalledWith(1, attribute.name, components);
    expect(getResult).toHaveBeenNthCalledWith(2, attribute.value, components);
    expect(node.setAttribute).toHaveBeenCalledTimes(1);
    expect(node.setAttribute).toHaveBeenNthCalledWith(1, attribute.name, '');
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(filteredResult, {
      ...props,
      document,
      element: node,
      key: attribute.name,
      renderers: ATTRIBUTE_RENDERERS,
    });
  });
});
