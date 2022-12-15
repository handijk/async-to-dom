import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAbortingAsyncIterable } from '@async-to-html/abort-async/create-aborting-async-iterable.js';
import { renderAsyncIteratorFactory } from './render-async-iterator-factory.js';
import { createAsyncIterableMapFn } from './create-async-iterable-map-fn.js';

vi.mock('@async-to-html/abort-async/create-aborting-async-iterable.js', () => ({
  createAbortingAsyncIterable: vi.fn(),
}));

vi.mock('./create-async-iterable-map-fn', () => ({
  createAsyncIterableMapFn: vi.fn(),
}));

describe('renderAsyncIteratorFactory', () => {
  const arg = Symbol('arg');
  const signal = Symbol('signal');
  const prop = Symbol('prop');
  const mapFn = Symbol('mapFn');
  const props = { signal, prop };
  const args = [props, arg];

  const generator = async function* () {
    yield 1;
    yield 2;
    yield 3;
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('call render for every yield', async () => {
    const asyncIterable = Symbol('asyncIterable');
    createAsyncIterableMapFn.mockReturnValueOnce(mapFn);
    createAbortingAsyncIterable.mockReturnValueOnce(generator());
    await expect(
      renderAsyncIteratorFactory(asyncIterable, ...args)
    ).resolves.toBe(3);
    expect(createAbortingAsyncIterable).toBeCalledWith({
      signal,
      asyncIterable,
      mapFn,
    });
  });
});
