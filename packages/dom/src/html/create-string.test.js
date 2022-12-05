import { afterEach, describe, expect, test, vi } from 'vitest';
import { createString } from './create-string.js';

describe('create string', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('returns a replacement string', () => {
    expect(
      createString(
        ['henk', 'bert', 'harry', 'graddus'],
        Symbol(),
        Symbol(),
        Symbol()
      )
    ).toMatchInlineSnapshot(
      `"henkdata-zxs0__bertdata-zxs1__harrydata-zxs2__graddus"`
    );
  });
});
