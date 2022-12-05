import { afterEach, describe, expect, test, vi } from 'vitest';
import { filterResult } from './filter-result.js';

describe('filter result', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('removes all empty strings', () => {
    const item = Symbol();
    expect(
      filterResult(['henk', item, 'bert', 'harry', '', 'graddus'])
    ).toEqual(['henk', item, 'bert', 'harry', 'graddus']);
  });

  test('a single item in the result will return only the item', () => {
    const item = Symbol();
    expect(filterResult([item, ''])).toEqual(item);
  });
});
