import { afterEach, describe, expect, test, vi } from 'vitest';
import { SPECIAL_PLACEHOLDER_ITEM } from './constants.js';
import { ATTRIBUTE_RENDERERS } from './attribute-renderers/get-attribute-renderers.js';
import { createElement as createElementDomFactory } from './create-element.js';
import { ELEMENT_RENDERERS } from './element-renderers/get-default-renderers.js';
import { render } from '@async-to-html/render/render.js';

vi.mock('./attributes/get-attribute-renderers.js', () => ({
  ATTRIBUTE_RENDERERS: [Symbol('attribute renderer')],
}));

vi.mock('./attributes/get-directive-renderers.js', () => ({
  DIRECTIVE_RENDERERS: [Symbol('directive renderer')],
}));

vi.mock('../elements/get-default-renderers.js', () => ({
  ELEMENT_RENDERERS: [Symbol('element renderer')],
}));

vi.mock('@async-to-html/render/render.js', () => ({
  render: vi.fn(),
}));

describe('dom createElement', () => {
  const arg = Symbol();
  const prop = Symbol();
  const props = { prop };
  const args = [props, arg];
  const document = {
    createElement: vi.fn(),
    createComment: vi.fn(),
  };
  const createElementDom = createElementDomFactory({
    document,
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('tag without attributes and without children', async () => {
    const element = {
      appendChild: vi.fn(),
      setAttribute: vi.fn(),
    };
    const placeholder = Symbol();
    document.createElement.mockReturnValueOnce(element);
    document.createComment.mockReturnValueOnce(placeholder);
    const elementIterator = createElementDom('div').render(...args);
    expect((await elementIterator.next()).value).toBe(element);
    await elementIterator.next();
    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('div');
    expect(render).not.toHaveBeenCalled();
    expect(document.createComment).not.toHaveBeenCalled();
    expect(element.appendChild).not.toHaveBeenCalled();
    expect(element.setAttribute).not.toHaveBeenCalled();
    expect(render).not.toHaveBeenCalled();
  });

  test('tag with attributes and without children', async () => {
    const element = {
      appendChild: vi.fn(),
      setAttribute: vi.fn(),
    };
    const placeholder = Symbol();
    document.createElement.mockReturnValueOnce(element);
    document.createComment.mockReturnValueOnce(placeholder);
    const elementIterator = createElementDom('div', {
      title: 'henk',
      'data-test': 'bert',
    }).render(...args);
    expect((await elementIterator.next()).value).toBe(element);
    await elementIterator.next();
    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('div');
    expect(render).toHaveBeenCalledTimes(2);
    expect(render).toHaveBeenNthCalledWith(
      1,
      'henk',
      {
        prop,
        element,
        key: 'title',
        renderers: ATTRIBUTE_RENDERERS,
        document,
      },
      args[1]
    );
    expect(render).toHaveBeenNthCalledWith(
      2,
      'bert',
      {
        prop,
        element,
        key: 'data-test',
        renderers: ATTRIBUTE_RENDERERS,
        document,
      },
      args[1]
    );
    expect(document.createComment).not.toHaveBeenCalled();
    expect(element.appendChild).not.toHaveBeenCalled();
    expect(element.setAttribute).toHaveBeenCalledTimes(2);
    expect(element.setAttribute).toHaveBeenNthCalledWith(1, 'title', '');
    expect(element.setAttribute).toHaveBeenNthCalledWith(2, 'data-test', '');
  });

  test('tag without attributes and with 1 child', async () => {
    const element = {
      appendChild: vi.fn(),
    };
    const child1 = Symbol('child1');
    const placeholder = Symbol('placeholder');
    document.createElement.mockReturnValueOnce(element);
    document.createComment.mockReturnValueOnce(placeholder);
    const elementIterator = createElementDom('div', null, child1).render(
      ...args
    );
    expect((await elementIterator.next()).value).toBe(element);
    await elementIterator.next();
    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('div');
    expect(document.createComment).toHaveBeenCalledTimes(1);
    expect(document.createComment).toHaveBeenCalledWith(
      SPECIAL_PLACEHOLDER_ITEM
    );
    expect(element.appendChild).toHaveBeenCalledTimes(1);
    expect(element.appendChild).toHaveBeenCalledWith(placeholder);
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(
      child1,
      {
        prop,
        placeholder,
        renderers: ELEMENT_RENDERERS,
        document,
      },
      args[1]
    );
  });

  test('tag without attributes and with 3 children', async () => {
    const element = {
      appendChild: vi.fn(),
    };
    const child1 = Symbol();
    const child2 = Symbol();
    const child3 = Symbol();
    const placeholder1 = Symbol();
    const placeholder2 = Symbol();
    const placeholder3 = Symbol();
    document.createElement.mockReturnValueOnce(element);
    document.createComment.mockReturnValueOnce(placeholder1);
    document.createComment.mockReturnValueOnce(placeholder2);
    document.createComment.mockReturnValueOnce(placeholder3);
    const elementIterator = createElementDom(
      'div',
      null,
      child1,
      child2,
      child3
    ).render(...args);
    expect((await elementIterator.next()).value).toBe(element);
    await elementIterator.next();
    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('div');
    expect(document.createComment).toHaveBeenCalledTimes(3);
    expect(document.createComment).toHaveBeenCalledWith(
      SPECIAL_PLACEHOLDER_ITEM
    );
    expect(element.appendChild).toHaveBeenCalledTimes(3);
    expect(element.appendChild).toHaveBeenNthCalledWith(1, placeholder1);
    expect(element.appendChild).toHaveBeenNthCalledWith(2, placeholder2);
    expect(element.appendChild).toHaveBeenNthCalledWith(3, placeholder3);
    expect(render).toHaveBeenCalledTimes(3);
    expect(render).toHaveBeenNthCalledWith(
      1,
      child1,
      {
        prop,
        placeholder: placeholder1,
        renderers: ELEMENT_RENDERERS,
        document,
      },
      args[1]
    );
    expect(render).toHaveBeenNthCalledWith(
      2,
      child2,
      {
        prop,
        placeholder: placeholder2,
        renderers: ELEMENT_RENDERERS,
        document,
      },
      args[1]
    );
    expect(render).toHaveBeenNthCalledWith(
      3,
      child3,
      {
        prop,
        placeholder: placeholder3,
        renderers: ELEMENT_RENDERERS,
        document,
      },
      args[1]
    );
  });

  test('tag with attributes and with 3 children', async () => {
    const element = {
      appendChild: vi.fn(),
      setAttribute: vi.fn(),
    };
    const child1 = Symbol();
    const child2 = Symbol();
    const child3 = Symbol();
    const placeholder1 = Symbol();
    const placeholder2 = Symbol();
    const placeholder3 = Symbol();
    document.createElement.mockReturnValueOnce(element);
    document.createComment.mockReturnValueOnce(placeholder1);
    document.createComment.mockReturnValueOnce(placeholder2);
    document.createComment.mockReturnValueOnce(placeholder3);
    const elementIterator = createElementDom(
      'div',
      { title: 'henk', 'data-test': 'bert' },
      child1,
      child2,
      child3
    ).render(...args);
    expect((await elementIterator.next()).value).toBe(element);
    await elementIterator.next();
    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('div');
    expect(render).toHaveBeenCalledTimes(5);
    expect(render).toHaveBeenNthCalledWith(
      1,
      'henk',
      {
        prop,
        element,
        key: 'title',
        renderers: ATTRIBUTE_RENDERERS,
        document,
      },
      args[1]
    );
    expect(render).toHaveBeenNthCalledWith(
      2,
      'bert',
      {
        prop,
        element,
        key: 'data-test',
        renderers: ATTRIBUTE_RENDERERS,
        document,
      },
      args[1]
    );
    expect(document.createComment).toHaveBeenCalledTimes(3);
    expect(document.createComment).toHaveBeenCalledWith(
      SPECIAL_PLACEHOLDER_ITEM
    );
    expect(element.appendChild).toHaveBeenCalledTimes(3);
    expect(element.appendChild).toHaveBeenNthCalledWith(1, placeholder1);
    expect(element.appendChild).toHaveBeenNthCalledWith(2, placeholder2);
    expect(element.appendChild).toHaveBeenNthCalledWith(3, placeholder3);
    expect(render).toHaveBeenNthCalledWith(
      3,
      child1,
      {
        prop,
        placeholder: placeholder1,
        renderers: ELEMENT_RENDERERS,
        document,
      },
      args[1]
    );
    expect(render).toHaveBeenNthCalledWith(
      4,
      child2,
      {
        prop,
        placeholder: placeholder2,
        renderers: ELEMENT_RENDERERS,
        document,
      },
      args[1]
    );
    expect(render).toHaveBeenNthCalledWith(
      5,
      child3,
      {
        prop,
        placeholder: placeholder3,
        renderers: ELEMENT_RENDERERS,
        document,
      },
      args[1]
    );
    expect(element.setAttribute).toHaveBeenCalledTimes(2);
    expect(element.setAttribute).toHaveBeenNthCalledWith(1, 'title', '');
    expect(element.setAttribute).toHaveBeenNthCalledWith(2, 'data-test', '');
  });
});
