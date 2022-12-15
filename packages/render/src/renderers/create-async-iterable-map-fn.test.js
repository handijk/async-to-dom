import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAsyncIterableMapFn } from './create-async-iterable-map-fn.js';

describe('create-async-iterable-map-fn', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('add placeholder elements and call runAsyncIterator with the next and done methods', () => {
    const render = vi.fn();
    const placeholder = Symbol('placeholder');
    const prop = Symbol('prop');
    const arg = Symbol('arg');
    const props = {
      render,
      placeholder,
      prop,
    };
    const args = [props, arg];
    const asyncIterableMapFn = createAsyncIterableMapFn(...args);
    const renderResult = Symbol('render result');
    render.mockReturnValueOnce(renderResult);
    const value = Symbol('value');
    const signal = Symbol('signal');
    expect(asyncIterableMapFn(value, signal)).toBe(renderResult);
    expect(render).toHaveBeenCalledWith(
      value,
      { render, prop, signal, placeholder },
      arg
    );
  });
});
