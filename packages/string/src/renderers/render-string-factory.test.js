import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderStringFactory } from './render-string-factory.js';

describe('renderStringFactory', () => {
  const arg = Symbol();
  const encodedValue = Symbol();
  const encode = vi.fn(() => encodedValue);
  const signal = Symbol('signal');
  const replaceWith = vi.fn();
  const placeholder = {
    replaceWith,
  };
  const props = { signal, placeholder, encode };
  const args = [props, arg];

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('encode the result if safety is required', () => {
    const stringItem = Symbol();
    const item = {
      toString: vi.fn(() => stringItem),
    };
    props.safe = true;
    const result = renderStringFactory(item, ...args);
    expect(result).toEqual(encodedValue);
    expect(item.toString).toBeCalledTimes(1);
    expect(encode).toBeCalledTimes(1);
    expect(encode).toHaveBeenCalledWith(stringItem);
  });

  test('do not encode the result if safety is not required', () => {
    const stringItem = Symbol();
    const item = {
      toString: vi.fn(() => stringItem),
    };
    props.safe = false;
    const result = renderStringFactory(item, ...args);
    expect(result).toEqual(stringItem);
    expect(item.toString).toBeCalledTimes(1);
    expect(encode).not.toBeCalled();
  });
});
