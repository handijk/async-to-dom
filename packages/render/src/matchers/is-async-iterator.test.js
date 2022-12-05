import { describe, expect, test } from 'vitest';
import { isAsyncIterator } from './is-async-iterator.js';

describe('isAsyncIterator', () => {
  test('return true with an object defining an async iterable method', () => {
    expect(isAsyncIterator({ [Symbol.asyncIterator]() {} })).toBe(true);
  });

  test('return true with generator return value', () => {
    expect(isAsyncIterator((async function* () {})())).toBe(true);
  });

  test('return false when a value is non async iterable', () => {
    expect(isAsyncIterator({})).toBe(false);
  });

  test('return false when a value is falsy', () => {
    expect(isAsyncIterator(null)).toBe(false);
  });
});
