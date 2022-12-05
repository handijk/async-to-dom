import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderStringAttributeFactory } from './render-string-attribute.js';

describe('renderStringAttribute', () => {
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

  test('set the attribute to the passed item', () => {
    const item = 'item';
    const result = renderStringAttributeFactory(item, ...args);
    expect(result).toEqual(props.element);
    expect(setAttributeFn).toBeCalledTimes(1);
    expect(setAttributeFn).toBeCalledWith(key, item);
  });
});
