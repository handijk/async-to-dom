import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  ASYNC_ITERABLE_PLACEHOLDER_AFTER,
  ASYNC_ITERABLE_PLACEHOLDER_BEFORE,
} from '../constants.js';
import { createAbortingAsyncIterable } from '@async-to-html/abort-async/create-aborting-async-iterable.js';
import { renderAsyncIteratorFactory } from './render-async-iterator-factory.js';
import { createAsyncIterableMapFn } from './create-async-iterable-map-fn.js';

vi.mock('@async-to-html/abort-async/create-aborting-async-iterable.js', () => ({
  createAbortingAsyncIterable: vi.fn(),
}));

vi.mock('./create-async-iterable-map-fn.js', () => ({
  createAsyncIterableMapFn: vi.fn(),
}));

describe('renderAsyncIteratorFactory', () => {
  const arg = Symbol('arg');
  const prop = Symbol('prop');
  const signal = Symbol('signal');
  const mapFn = Symbol('mapFn');

  const createComment = vi.fn();
  const document = {
    createComment,
  };
  const props = {
    document,
    signal,
    prop,
  };
  const args = [props, arg];

  const generator = async function* () {
    yield 1;
    yield 2;
    yield 3;
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('add placeholder elements and call runAsyncIterator with the next and done methods', async () => {
    const item = Symbol('item');
    const after = {
      remove: vi.fn(),
    };
    const before = {
      remove: vi.fn(),
    };
    createAsyncIterableMapFn.mockReturnValueOnce(mapFn);
    createComment.mockReturnValueOnce(before);
    createComment.mockReturnValueOnce(after);
    createAbortingAsyncIterable.mockReturnValueOnce(generator());
    await expect(renderAsyncIteratorFactory(item, ...args)).resolves.toEqual(3);
    expect(createComment).toBeCalledTimes(2);
    expect(createComment).toHaveBeenNthCalledWith(
      1,
      ASYNC_ITERABLE_PLACEHOLDER_BEFORE
    );
    expect(createComment).toHaveBeenNthCalledWith(
      2,
      ASYNC_ITERABLE_PLACEHOLDER_AFTER
    );
    expect(createAbortingAsyncIterable).toBeCalledTimes(1);
    expect(createAbortingAsyncIterable).toHaveBeenCalledWith({
      signal,
      asyncIterable: item,
      mapFn,
    });
    expect(after.remove).toBeCalledTimes(1);
    expect(before.remove).toBeCalledTimes(1);
  });

  test('removes 3 siblings and renders the next value', async () => {
    const after = {
      remove: vi.fn(),
    };
    const item = (async function* () {})();
    const before = {
      remove: vi.fn(),
    };
    createAsyncIterableMapFn.mockReturnValueOnce(mapFn);
    createComment.mockReturnValueOnce(before);
    createComment.mockReturnValueOnce(after);
    createAbortingAsyncIterable.mockReturnValueOnce(generator());
    await expect(renderAsyncIteratorFactory(item, ...args)).resolves.toEqual(3);
    expect(createComment).toBeCalledTimes(2);
    expect(createComment).toHaveBeenNthCalledWith(
      1,
      ASYNC_ITERABLE_PLACEHOLDER_BEFORE
    );
    expect(createComment).toHaveBeenNthCalledWith(
      2,
      ASYNC_ITERABLE_PLACEHOLDER_AFTER
    );
    expect(createAbortingAsyncIterable).toBeCalledTimes(1);
    expect(createAbortingAsyncIterable).toHaveBeenCalledWith({
      signal,
      asyncIterable: item,
      mapFn,
    });
    expect(after.remove).toBeCalledTimes(1);
    expect(before.remove).toBeCalledTimes(1);
  });
});
