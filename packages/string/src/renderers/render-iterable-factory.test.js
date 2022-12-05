import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderIterableFactory } from './render-iterable-factory.js';

describe('renderIterableFactory', () => {
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

  test('join all render results', async () => {
    const renderValue = 'mockedstring';
    const child1 = Symbol();
    const child2 = Symbol();
    const child3 = Symbol();
    const item = [child1, child2, child3];
    render.mockReturnValue(renderValue);
    const result = await renderIterableFactory(item, ...args);
    expect(result).toEqual(`${renderValue}${renderValue}${renderValue}`);
    expect(render).toBeCalledTimes(3);
    expect(render).toHaveBeenNthCalledWith(1, child1, ...args);
    expect(render).toHaveBeenNthCalledWith(2, child2, ...args);
    expect(render).toHaveBeenNthCalledWith(3, child3, ...args);
  });
});
