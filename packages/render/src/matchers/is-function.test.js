import { describe, expect, test } from 'vitest';
import { isFunction } from './is-function.js';

describe('isFunction', () => {
  test('return true when it is a function', () => {
    expect(isFunction(function () {})).toBe(true);
  });

  test('return true when it is an arrow function', () => {
    expect(isFunction(() => {})).toBe(true);
  });

  test('return false when it is a falsy value', () => {
    expect(isFunction(null)).toBe(false);
  });
});
