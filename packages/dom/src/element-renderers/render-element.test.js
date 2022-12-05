import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderElementFactory } from './render-element.js';

describe('renderElement', () => {
  const placeholder = {
    replaceWith: vi.fn(),
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('call render on the method result with the arguments', () => {
    const item = { nodeType: 1 };
    const result = renderElementFactory(item, { placeholder });
    expect(result).toEqual(item);
    expect(placeholder.replaceWith).toBeCalledTimes(1);
    expect(placeholder.replaceWith).toHaveBeenCalledWith(item);
  });
});
