import { describe, expect, test } from 'vitest';
import { isRenderable } from './is-renderable.js';

describe('isRenderable', () => {
  test('return true when render is a function', () => {
    expect(isRenderable({ render: () => {} })).toBe(true);
  });

  test('return false when render is not a function', () => {
    expect(isRenderable({ render: null })).toBe(false);
  });

  test('return false when it is a falsy value', () => {
    expect(isRenderable(null)).toBe(false);
  });
});
