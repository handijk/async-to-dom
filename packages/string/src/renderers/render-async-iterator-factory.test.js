import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAbortableAsyncIterable } from '@async-to-html/abort-async/create-abortable-async-iterable.js';
import { renderAsyncIteratorFactory } from './render-async-iterator-factory.js';

vi.mock(
  '@async-to-html/abort-async/create-abortable-async-iterable.js',
  () => ({
    createAbortableAsyncIterable: vi.fn(),
  })
);

describe('renderAsyncIteratorFactory', () => {
  const render = vi.fn();
  const arg = Symbol('arg');
  const signal = Symbol('signal');
  const signal1 = Symbol('signal1');
  const signal2 = Symbol('signal2');
  const signal3 = Symbol('signal3');
  const prop = Symbol('prop');
  const props = { render, signal, prop };
  const args = [props, arg];

  const generator = async function* () {
    yield { result: 1, signal: signal1 };
    yield { result: 2, signal: signal2 };
    yield { result: 3, signal: signal3 };
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('call render for the last yield', async () => {
    const asyncIterable = Symbol('asyncIterable');
    const rendered1 = Symbol('rendered1');
    createAbortableAsyncIterable.mockReturnValueOnce(generator());
    render.mockReturnValueOnce(rendered1);
    await expect(
      renderAsyncIteratorFactory(asyncIterable, ...args)
    ).resolves.toBe(rendered1);
    expect(createAbortableAsyncIterable).toBeCalledWith({
      signal,
      asyncIterable,
    });
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenNthCalledWith(
      1,
      3,
      { ...props, signal: signal3 },
      arg
    );
  });
});
