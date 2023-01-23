import { encode } from 'html-entities';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { render } from '@async-to-html/render/render.js';
import { safeHtml } from '@async-to-html/render/safe-html/safe-html.js';
import { createElement as createElementFactory } from './create-element.js';
import { STRING_RENDERERS } from './renderers/get-default-renderers.js';

vi.mock('html-entities', () => ({
  encode: vi.fn(),
}));

vi.mock('./renderers/get-default-renderers.js', () => ({
  STRING_RENDERERS: [Symbol('string renderer')],
}));

vi.mock('@async-to-html/render/safe-html/safe-html.js', () => ({
  safeHtml: vi.fn(),
}));

vi.mock('@async-to-html/render/render.js', () => ({
  render: vi.fn(),
}));

describe('string createElement', () => {
  const arg = Symbol();
  const prop = Symbol();
  const props = { prop };
  const args = [props, arg];

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('tag without attributes and without children', async () => {
    const createElement = createElementFactory();
    const element = Symbol('element');
    safeHtml.mockReturnValueOnce(element);
    const elementPromise = createElement('div').render(...args);
    expect(await elementPromise).toBe(element);
    expect(render).not.toBeCalled();
    expect(safeHtml).toBeCalledTimes(1);
    expect(safeHtml.mock.calls[0][0]).toMatchInlineSnapshot(`"<div ></div>"`);
  });

  test('tag with attributes and without children', async () => {
    const createElement = createElementFactory();
    const element = Symbol('element');
    const result1 = 'result1';
    const result2 = 'result2';
    safeHtml.mockReturnValueOnce(element);
    render.mockReturnValueOnce(result1);
    render.mockReturnValueOnce(result2);
    const elementPromise = createElement('div', {
      title: 'henk',
      'data-test': 'bert',
    }).render(...args);
    expect(await elementPromise).toBe(element);
    expect(render).toBeCalledTimes(2);
    expect(render).toHaveBeenNthCalledWith(
      1,
      'henk',
      {
        prop,
        safe: false,
        renderers: STRING_RENDERERS,
        encode,
      },
      args[1]
    );
    expect(render).toHaveBeenNthCalledWith(
      2,
      'bert',
      {
        prop,
        safe: false,
        renderers: STRING_RENDERERS,
        encode,
      },
      args[1]
    );
    expect(safeHtml).toBeCalledTimes(1);
    expect(safeHtml.mock.calls[0][0]).toMatchInlineSnapshot(
      '"<div title=\\"result1\\" data-test=\\"result2\\"></div>"'
    );
  });

  test('tag without attributes and with 1 child', async () => {
    const createElement = createElementFactory();
    const element = Symbol('element');
    const child1 = Symbol('child1');
    const result1 = 'result1';
    safeHtml.mockReturnValueOnce(element);
    render.mockReturnValueOnce(result1);
    const elementPromise = createElement('div', null, child1).render(...args);
    expect(await elementPromise).toBe(element);
    expect(render).toBeCalledTimes(1);
    expect(render).toHaveBeenNthCalledWith(
      1,
      child1,
      {
        prop,
        safe: true,
        renderers: STRING_RENDERERS,
        encode,
      },
      args[1]
    );
    expect(safeHtml).toBeCalledTimes(1);
    expect(safeHtml.mock.calls[0][0]).toMatchInlineSnapshot(
      `"<div >result1</div>"`
    );
  });

  test('tag without attributes and with 3 children', async () => {
    const createElement = createElementFactory();
    const element = Symbol('element');
    const child1 = Symbol('child1');
    const child2 = Symbol('child2');
    const child3 = Symbol('child3');
    const result1 = 'result1';
    const result2 = 'result2';
    const result3 = 'result3';
    safeHtml.mockReturnValueOnce(element);
    render.mockReturnValueOnce(result1);
    render.mockReturnValueOnce(result2);
    render.mockReturnValueOnce(result3);
    const elementPromise = createElement(
      'div',
      null,
      child1,
      child2,
      child3
    ).render(...args);
    expect(await elementPromise).toBe(element);
    expect(render).toBeCalledTimes(3);
    expect(render).toHaveBeenNthCalledWith(
      1,
      child1,
      {
        prop,
        safe: true,
        renderers: STRING_RENDERERS,
        encode,
      },
      args[1]
    );
    expect(render).toHaveBeenNthCalledWith(
      2,
      child2,
      {
        prop,
        safe: true,
        renderers: STRING_RENDERERS,
        encode,
      },
      args[1]
    );
    expect(render).toHaveBeenNthCalledWith(
      3,
      child3,
      {
        prop,
        safe: true,
        renderers: STRING_RENDERERS,
        encode,
      },
      args[1]
    );
    expect(safeHtml).toBeCalledTimes(1);
    expect(safeHtml.mock.calls[0][0]).toMatchInlineSnapshot(
      `"<div >result1result2result3</div>"`
    );
  });

  test('tag with attributes and with 3 children', async () => {
    const createElement = createElementFactory();
    const element = Symbol('element');
    const child1 = Symbol('child1');
    const child2 = Symbol('child2');
    const child3 = Symbol('child3');
    const result1 = 'result1';
    const result2 = 'result2';
    const result3 = 'result3';
    safeHtml.mockReturnValueOnce(element);
    render.mockReturnValueOnce(result1);
    render.mockReturnValueOnce(result2);
    render.mockReturnValueOnce(result3);
    const elementPromise = createElement(
      'div',
      { title: 'henk', 'data-test': 'bert' },
      child1,
      child2,
      child3
    ).render(...args);
    expect(await elementPromise).toBe(element);
    expect(render).toBeCalledTimes(5);
    expect(render).toHaveBeenNthCalledWith(
      1,
      'henk',
      {
        prop,
        safe: false,
        renderers: STRING_RENDERERS,
        encode,
      },
      args[1]
    );
    expect(render).toHaveBeenNthCalledWith(
      2,
      'bert',
      {
        prop,
        safe: false,
        renderers: STRING_RENDERERS,
        encode,
      },
      args[1]
    );
    expect(render).toHaveBeenNthCalledWith(
      3,
      child1,
      {
        prop,
        safe: true,
        renderers: STRING_RENDERERS,
        encode,
      },
      args[1]
    );
    expect(render).toHaveBeenNthCalledWith(
      4,
      child2,
      {
        prop,
        safe: true,
        renderers: STRING_RENDERERS,
        encode,
      },
      args[1]
    );
    expect(render).toHaveBeenNthCalledWith(
      5,
      child3,
      {
        prop,
        safe: true,
        renderers: STRING_RENDERERS,
        encode,
      },
      args[1]
    );
    expect(safeHtml).toBeCalledTimes(1);
    expect(safeHtml.mock.calls[0][0]).toMatchInlineSnapshot(
      '"<div title=\\"result1\\" data-test=\\"result2\\">result3</div>"'
    );
  });
});
