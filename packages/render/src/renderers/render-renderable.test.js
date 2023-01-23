import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderRenderable } from './render-renderable.js';

describe('renderRenderable', () => {
  const renderedItem = Symbol();
  const render = vi.fn(() => renderedItem);
  const args = [
    {
      render,
      prop: Symbol(),
    },
    Symbol(),
  ];

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('call render on the method result with the arguments', () => {
    const returnItem = Symbol();
    const item = { render: vi.fn(() => returnItem) };
    const result = renderRenderable(item, ...args);
    expect(result).toEqual(renderedItem);
    expect(item.render).toBeCalledTimes(1);
    expect(item.render).toHaveBeenCalledWith(...args);
    expect(render).toBeCalledTimes(1);
    expect(render).toHaveBeenCalledWith(returnItem, ...args);
  });
});
