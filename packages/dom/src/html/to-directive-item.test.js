import { combineLatest, map, pipe } from 'create-async-generator';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { toDirectiveItem } from './to-directive-item.js';

vi.mock('create-async-generator', () => ({
  combineLatest: vi.fn(),
  map: vi.fn(),
  pipe: vi.fn(),
}));

describe('to directive item', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('returns a directive item', async () => {
    const nameItems = [Symbol('name1'), Symbol('name2')];
    const valueItems = [Symbol('value1'), Symbol('value2')];
    const pipeResult = Symbol('pipeResult');
    const mapResult = Symbol('mapResult');
    const combineLatestResult = Symbol('combineLatestResult');
    pipe.mockReturnValueOnce(pipeResult);
    map.mockReturnValueOnce(mapResult);
    combineLatest.mockReturnValueOnce(combineLatestResult);
    const result = toDirectiveItem(nameItems, valueItems);
    expect(result).toEqual([...nameItems, pipeResult]);
    expect(pipe).toHaveBeenCalledTimes(1);
    expect(pipe).toHaveBeenCalledWith(combineLatestResult, mapResult);
    expect(combineLatest).toHaveBeenCalledTimes(1);
    const valueIterator = combineLatest.mock.calls[0][0][2];
    expect(combineLatest).toHaveBeenCalledWith(['=', '"', valueIterator, '"'], {
      eager: false,
    });
    expect((await valueIterator.next()).value).toEqual('');
    expect((await valueIterator.next()).value).toEqual(valueItems);
    expect(map).toHaveBeenCalledTimes(1);
    const mapper = map.mock.calls[0][0];
    expect(mapper(['henk', 'bert'])).toEqual('henkbert');
  });
});
