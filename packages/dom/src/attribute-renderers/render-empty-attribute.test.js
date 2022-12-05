import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderEmptyAttributeFactory } from './render-empty-attribute.js';

describe('renderEmptyAttribute', () => {
  const arg = Symbol();
  const setAttributeFn = vi.fn();
  const key = Symbol();
  const props = {
    key,
    element: {
      setAttribute: setAttributeFn,
    },
  };
  const args = [props, arg];

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('set the attribute to an empty string', () => {
    const item = 'item';
    const result = renderEmptyAttributeFactory(item, ...args);
    expect(result).toEqual(props.element);
    expect(setAttributeFn).toBeCalledTimes(1);
    expect(setAttributeFn).toBeCalledWith(key, '');
  });
});
