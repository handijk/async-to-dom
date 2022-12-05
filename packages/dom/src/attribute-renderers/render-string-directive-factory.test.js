import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderStringDirectiveFactory } from './render-string-directive-factory.js';

describe('renderStringDirectiveFactory', () => {
  const arg = Symbol();
  const setAttributeFn = vi.fn();
  const removeAttributeFn = vi.fn();
  const key = Symbol();
  const template = {
    innerHTML: '',
    content: {
      childNodes: [
        {
          attributes: [],
        },
      ],
    },
  };
  const props = {
    key,
    element: {
      tagName: 'mock-tag',
      setAttribute: setAttributeFn,
      removeAttribute: removeAttributeFn,
    },
    lastNamesMap: null,
  };
  const args = [props, arg];

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('set the attribute to the passed item when no attributes had been set before', () => {
    const document = {
      createElement: vi.fn(() => template),
    };
    const attributes = [
      { name: 'attr1', value: 'value1' },
      { name: 'attr2', value: 'value2' },
      { name: 'attr3', value: 'value3' },
    ];
    const item = 'mocked-item';
    props.lastNamesMap = new Set();
    props.document = document;
    template.content.childNodes[0].attributes = attributes;
    const result = renderStringDirectiveFactory(item, ...args);
    expect(template.innerHTML).toBe('<mock-tag mocked-item></mock-tag>');
    expect(result).toEqual(props.element);
    expect(setAttributeFn).toBeCalledTimes(attributes.length);
    let i = attributes.length;
    while (i-- > 1) {
      expect(props.lastNamesMap.has(attributes[i - 1].name));
      expect(setAttributeFn).toHaveBeenNthCalledWith(
        i,
        attributes[i - 1].name,
        attributes[i - 1].value
      );
    }
    expect(removeAttributeFn).not.toBeCalled();
  });

  test('set the attribute to the passed item when other attributes had been set before', () => {
    const document = {
      createElement: vi.fn(() => template),
    };
    const attributes = [
      { name: 'attr1', value: 'value1' },
      { name: 'attr2', value: 'value2' },
      { name: 'attr3', value: 'value3' },
    ];
    const existingAttributes = ['attr4', 'attr5', 'attr6'];
    const item = 'mocked-item';
    props.lastNamesMap = new Set(existingAttributes);
    props.document = document;
    template.content.childNodes[0].attributes = attributes;
    const result = renderStringDirectiveFactory(item, ...args);
    expect(template.innerHTML).toBe('<mock-tag mocked-item></mock-tag>');
    expect(result).toEqual(props.element);
    expect(setAttributeFn).toBeCalledTimes(attributes.length);
    let i = attributes.length;
    while (i-- > 1) {
      expect(props.lastNamesMap.has(attributes[i - 1].name));
      expect(setAttributeFn).toHaveBeenNthCalledWith(
        i,
        attributes[i - 1].name,
        attributes[i - 1].value
      );
    }
    expect(removeAttributeFn).toBeCalledTimes(3);
    let j = existingAttributes.length;
    while (j-- > 1) {
      expect(removeAttributeFn).toHaveBeenNthCalledWith(
        j,
        existingAttributes[j - 1]
      );
    }
  });

  test('set the attribute to the passed item when the same attributes and one new attribute had been set before', () => {
    const document = {
      createElement: vi.fn(() => template),
    };
    const attributes = [
      { name: 'attr1', value: 'value1' },
      { name: 'attr2', value: 'value2' },
      { name: 'attr3', value: 'value3' },
    ];
    const existingAttributes = ['attr1', 'attr2', 'attr4'];
    const item = 'mocked-item';
    props.lastNamesMap = new Set(existingAttributes);
    props.document = document;
    template.content.childNodes[0].attributes = attributes;
    const result = renderStringDirectiveFactory(item, ...args);
    expect(template.innerHTML).toBe('<mock-tag mocked-item></mock-tag>');
    expect(result).toEqual(props.element);
    expect(setAttributeFn).toBeCalledTimes(attributes.length);
    let i = attributes.length;
    while (i-- > 1) {
      expect(props.lastNamesMap.has(attributes[i - 1].name));
      expect(setAttributeFn).toHaveBeenNthCalledWith(
        i,
        attributes[i - 1].name,
        attributes[i - 1].value
      );
    }
    expect(removeAttributeFn).toBeCalledTimes(1);
    expect(removeAttributeFn).toHaveBeenCalledWith('attr4');
  });
});
