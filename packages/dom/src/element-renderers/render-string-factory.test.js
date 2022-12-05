import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderStringFactory } from './render-string-factory.js';

describe('renderStringFactory', () => {
  const replaceWith = vi.fn();
  const document = {
    createTextNode: vi.fn(),
  };
  const args = {
    document,
    placeholder: {
      replaceWith,
    },
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should call renderElement when the item is a string', () => {
    const item = 'item';
    const element = Symbol('element');
    document.createTextNode.mockReturnValueOnce(element);
    const result = renderStringFactory(item, args);
    expect(result).toEqual(element);
    expect(document.createTextNode).toBeCalledTimes(1);
    expect(document.createTextNode).toHaveBeenCalledWith(item);
    expect(replaceWith).toBeCalledTimes(1);
    expect(replaceWith).toHaveBeenCalledWith(element);
  });
});
