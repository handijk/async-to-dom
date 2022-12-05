import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  ASYNC_ITERABLE_PLACEHOLDER_AFTER,
  ASYNC_ITERABLE_PLACEHOLDER_BEFORE,
  ASYNC_ITERABLE_PLACHOLDER,
} from '../constants.js';
import { createAbortableAsyncIterable } from '@async-to-html/abort-async/create-abortable-async-iterable.js';
import { renderAsyncIteratorFactory } from './render-async-iterator-factory.js';

vi.mock(
  '@async-to-html/abort-async/create-abortable-async-iterable.js',
  () => ({
    createAbortableAsyncIterable: vi.fn(),
  })
);

describe('renderAsyncIteratorFactory', () => {
  const arg = Symbol('arg');
  const prop = Symbol('prop');
  const signal = Symbol('signal');
  const signal1 = Symbol('signal1');
  const signal2 = Symbol('signal2');
  const signal3 = Symbol('signal3');
  const rendered1 = Symbol('rendered1');
  const rendered2 = Symbol('rendered2');
  const rendered3 = Symbol('rendered3');
  const comment1 = Symbol('comment1');
  const comment2 = Symbol('comment2');
  const comment3 = Symbol('comment3');

  const render = vi.fn();
  const createComment = vi.fn();
  const replaceWith = vi.fn();
  const placeholder = {
    replaceWith,
  };
  const document = {
    createComment,
  };
  const props = {
    document,
    placeholder,
    render,
    signal,
    prop,
  };
  const args = [props, arg];

  const generator = async function* () {
    yield { result: 1, signal: signal1 };
    yield { result: 2, signal: signal2 };
    yield { result: 3, signal: signal3 };
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('add placeholder elements and call runAsyncIterator with the next and done methods', async () => {
    const item = Symbol('item');
    const after = {
      remove: vi.fn(),
      before: vi.fn(),
    };
    const before = {
      remove: vi.fn(),
      nextSibling: after,
    };
    createComment.mockReturnValueOnce(before);
    createComment.mockReturnValueOnce(after);
    createComment.mockReturnValueOnce(comment1);
    createComment.mockReturnValueOnce(comment2);
    createComment.mockReturnValueOnce(comment3);
    createAbortableAsyncIterable.mockReturnValueOnce(generator());
    render.mockReturnValueOnce(rendered1);
    render.mockReturnValueOnce(rendered2);
    render.mockReturnValueOnce(rendered3);
    await expect(renderAsyncIteratorFactory(item, ...args)).resolves.toEqual(
      rendered3
    );
    expect(createComment).toBeCalledTimes(5);
    expect(createComment).toHaveBeenNthCalledWith(
      1,
      ASYNC_ITERABLE_PLACEHOLDER_BEFORE
    );
    expect(createComment).toHaveBeenNthCalledWith(
      2,
      ASYNC_ITERABLE_PLACEHOLDER_AFTER
    );
    expect(createComment).toHaveBeenNthCalledWith(3, ASYNC_ITERABLE_PLACHOLDER);
    expect(createComment).toHaveBeenNthCalledWith(4, ASYNC_ITERABLE_PLACHOLDER);
    expect(createComment).toHaveBeenNthCalledWith(5, ASYNC_ITERABLE_PLACHOLDER);
    expect(replaceWith).toBeCalledTimes(1);
    expect(replaceWith).toHaveBeenCalledWith(before, after);
    expect(createAbortableAsyncIterable).toBeCalledTimes(1);
    expect(createAbortableAsyncIterable).toHaveBeenCalledWith({
      signal,
      asyncIterable: item,
    });
    expect(after.before).toBeCalledTimes(3);
    expect(after.before).toHaveBeenNthCalledWith(1, comment1);
    expect(after.before).toHaveBeenNthCalledWith(2, comment2);
    expect(after.before).toHaveBeenNthCalledWith(3, comment3);
    expect(render).toBeCalledTimes(3);
    expect(render).toHaveBeenNthCalledWith(
      1,
      1,
      { ...props, placeholder: comment1, signal: signal1 },
      arg
    );
    expect(render).toHaveBeenNthCalledWith(
      2,
      2,
      { ...props, placeholder: comment2, signal: signal2 },
      arg
    );
    expect(render).toHaveBeenNthCalledWith(
      3,
      3,
      { ...props, placeholder: comment3, signal: signal3 },
      arg
    );
    expect(after.remove).toBeCalledTimes(1);
    expect(before.remove).toBeCalledTimes(1);
  });

  test('removes 3 siblings and renders the next value', async () => {
    const after = {
      remove: vi.fn(),
      before: vi.fn(),
    };
    const thirdSibling = {
      remove: vi.fn(),
      nextSibling: after,
    };
    const secondSibling = {
      remove: vi.fn(),
      nextSibling: thirdSibling,
    };
    const firstSibling = {
      remove: vi.fn(),
      nextSibling: secondSibling,
    };
    const item = (async function* () {})();
    const before = {
      remove: vi.fn(),
      nextSibling: firstSibling,
    };
    createComment.mockReturnValueOnce(before);
    createComment.mockReturnValueOnce(after);
    createComment.mockReturnValueOnce(comment1);
    createComment.mockReturnValueOnce(comment2);
    createComment.mockReturnValueOnce(comment3);
    createAbortableAsyncIterable.mockReturnValueOnce(generator());
    render.mockReturnValueOnce(rendered1);
    render.mockReturnValueOnce(rendered2);
    render.mockReturnValueOnce(rendered3);
    await expect(renderAsyncIteratorFactory(item, ...args)).resolves.toEqual(
      rendered3
    );
    expect(createComment).toBeCalledTimes(5);
    expect(createComment).toHaveBeenNthCalledWith(
      1,
      ASYNC_ITERABLE_PLACEHOLDER_BEFORE
    );
    expect(createComment).toHaveBeenNthCalledWith(
      2,
      ASYNC_ITERABLE_PLACEHOLDER_AFTER
    );
    expect(createComment).toHaveBeenNthCalledWith(3, ASYNC_ITERABLE_PLACHOLDER);
    expect(createComment).toHaveBeenNthCalledWith(4, ASYNC_ITERABLE_PLACHOLDER);
    expect(createComment).toHaveBeenNthCalledWith(5, ASYNC_ITERABLE_PLACHOLDER);
    expect(replaceWith).toBeCalledTimes(1);
    expect(replaceWith).toHaveBeenCalledWith(before, after);
    expect(createAbortableAsyncIterable).toBeCalledTimes(1);
    expect(createAbortableAsyncIterable).toHaveBeenCalledWith({
      signal,
      asyncIterable: item,
    });
    expect(after.before).toBeCalledTimes(3);
    expect(after.before).toHaveBeenNthCalledWith(1, comment1);
    expect(after.before).toHaveBeenNthCalledWith(2, comment2);
    expect(after.before).toHaveBeenNthCalledWith(3, comment3);
    expect(render).toBeCalledTimes(3);
    expect(render).toHaveBeenNthCalledWith(
      1,
      1,
      { ...props, placeholder: comment1, signal: signal1 },
      arg
    );
    expect(render).toHaveBeenNthCalledWith(
      2,
      2,
      { ...props, placeholder: comment2, signal: signal2 },
      arg
    );
    expect(render).toHaveBeenNthCalledWith(
      3,
      3,
      { ...props, placeholder: comment3, signal: signal3 },
      arg
    );
    expect(after.remove).toBeCalledTimes(1);
    expect(before.remove).toBeCalledTimes(1);
    expect(firstSibling.remove).toBeCalledTimes(3);
    expect(secondSibling.remove).toBeCalledTimes(3);
    expect(thirdSibling.remove).toBeCalledTimes(3);
  });
});
