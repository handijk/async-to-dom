import { afterEach, describe, expect, test, vi } from 'vitest';
import { getResult } from './get-result.js';

describe('get result', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('returns an array of strings and items', () => {
    const items = [Symbol(), Symbol(), Symbol()];
    expect(
      getResult('henkdata-zxs0__bertdata-zxs1__harrydata-zxs2__graddus', items)
    ).toEqual([
      'henk',
      items[0],
      'bert',
      items[1],
      'harry',
      items[2],
      'graddus',
    ]);
  });
});
