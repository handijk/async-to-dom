import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAbortController } from './create-abort-controller.js';
import { createAbortablePromise } from './create-abortable-promise.js';
import { createAbortableAsyncIterable } from './create-abortable-async-iterable.js';

vi.mock('./create-abort-controller.js', () => ({
  createAbortController: vi.fn(),
}));

vi.mock('./create-abortable-promise.js', () => ({
  createAbortablePromise: vi.fn(),
}));

describe('createAbortableAsyncIterable', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('runs until the end', async () => {
    const signal = Symbol('signal');
    const signal1 = Symbol('signal1');
    const signal2 = Symbol('signal2');
    const signal3 = Symbol('signal3');
    const promise1 = Symbol('promise1');
    const promise2 = Symbol('promise2');
    const promise3 = Symbol('promise3');
    const promise4 = Symbol('promise4');
    const abort1 = vi.fn();
    const abort2 = vi.fn();
    const abort3 = vi.fn();
    const nextFn = vi.fn();
    const returnFn = vi.fn();

    const iterator = {
      [Symbol.asyncIterator]() {
        return {
          next: nextFn,
          return: returnFn,
        };
      },
    };

    const asyncIterable = createAbortableAsyncIterable({
      asyncIterable: iterator,
      signal,
    });

    createAbortController.mockReturnValueOnce({
      signal: signal1,
      abort: abort1,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'a', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise1);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: { result: 'a', signal: signal1 },
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(1);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(1, {
      promise: promise1,
      signal,
    });
    expect(createAbortController).toHaveBeenCalledTimes(1);
    expect(createAbortController).toHaveBeenNthCalledWith(1, {
      signal,
    });
    createAbortController.mockReturnValueOnce({
      signal: signal2,
      abort: abort2,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'b', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise2);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: { result: 'b', signal: signal2 },
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    expect(abort1).toHaveBeenCalledOnce();
    expect(createAbortController).toHaveBeenCalledTimes(2);
    expect(createAbortController).toHaveBeenNthCalledWith(2, {
      signal,
    });
    createAbortController.mockReturnValueOnce({
      signal: signal3,
      abort: abort3,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'c', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise3);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: { result: 'c', signal: signal3 },
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(3);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(3, {
      promise: promise3,
      signal,
    });
    expect(abort2).toHaveBeenCalledOnce();
    expect(createAbortController).toHaveBeenCalledTimes(3);
    expect(createAbortController).toHaveBeenNthCalledWith(3, {
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
    expect(abort3).not.toHaveBeenCalled();
    expect(createAbortController).toHaveBeenCalledTimes(3);
    expect(returnFn).not.toHaveBeenCalled();
  });

  test('gets aborted after two yields', async () => {
    const signal = Symbol('signal');
    const signal1 = Symbol('signal1');
    const signal2 = Symbol('signal2');
    const promise1 = Symbol('promise1');
    const promise2 = Symbol('promise2');
    const promise3 = Symbol('promise3');
    const abort1 = vi.fn();
    const abort2 = vi.fn();
    const abort3 = vi.fn();
    const nextFn = vi.fn();
    const returnFn = vi.fn();

    const iterator = {
      [Symbol.asyncIterator]() {
        return {
          next: nextFn,
          return: returnFn,
        };
      },
    };

    const asyncIterable = createAbortableAsyncIterable({
      asyncIterable: iterator,
      signal,
    });

    createAbortController.mockReturnValueOnce({
      signal: signal1,
      abort: abort1,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'a', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise1);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: { result: 'a', signal: signal1 },
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(1);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(1, {
      promise: promise1,
      signal,
    });
    expect(createAbortController).toHaveBeenCalledTimes(1);
    expect(createAbortController).toHaveBeenNthCalledWith(1, {
      signal,
    });
    createAbortController.mockReturnValueOnce({
      signal: signal2,
      abort: abort2,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'b', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise2);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: { result: 'b', signal: signal2 },
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    expect(abort1).toHaveBeenCalledOnce();
    expect(createAbortController).toHaveBeenCalledTimes(2);
    expect(createAbortController).toHaveBeenNthCalledWith(2, {
      signal,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'c', done: false },
      aborted: true,
    });
    nextFn.mockReturnValueOnce(promise3);
    returnFn.mockReturnValueOnce({ value: 'x', done: true });
    await expect(asyncIterable.next()).resolves.toEqual({
      done: true,
      value: { result: 'x', signal: signal2 },
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(3);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(3, {
      promise: promise3,
      signal,
    });
    expect(abort2).not.toHaveBeenCalled();
    expect(createAbortController).toHaveBeenCalledTimes(2);
    expect(createAbortController).toHaveBeenNthCalledWith(2, {
      signal,
    });
    expect(abort3).not.toHaveBeenCalled();
    expect(returnFn).toHaveBeenCalledTimes(1);
  });

  test('return is called after two yields', async () => {
    const signal = Symbol('signal');
    const signal1 = Symbol('signal1');
    const signal2 = Symbol('signal2');
    const promise1 = Symbol('promise1');
    const promise2 = Symbol('promise2');
    const promise3 = Symbol('promise3');
    const abort1 = vi.fn();
    const abort2 = vi.fn();
    const abort3 = vi.fn();
    const nextFn = vi.fn();
    const returnFn = vi.fn();

    const iterator = {
      [Symbol.asyncIterator]() {
        return {
          next: nextFn,
          return: returnFn,
        };
      },
    };

    const asyncIterable = createAbortableAsyncIterable({
      asyncIterable: iterator,
      signal,
    });

    createAbortController.mockReturnValueOnce({
      signal: signal1,
      abort: abort1,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'a', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise1);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: { result: 'a', signal: signal1 },
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(1);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(1, {
      promise: promise1,
      signal,
    });
    expect(createAbortController).toHaveBeenCalledTimes(1);
    expect(createAbortController).toHaveBeenNthCalledWith(1, {
      signal,
    });
    createAbortController.mockReturnValueOnce({
      signal: signal2,
      abort: abort2,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'b', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise2);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: { result: 'b', signal: signal2 },
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    expect(abort1).toHaveBeenCalledOnce();
    expect(createAbortController).toHaveBeenCalledTimes(2);
    expect(createAbortController).toHaveBeenNthCalledWith(2, {
      signal,
    });
    nextFn.mockReturnValueOnce(promise3);
    returnFn.mockReturnValueOnce({ value: 'x', done: true });
    await expect(asyncIterable.return()).resolves.toEqual({
      done: true,
      value: undefined,
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    expect(abort2).not.toHaveBeenCalled();
    expect(createAbortController).toHaveBeenCalledTimes(2);
    expect(createAbortController).toHaveBeenNthCalledWith(2, {
      signal,
    });
    expect(abort3).not.toHaveBeenCalled();
    expect(returnFn).toHaveBeenCalledTimes(1);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: true,
      value: undefined,
    });
  });

  test('throws an error after two yields', async () => {
    const signal = Symbol('signal');
    const signal1 = Symbol('signal1');
    const signal2 = Symbol('signal2');
    const promise1 = Symbol('promise1');
    const promise2 = Symbol('promise2');
    const promise4 = Symbol('promise4');
    const error = new Error('mocked error');
    const abort1 = vi.fn();
    const abort2 = vi.fn();
    const nextFn = vi.fn();
    const returnFn = vi.fn();

    const iterator = {
      [Symbol.asyncIterator]() {
        return {
          next: nextFn,
          return: returnFn,
        };
      },
    };

    const asyncIterable = createAbortableAsyncIterable({
      asyncIterable: iterator,
      signal,
    });

    createAbortController.mockReturnValueOnce({
      signal: signal1,
      abort: abort1,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'a', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise1);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: { result: 'a', signal: signal1 },
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(1);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(1, {
      promise: promise1,
      signal,
    });
    expect(createAbortController).toHaveBeenCalledTimes(1);
    expect(createAbortController).toHaveBeenNthCalledWith(1, {
      signal,
    });
    createAbortController.mockReturnValueOnce({
      signal: signal2,
      abort: abort2,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'b', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise2);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: { result: 'b', signal: signal2 },
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    expect(abort1).toHaveBeenCalledOnce();
    expect(createAbortController).toHaveBeenCalledTimes(2);
    expect(createAbortController).toHaveBeenNthCalledWith(2, {
      signal,
    });
    nextFn.mockImplementationOnce(() => {
      throw error;
    });
    returnFn.mockReturnValueOnce({ value: 'x', done: true });
    await expect(asyncIterable.next()).rejects.toEqual(error);
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    expect(abort2).not.toHaveBeenCalled();
    expect(createAbortController).toHaveBeenCalledTimes(2);
    expect(createAbortController).toHaveBeenNthCalledWith(2, {
      signal,
    });
    nextFn.mockReturnValueOnce(promise4);
    await asyncIterable.next();
    await expect(asyncIterable.next()).resolves.toEqual({
      done: true,
      value: undefined,
    });
    expect(returnFn).toHaveBeenCalledTimes(1);
  });

  test('return gets called until it is done', async () => {
    const signal = Symbol('signal');
    const signal1 = Symbol('signal1');
    const signal2 = Symbol('signal2');
    const promise1 = Symbol('promise1');
    const promise2 = Symbol('promise2');
    const promise3 = Symbol('promise3');
    const abort1 = vi.fn();
    const abort2 = vi.fn();
    const abort3 = vi.fn();
    const nextFn = vi.fn();
    const returnFn = vi.fn();

    const iterator = {
      [Symbol.asyncIterator]() {
        return {
          next: nextFn,
          return: returnFn,
        };
      },
    };

    const asyncIterable = createAbortableAsyncIterable({
      asyncIterable: iterator,
      signal,
    });

    createAbortController.mockReturnValueOnce({
      signal: signal1,
      abort: abort1,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'a', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise1);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: { result: 'a', signal: signal1 },
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(1);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(1, {
      promise: promise1,
      signal,
    });
    expect(createAbortController).toHaveBeenCalledTimes(1);
    expect(createAbortController).toHaveBeenNthCalledWith(1, {
      signal,
    });
    createAbortController.mockReturnValueOnce({
      signal: signal2,
      abort: abort2,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'b', done: false },
      aborted: false,
    });
    nextFn.mockReturnValueOnce(promise2);
    await expect(asyncIterable.next()).resolves.toEqual({
      done: false,
      value: { result: 'b', signal: signal2 },
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(2);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(2, {
      promise: promise2,
      signal,
    });
    expect(abort1).toHaveBeenCalledOnce();
    expect(createAbortController).toHaveBeenCalledTimes(2);
    expect(createAbortController).toHaveBeenNthCalledWith(2, {
      signal,
    });
    createAbortablePromise.mockReturnValueOnce({
      result: { value: 'c', done: false },
      aborted: true,
    });
    nextFn.mockReturnValueOnce(promise3);
    returnFn.mockReturnValueOnce({ value: 'x', done: false });
    returnFn.mockReturnValueOnce({ value: 'y', done: false });
    returnFn.mockReturnValueOnce({ value: 'z', done: true });
    await expect(asyncIterable.next()).resolves.toEqual({
      done: true,
      value: { result: 'z', signal: signal2 },
    });
    expect(createAbortablePromise).toHaveBeenCalledTimes(3);
    expect(createAbortablePromise).toHaveBeenNthCalledWith(3, {
      promise: promise3,
      signal,
    });
    expect(abort2).not.toHaveBeenCalled();
    expect(createAbortController).toHaveBeenCalledTimes(2);
    expect(createAbortController).toHaveBeenNthCalledWith(2, {
      signal,
    });
    expect(abort3).not.toHaveBeenCalled();
    expect(returnFn).toHaveBeenCalledTimes(3);
  });
});
