import { afterEach, describe, expect, test, vi } from 'vitest';
import { returnUntilDone } from './return-until-done.js';

describe('return until done', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('returns until done', async () => {
    const nextFn = vi.fn();
    const returnFn = vi.fn();
    const value1 = Symbol('value1');
    const value2 = Symbol('value2');

    const iterator = {
      next: nextFn,
      return: returnFn,
    };

    returnFn.mockReturnValueOnce({ value: value1, done: false });
    returnFn.mockReturnValueOnce({ value: value2, done: true });
    await expect(returnUntilDone(iterator)).resolves.toEqual(value2);
  });
});
