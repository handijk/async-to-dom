import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAbortablePromise } from './create-abortable-promise.js';
import { createAbortableAsyncIterable } from './create-abortable-async-iterable.js';
import { returnUntilDone } from './return-until-done.js';

vi.mock('./create-abortable-promise.js', () => ({
  createAbortablePromise: vi.fn(),
}));

vi.mock('./return-until-done.js', () => ({
  returnUntilDone: vi.fn(),
}));

describe('createAbortableAsyncIterable', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('runs until the end', async () => {
    const signal = Symbol('signal');
    const promise1 = Symbol('promise1');
    const promise2 = Symbol('promise2');
    const promise3 = Symbol('promise3');
    const promise4 = Symbol('promise4');
    const nextFn = vi.fn();

    const iterator = {
      [Symbol.asyncIterator]() {
        return {
          next: nextFn,
        };
      },
    };

    const asyncIterable = createAbortableAsyncIterable({
      asyncIterable: iterator,
      signal,
    });

    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'a', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise1);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'a',
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(1);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(1, {
      promise: promise1,
      signal,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'b', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise2);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'b',
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'c', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise3);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'c',
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(3);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(3, {
      promise: promise3,
      signal,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: undefined, done: true },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise4);
    await asyncIterable.next();
    await expect(asyncIterable.next()).resolves.toEqual({
      done: true,
      result: undefined,
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(4);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(4, {
      promise: promise4,
      signal,
    });
  });

  test('gets aborted after two yields', async () => {
    const signal = Symbol('signal');
    const promise1 = Symbol('promise1');
    const promise2 = Symbol('promise2');
    const promise3 = Symbol('promise3');
    const nextFn = vi.fn();

    const iterator = {
      [Symbol.asyncIterator]() {
        return {
          next: nextFn,
        };
      },
    };

    const asyncIterable = createAbortableAsyncIterable({
      asyncIterable: iterator,
      signal,
    });

    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'a', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise1);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'a',
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(1);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(1, {
      promise: promise1,
      signal,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'b', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise2);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'b',
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'c', done: false },
      aborted: true,
    });
    nextFn.mockReturnValueOnce(promise3);
    returnUntilDone.mockReturnValueOnce('x');
    await expect(asyncIterable.next()).resolves.toEqual({
      done: true,
      value: 'x',
    });
    expect(returnUntilDone).toHaveBeenCalledTimes(2);
  });

  test('return is called after two yields', async () => {
    const signal = Symbol('signal');
    const promise1 = Symbol('promise1');
    const promise2 = Symbol('promise2');
    const promise3 = Symbol('promise3');
    const nextFn = vi.fn();

    const iterator = {
      [Symbol.asyncIterator]() {
        return {
          next: nextFn,
        };
      },
    };

    const asyncIterable = createAbortableAsyncIterable({
      asyncIterable: iterator,
      signal,
    });

    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'a', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise1);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'a',
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(1);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(1, {
      promise: promise1,
      signal,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'b', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise2);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'b',
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    nextFn.mockReturnValueOnce(promise3);
    returnUntilDone.mockReturnValueOnce('x');
    await expect(asyncIterable.return()).resolves.toEqual({
      done: true,
      value: undefined,
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    await expect(asyncIterable.next()).resolves.toEqual({
      done: true,
      value: undefined,
    });
    expect(returnUntilDone).toHaveBeenCalledTimes(1);
  });

  test('throws an error after two yields', async () => {
    const signal = Symbol('signal');
    const promise1 = Symbol('promise1');
    const promise2 = Symbol('promise2');
    const promise4 = Symbol('promise4');
    const error = new Error('mocked error');
    const nextFn = vi.fn();

    const iterator = {
      [Symbol.asyncIterator]() {
        return {
          next: nextFn,
        };
      },
    };

    const asyncIterable = createAbortableAsyncIterable({
      asyncIterable: iterator,
      signal,
    });

    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'a', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise1);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'a',
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(1);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(1, {
      promise: promise1,
      signal,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'b', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise2);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'b',
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    nextFn.mockImplementationOnce(() => {
      throw error;
    });
    returnUntilDone.mockReturnValueOnce('x');
    await expect(asyncIterable.next()).rejects.toEqual(error);
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    nextFn.mockReturnValueOnce(promise4);
    await asyncIterable.next();
    await expect(asyncIterable.next()).resolves.toEqual({
      done: true,
      value: undefined,
    });
    expect(returnUntilDone).toHaveBeenCalledTimes(1);
  });

  test('return gets called until it is done', async () => {
    const signal = Symbol('signal');
    const promise1 = Symbol('promise1');
    const promise2 = Symbol('promise2');
    const promise3 = Symbol('promise3');
    const nextFn = vi.fn();

    const iterator = {
      [Symbol.asyncIterator]() {
        return {
          next: nextFn,
        };
      },
    };

    const asyncIterable = createAbortableAsyncIterable({
      asyncIterable: iterator,
      signal,
    });

    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'a', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise1);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'a',
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(1);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(1, {
      promise: promise1,
      signal,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'b', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise2);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: 'b',
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'c', done: false },
      aborted: true,
    });
    nextFn.mockReturnValueOnce(promise3);
    returnUntilDone.mockReturnValueOnce('z');
    await expect(asyncIterable.next()).resolves.toEqual({
      done: true,
      value: 'z',
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(3);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(3, {
      promise: promise3,
      signal,
    });
    expect(returnUntilDone).toHaveBeenCalledTimes(2);
  });
});
