import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderFunctionFactory } from './render-function-factory.js';

describe('renderFunctionFactory', () => {
  const args = [Symbol()];
  const rendered = Symbol();
  const render = vi.fn(() => rendered);
  const props = { args, render };

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('call render on the method result with the arguments', () => {
    const returnItem = Symbol();
    const item = vi.fn(() => returnItem);
    const result = renderFunctionFactory(item, props);
    expect(result).toEqual(rendered);
    expect(render).toBeCalledTimes(1);
    expect(render).toHaveBeenCalledWith(returnItem, props);
    expect(item).toBeCalledTimes(1);
    expect(item).toHaveBeenCalledWith(...args);
  });
});
