import { describe, expect, test } from 'vitest';
import { isPromise } from './is-promise.js';

describe('isPromise', () => {
  test('return true when it thenable', () => {
    expect(isPromise({ then: () => {} })).toBe(true);
  });

  test('return true when it is a promise', () => {
    expect(isPromise(Promise.resolve('test'))).toBe(true);
  });

  test('return false when it is not thenable or a promise', () => {
    expect(isPromise({})).toBe(false);
  });

  test('return false when it is falsy', () => {
    expect(isPromise(null)).toBe(false);
  });
});
