import { describe, expect, test } from 'vitest';
import { isString } from './is-string.js';

describe('isString', () => {
  test('return true when it is a string', () => {
    expect(isString('test')).toBe(true);
  });

  test('return true when it has a toString method', () => {
    expect(isString({ toString: () => {} })).toBe(true);
  });

  test('return false when it has no toString method', () => {
    expect(isString({ toString: null })).toBe(false);
  });

  test('return false when it is falsy', () => {
    expect(isString(null)).toBe(false);
  });
});
