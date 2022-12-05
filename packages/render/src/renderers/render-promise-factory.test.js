import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderPromiseFactory } from './render-promise-factory.js';
import { createAbortablePromise } from '@async-to-html/abort-async/create-abortable-promise.js';

vi.mock('@async-to-html/abort-async/create-abortable-promise.js', () => ({
  createAbortablePromise: vi.fn(),
}));

describe('renderPromiseFactory', () => {
  const render = vi.fn();
  const arg = Symbol('arg');
  const signal = Symbol('signal');
  const prop = Symbol('prop');
  const props = { render, signal, prop };
  const args = [props, arg];

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('call render when the promise is not aborted', async () => {
    const result = Symbol('result');
    const promise = Symbol('promise');
    const rendered = Symbol('rendered');
    createAbortablePromise.mockReturnValueOnce({ result, aborted: false });
    render.mockReturnValueOnce(rendered);
    await expect(renderPromiseFactory(promise, ...args)).resolves.toBe(
      rendered
    );
    expect(createAbortablePromise).toBeCalledWith({ signal, promise });
    expect(render).toBeCalledWith(result, ...args);
  });

  test('do not call render when the promise is aborted', async () => {
    const result = Symbol('result');
    const promise = Symbol('promise');
    const rendered = Symbol('rendered');
    createAbortablePromise.mockReturnValueOnce({ result, aborted: true });
    render.mockReturnValueOnce(rendered);
    await expect(renderPromiseFactory(promise, ...args)).resolves.toBe(
      undefined
    );
    expect(createAbortablePromise).toBeCalledWith({ signal, promise });
    expect(render).not.toBeCalled();
  });
});
