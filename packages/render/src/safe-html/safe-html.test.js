import { describe, expect, test } from 'vitest';
import { getSafeString, isSafeHtml, safeHtml } from './safe-html.js';

describe('safeHtml', () => {
  test('should return the passed in string when called', () => {
    const safeString = Symbol('safe');
    const safe = safeHtml(safeString);
    expect(getSafeString(safe)).toBe(safeString);
    expect(safe.toString()).toBe(safeString);
  });

  test('should return the passed in string when called', () => {
    const safeString = Symbol('safe');
    const safe = safeHtml(safeString);
    expect(isSafeHtml(safe)).toBe(true);
    expect(isSafeHtml({})).toBe(false);
    expect(isSafeHtml(null)).toBe(false);
  });
});
