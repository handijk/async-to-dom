import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAbortablePromise } from '@async-to-html/abort-async/create-abortable-promise.js';
import { renderPromiseFactory } from './render-promise-factory.js';

vi.mock('@async-to-html/abort-async/create-abortable-promise.js', () => ({
  createAbortablePromise: vi.fn(),
}));

describe('renderPromiseFactory', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('aborted promise', async () => {
    const arg = Symbol('arg');
    const prop = Symbol('prop');
    const signal = Symbol('signal');
    const promise = Symbol('promise');
    const result = Symbol('result');
    const render = vi.fn();
    const placeholder = {
      remove: vi.fn(),
    };
    const props = {
      render,
      placeholder,
      signal,
      prop,
    };
    const args = [props, arg];
    createAbortablePromise.mockReturnValueOnce({ result, aborted: true });
    expect(await renderPromiseFactory(promise, ...args)).toBe(null);
    expect(render).not.toBeCalled();
    expect(placeholder.remove).toBeCalledTimes(1);
    expect(createAbortablePromise).toBeCalledTimes(1);
    expect(createAbortablePromise).toHaveBeenCalledWith({ signal, promise });
  });

  test('not aborted promise', async () => {
    const arg = Symbol('arg');
    const prop = Symbol('prop');
    const signal = Symbol('signal');
    const promise = Symbol('promise');
    const result = Symbol('result');
    const renderResult = Symbol('render result;');
    const render = vi.fn();
    const placeholder = {
      remove: vi.fn(),
    };
    const props = {
      render,
      placeholder,
      signal,
      prop,
    };
    const args = [props, arg];
    createAbortablePromise.mockReturnValueOnce({ result, aborted: false });
    render.mockReturnValueOnce(renderResult);
    expect(await renderPromiseFactory(promise, ...args)).toBe(renderResult);
    expect(render).toBeCalledTimes(1);
    expect(render).toBeCalledWith(result, ...args);
    expect(placeholder.remove).not.toBeCalled();
    expect(createAbortablePromise).toBeCalledTimes(1);
    expect(createAbortablePromise).toHaveBeenCalledWith({ signal, promise });
  });
});
