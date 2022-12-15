import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAbortableAsyncIterable } from './create-abortable-async-iterable.js';
import { returnUntilDone } from './return-until-done.js';
import { createAbortingAsyncIterable } from './create-aborting-async-iterable.js';
import { createAbortController } from './create-abort-controller.js';

vi.mock('./create-abort-controller.js', () => ({
  createAbortController: vi.fn(),
}));

vi.mock('./create-abortable-async-iterable.js', () => ({
  createAbortableAsyncIterable: vi.fn(),
}));

vi.mock('./return-until-done.js', () => ({
  returnUntilDone: vi.fn(),
}));

describe('createAbortingAsyncIterable', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('runs until the end', async () => {
    const abortableAsyncIterable = Symbol('abortable async iterable');
    const signal = Symbol('signal');
    const abortSignal1 = Symbol('abort signal 1');
    const abortFn1 = vi.fn();
    const abortSignal2 = Symbol('abort signal 2');
    const abortFn2 = vi.fn();
    const abortSignal3 = Symbol('abort signal 3');
    const abortFn3 = vi.fn();
    const abortSignal4 = Symbol('abort signal 4');
    const abortFn4 = vi.fn();
    const result1 = Symbol('promise 1');
    const result2 = Symbol('promise 2');
    const result3 = Symbol('promise 3');
    const result4 = Symbol('promise 4');
    const nextFn = vi.fn();
    const mapFn = vi.fn();

    const iterator = {
      [Symbol.asyncIterator]() {
        return {
          next: nextFn,
        };
      },
    };

    createAbortableAsyncIterable.mockReturnValueOnce(iterator);

    mapFn.mockReturnValueOnce('a');
    nextFn.mockReturnValueOnce(
      Promise.resolve({ value: result1, done: false })
    );
    const asyncIterable = createAbortingAsyncIterable({
      asyncIterable: abortableAsyncIterable,
      signal,
      mapFn,
    });

    mapFn.mockReturnValueOnce('b');
    nextFn.mockReturnValueOnce(
      Promise.resolve({ value: result2, done: false })
    );
    createAbortController.mockReturnValueOnce({
      signal: abortSignal1,
      abort: abortFn1,
    });
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'a',
    });
    mapFn.mockReturnValueOnce('c');
    nextFn.mockReturnValueOnce(
      Promise.resolve({ value: result3, done: false })
    );
    createAbortController.mockReturnValueOnce({
      signal: abortSignal2,
      abort: abortFn2,
    });
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'b',
    });
    mapFn.mockReturnValueOnce('d');
    nextFn.mockReturnValueOnce(Promise.resolve({ value: result4, done: true }));
    createAbortController.mockReturnValueOnce({
      signal: abortSignal3,
      abort: abortFn3,
    });
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'c',
    });
    createAbortController.mockReturnValueOnce({
      signal: abortSignal4,
      abort: abortFn4,
    });
    await expect(asyncIterable.next()).resolves.toEqual({
      done: true,
      value: result4,
    });
    expect(returnUntilDone).toBeCalledTimes(1);
    expect(abortFn1).not.toBeCalled();
    expect(abortFn2).not.toBeCalled();
    expect(abortFn3).not.toBeCalled();
    expect(abortFn4).not.toBeCalled();
  });

  test('skips the second yield because it got aborted', async () => {
    const abortableAsyncIterable = Symbol('abortable async iterable');
    const signal = Symbol('signal');
    const abortSignal1 = Symbol('abort signal 1');
    const abortFn1 = vi.fn();
    const abortSignal2 = Symbol('abort signal 2');
    const abortFn2 = vi.fn();
    const abortSignal3 = Symbol('abort signal 3');
    const abortFn3 = vi.fn();
    const abortSignal4 = Symbol('abort signal 4');
    const abortFn4 = vi.fn();
    const result1 = Symbol('promise 1');
    const result2 = Symbol('promise 2');
    const result3 = Symbol('promise 3');
    const result4 = Symbol('promise 4');
    const nextFn = vi.fn();
    const mapFn = vi.fn();

    const iterator = {
      [Symbol.asyncIterator]() {
        return {
          next: nextFn,
        };
      },
    };

    createAbortableAsyncIterable.mockReturnValueOnce(iterator);

    mapFn.mockReturnValueOnce('a');
    nextFn.mockReturnValueOnce(
      Promise.resolve({ value: result1, done: false })
    );
    const asyncIterable = createAbortingAsyncIterable({
      asyncIterable: abortableAsyncIterable,
      signal,
      mapFn,
    });

    mapFn.mockReturnValueOnce(
      new Promise((resolve) =>
        setTimeout(() => {
          resolve('b');
        }, 100)
      )
    );
    nextFn.mockReturnValueOnce(
      Promise.resolve({ value: result2, done: false })
    );
    createAbortController.mockReturnValueOnce({
      signal: abortSignal1,
      abort: abortFn1,
    });
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'a',
    });
    mapFn.mockReturnValueOnce('c');
    nextFn.mockReturnValueOnce(
      Promise.resolve({ value: result3, done: false })
    );
    nextFn.mockReturnValueOnce(Promise.resolve({ value: result4, done: true }));
    createAbortController.mockReturnValueOnce({
      signal: abortSignal2,
      abort: abortFn2,
    });
    createAbortController.mockReturnValueOnce({
      signal: abortSignal3,
      abort: abortFn3,
    });
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'c',
    });
    mapFn.mockReturnValueOnce('d');
    createAbortController.mockReturnValueOnce({
      signal: abortSignal4,
      abort: abortFn4,
    });
    await expect(asyncIterable.next()).resolves.toEqual({
      done: true,
      value: result4,
    });
    expect(returnUntilDone).toBeCalledTimes(1);
    expect(abortFn1).toBeCalledTimes(1);
    expect(abortFn2).not.toBeCalled();
    expect(abortFn3).not.toBeCalled();
    expect(abortFn4).not.toBeCalled();
  });
});
