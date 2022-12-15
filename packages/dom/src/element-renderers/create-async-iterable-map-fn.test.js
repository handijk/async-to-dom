import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAsyncIterableMapFn } from './create-async-iterable-map-fn.js';
import { createAsyncIterablePlaceholder } from './create-async-iterable-placeholder.js';

vi.mock('./create-async-iterable-placeholder.js', () => ({
  createAsyncIterablePlaceholder: vi.fn(),
}));

describe('create-async-iterable-map-fn', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('add placeholder elements and call runAsyncIterator with the next and done methods', () => {
    const render = vi.fn();
    const placeholder = Symbol('placeholder');
    const before = Symbol('before');
    const after = Symbol('after');
    const prop = Symbol('prop');
    const arg = Symbol('arg');
    const props = {
      render,
      placeholder,
      before,
      after,
      prop,
    };
    const args = [props, arg];
    const asyncIterableMapFn = createAsyncIterableMapFn(...args);
    const createdPlaceholder = Symbol('created placeholder');
    const renderResult = Symbol('render result');
    render.mockReturnValueOnce(renderResult);
    createAsyncIterablePlaceholder.mockReturnValueOnce(createdPlaceholder);
    const result = Symbol('result');
    const signal = Symbol('signal');
    const i = Symbol('i');
    expect(asyncIterableMapFn(result, signal, i)).toBe(renderResult);
    expect(render).toHaveBeenCalledWith(
      result,
      { render, prop, signal, placeholder: createdPlaceholder },
      arg
    );
    expect(createAsyncIterablePlaceholder).toHaveBeenCalledWith({
      placeholder,
      before,
      after,
      i,
    });
  });
});
