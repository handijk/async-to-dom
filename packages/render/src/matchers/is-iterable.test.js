import { describe, expect, test } from 'vitest';
import { isIterable } from './is-iterable.js';

describe('isIterable', () => {
  test('return true when it defines an iterator function', () => {
    expect(isIterable({ [Symbol.iterator]() {} })).toBe(true);
  });

  test('return true when it is an array', () => {
    expect(isIterable([])).toBe(true);
  });

  test('return false when it is a string', () => {
    expect(isIterable('test')).toBe(false);
  });

  test('return false when it contains a nodetype', () => {
    expect(isIterable({ [Symbol.iterator]() {}, nodeType: 1 })).toBe(false);
  });

  test('return false when it is a falsy value', () => {
    expect(isIterable(null)).toBe(false);
  });
});
