import { afterEach, describe, expect, test, vi } from 'vitest';
import { removeElementFactory } from './remove-element.js';

describe('removeElement', () => {
  const placeholder = {
    remove: vi.fn(),
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('remove the placeholder', () => {
    const result = removeElementFactory(undefined, { placeholder });
    expect(result).toEqual(null);
    expect(placeholder.remove).toBeCalledTimes(1);
  });
});
