import { describe, expect, test } from 'vitest';
import { isEmpty } from './is-empty.js';

describe('isEmpty', () => {
  test('return true for null', () => {
    expect(isEmpty(null)).toBe(true);
  });

  test('return true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  test('return true for false', () => {
    expect(isEmpty(false)).toBe(true);
  });

  test('return false for true', () => {
    expect(isEmpty(true)).toBe(false);
  });
});
