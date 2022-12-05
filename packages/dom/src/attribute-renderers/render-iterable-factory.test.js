import { combineLatest, map, pipe } from 'create-async-generator';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderIterableFactory } from './render-iterable-factory.js';

vi.mock('create-async-generator', () => ({
  combineLatest: vi.fn(),
  map: vi.fn(),
  pipe: vi.fn(),
}));

describe('renderIterableFactory', () => {
  const arg = Symbol();
  const renderResult = Symbol();
  const render = vi.fn(() => renderResult);
  const props = { render };
  const args = [props, arg];
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('return false when the passed item is a string', () => {
    const pipeResult = Symbol();
    const combineLatestResult = Symbol();
    const mapResult = Symbol();
    pipe.mockReturnValueOnce(pipeResult);
    combineLatest.mockReturnValueOnce(combineLatestResult);
    map.mockReturnValueOnce(mapResult);
    const item = 'item';
    const result = renderIterableFactory(item, ...args);
    expect(result).toEqual(renderResult);
    expect(render).toBeCalledTimes(1);
    expect(render).toBeCalledWith(pipeResult, ...args);
    expect(pipe).toBeCalledTimes(1);
    expect(pipe).toBeCalledWith(combineLatestResult, mapResult);
  });
});
