import { describe, expect, test } from 'vitest';
import { isElement } from './is-element.js';

describe('isElement', () => {
  test('return true for elements with a correct nodetype', () => {
    expect(isElement({ nodeType: 1 })).toBe(true);
    expect(isElement({ nodeType: 3 })).toBe(true);
    expect(isElement({ nodeType: 8 })).toBe(true);
    expect(isElement({ nodeType: 11 })).toBe(true);
  });

  test('return false for elements with an incorrect nodetype', () => {
    expect(isElement({ nodeType: 2 })).toBe(false);
    expect(isElement({ nodeType: 4 })).toBe(false);
    expect(isElement({ nodeType: 7 })).toBe(false);
    expect(isElement({ nodeType: 10 })).toBe(false);
  });

  test('return false for element without a nodetype', () => {
    expect(isElement({})).toBe(false);
  });

  test('return false for falsy values', () => {
    expect(isElement(null)).toBe(false);
  });
});
