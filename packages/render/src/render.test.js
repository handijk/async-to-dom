import { afterEach, describe, expect, test, vi } from 'vitest';
import { render } from './render.js';

describe('render', () => {
  const matcher1 = vi.fn();
  const matcher2 = vi.fn();
  const matcher3 = vi.fn();
  const renderer1 = vi.fn();
  const renderer2 = vi.fn();
  const renderer3 = vi.fn();
  const renderers = [
    [matcher1, renderer1],
    [matcher2, renderer2],
    [matcher3, renderer3],
  ];
  const prop = Symbol();
  const props = { prop, renderers };
  const renderResult = Symbol();
  const args = [props, Symbol('arg2')];

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call only the first renderer when it succeeds', async () => {
    const item = Symbol();
    props.render = render;
    matcher1.mockReturnValueOnce(true);
    renderer1.mockReturnValueOnce(renderResult);
    const result = await render(item, ...args);
    expect(result).toBe(renderResult);
    expect(renderer1).toBeCalledTimes(1);
    expect(renderer2).not.toBeCalled();
    expect(renderer3).not.toBeCalled();
    expect(renderer1).toBeCalledTimes(1);
    expect(renderer1).toHaveBeenCalledWith(item, ...args);
    expect(renderer2).not.toBeCalled();
    expect(renderer3).not.toBeCalled();
    expect(matcher1).toBeCalledTimes(1);
    expect(matcher1).toHaveBeenCalledWith(item);
    expect(matcher2).not.toBeCalled();
    expect(matcher3).not.toBeCalled();
  });

  test('should call all renderers do not retry and fail with an error', async () => {
    const item = Symbol();
    props.render = render;
    matcher1.mockReturnValueOnce(false);
    matcher2.mockReturnValueOnce(false);
    matcher3.mockReturnValueOnce(false);
    expect(render(item, ...args)).rejects.toEqual(
      new TypeError('Cannot convert item to node')
    );
    await new Promise((resolve) => {
      setTimeout(resolve);
    });
    expect(renderer1).not.toBeCalled();
    expect(renderer2).not.toBeCalled();
    expect(renderer3).not.toBeCalled();
    expect(renderer1).not.toBeCalled();
    expect(renderer2).not.toBeCalled();
    expect(renderer3).not.toBeCalled();
    expect(matcher1).toHaveBeenCalledTimes(1);
    expect(matcher1).toHaveBeenNthCalledWith(1, item);
    expect(matcher2).toBeCalledTimes(1);
    expect(matcher2).toHaveBeenNthCalledWith(1, item);
    expect(matcher3).toBeCalledTimes(1);
    expect(matcher3).toHaveBeenNthCalledWith(1, item);
  });
});
