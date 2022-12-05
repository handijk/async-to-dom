import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderEmptyFactory } from './render-empty.js';

describe('renderEmpty', () => {
  const arg = Symbol();
  const signal = Symbol('signal');
  const replaceWith = vi.fn();
  const placeholder = {
    replaceWith,
  };
  const props = { signal, placeholder };
  const args = [props, arg];

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('will return an empty string', () => {
    const result = renderEmptyFactory('', ...args);
    expect(result).toEqual('');
  });
});
