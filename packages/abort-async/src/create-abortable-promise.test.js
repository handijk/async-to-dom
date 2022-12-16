import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAbortablePromise } from './create-abortable-promise.js';

describe('createAbortablePromise', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('non aborted signal results in non aborted promise', async () => {
    const resolveWith = Symbol('resolve');
    const signal = {
      aborted: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve(resolveWith), 100);
    });
    const abortablePromise = createAbortablePromise({
      signal,
      promise,
    });

    await expect(abortablePromise).resolves.toEqual({
      aborted: false,
      result: resolveWith,
    });
    expect(signal.removeEventListener).toBeCalledTimes(1);
  });

  test('aborted signal after promise resolves results in non aborted promise', async () => {
    const resolveWith = Symbol('resolve');
    const reason = Symbol('reason');
    const signal = {
      aborted: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve(resolveWith), 50);
    });
    const abortablePromise = createAbortablePromise({
      signal,
      promise,
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        signal.reason = reason;
        signal.addEventListener.mock.calls[0][1]();
        resolve();
      }, 100);
    });

    await expect(abortablePromise).resolves.toEqual({
      aborted: false,
      result: resolveWith,
    });
    expect(signal.removeEventListener).toBeCalledTimes(1);
  });

  test('aborted signal before promise resolves results in aborted promise', async () => {
    const resolveWith = Symbol('resolve');
    const reason = Symbol('reason');
    const signal = {
      aborted: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve(resolveWith), 100);
    });
    const abortablePromise = createAbortablePromise({
      signal,
      promise,
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        signal.reason = reason;
        signal.addEventListener.mock.calls[0][1]();
        resolve();
      }, 50);
    });

    await expect(abortablePromise).resolves.toEqual({
      aborted: true,
      result: reason,
    });
    expect(signal.removeEventListener).toBeCalledTimes(1);
  });

  test('already aborted signal results in aborted promise', async () => {
    const resolveWith = Symbol('resolve');
    const reason = Symbol('reason');
    const signal = {
      aborted: true,
      reason,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve(resolveWith), 100);
    });
    const abortablePromise = createAbortablePromise({
      signal,
      promise,
    });

    await expect(abortablePromise).resolves.toEqual({
      aborted: true,
      result: reason,
    });
    expect(signal.removeEventListener).toBeCalledTimes(1);
  });

  test('no signal results in non aborted promise', async () => {
    const resolveWith = Symbol('resolve');
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve(resolveWith), 100);
    });
    const abortablePromise = createAbortablePromise({
      promise,
    });

    await expect(abortablePromise).resolves.toEqual({
      aborted: false,
      result: resolveWith,
    });
  });

  test('no promise and aborted signal results in aborted promise', async () => {
    const reason = Symbol('reason');
    const signal = {
      aborted: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    const abortablePromise = createAbortablePromise({
      signal,
    });

    await new Promise((resolve) => {
      setTimeout(() => {
        signal.reason = reason;
        signal.addEventListener.mock.calls[0][1]();
        resolve();
      }, 50);
    });

    await expect(abortablePromise).resolves.toEqual({
      aborted: true,
      result: reason,
    });
    expect(signal.removeEventListener).toBeCalledTimes(1);
  });

  test('no promise and already aborted results in aborted promise', async () => {
    const reason = Symbol('reason');
    const signal = {
      aborted: true,
      reason,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    const abortablePromise = createAbortablePromise({
      signal,
    });

    await expect(abortablePromise).resolves.toEqual({
      aborted: true,
      result: reason,
    });
    expect(signal.removeEventListener).toBeCalledTimes(1);
  });

  test('no signal and no promise results in never resolving promise', async () => {
    const raceResult = Symbol('race result');
    const abortablePromise = createAbortablePromise();
    const race = new Promise((resolve) => {
      setTimeout(() => resolve(raceResult), 50);
    });

    await expect(Promise.race([abortablePromise, race])).resolves.toEqual(
      raceResult
    );
  });
});
