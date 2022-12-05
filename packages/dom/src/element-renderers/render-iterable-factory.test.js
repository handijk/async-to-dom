import { afterEach, describe, expect, test, vi } from 'vitest';
import { ITERABLE_ITEM_PLACEHOLDER } from '../constants.js';
import { renderIterableFactory } from './render-iterable-factory.js';

describe('renderIterableFactory', () => {
  const args = Symbol();

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('add placeholder elements and call render on every item', async () => {
    const createComment = vi.fn();
    const createDocumentFragment = vi.fn();
    const render = vi.fn();
    const document = {
      createComment,
      createDocumentFragment,
    };
    const child1 = Symbol('child 1');
    const child2 = Symbol('child 2');
    const child3 = Symbol('child 3');
    const item = [child1, child2, child3];
    const placeholder1 = Symbol('placeholder 1');
    const placeholder2 = Symbol('placeholder 2');
    const placeholder3 = Symbol('placeholder 3');
    const rendered1 = Symbol('rendered 1');
    const rendered2 = Symbol('rendered 2');
    const rendered3 = Symbol('rendered 3');
    const fragment = {
      append: vi.fn(),
    };
    const placeholder = {
      replaceWith: vi.fn(),
    };
    createDocumentFragment.mockReturnValueOnce(fragment);
    createComment.mockReturnValueOnce(placeholder1);
    createComment.mockReturnValueOnce(placeholder2);
    createComment.mockReturnValueOnce(placeholder3);
    render.mockReturnValueOnce(rendered1);
    render.mockReturnValueOnce(rendered2);
    render.mockReturnValueOnce(rendered3);
    const result = renderIterableFactory(item, {
      args,
      placeholder,
      document,
      render,
    });
    expect(createDocumentFragment).toBeCalledTimes(1);
    expect(createComment).toBeCalledTimes(3);
    expect(createComment).toHaveBeenCalledWith(ITERABLE_ITEM_PLACEHOLDER);
    expect(createComment).toHaveBeenCalledWith(ITERABLE_ITEM_PLACEHOLDER);
    expect(createComment).toHaveBeenCalledWith(ITERABLE_ITEM_PLACEHOLDER);
    expect(fragment.append).toBeCalledTimes(3);
    expect(fragment.append).toHaveBeenCalledWith(placeholder1);
    expect(fragment.append).toHaveBeenCalledWith(placeholder2);
    expect(fragment.append).toHaveBeenCalledWith(placeholder3);
    expect(render).toBeCalledTimes(3);
    expect(render).toHaveBeenCalledWith(child1, {
      args,
      placeholder: placeholder1,
      document,
      render,
    });
    expect(render).toHaveBeenCalledWith(child2, {
      args,
      placeholder: placeholder2,
      document,
      render,
    });
    expect(render).toHaveBeenCalledWith(child3, {
      args,
      placeholder: placeholder3,
      document,
      render,
    });
    expect(placeholder.replaceWith).toBeCalledTimes(1);
    expect(placeholder.replaceWith).toHaveBeenCalledWith(fragment);
    expect(await result).toEqual([rendered1, rendered2, rendered3]);
  });
});
