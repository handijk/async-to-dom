import { afterEach, describe, expect, test, vi } from 'vitest';
import { createIterablePlaceholderFactory } from './create-iterable-placeholder-factory.js';
import { renderIterableFactory } from './render-iterable-factory.js';

vi.mock('./create-iterable-placeholder-factory.js', () => ({
  createIterablePlaceholderFactory: vi.fn(),
}));

describe('renderIterableFactory', () => {
  const args = Symbol();

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('add placeholder elements and call render on every item', async () => {
    const createIterablePlaceholder = vi.fn();
    const render = vi.fn();
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
    const placeholder = Symbol('placeholder');
    const document = Symbol('document');
    createIterablePlaceholderFactory.mockReturnValueOnce(
      createIterablePlaceholder
    );
    createIterablePlaceholder.mockReturnValueOnce(placeholder1);
    createIterablePlaceholder.mockReturnValueOnce(placeholder2);
    createIterablePlaceholder.mockReturnValueOnce(placeholder3);
    render.mockReturnValueOnce(rendered1);
    render.mockReturnValueOnce(rendered2);
    render.mockReturnValueOnce(rendered3);
    const result = renderIterableFactory(item, {
      args,
      placeholder,
      render,
      document,
    });
    expect(createIterablePlaceholderFactory).toHaveBeenCalledTimes(1);
    expect(createIterablePlaceholderFactory).toHaveBeenCalledWith({
      iterable: item,
      placeholder,
      document,
    });
    expect(await result).toEqual([rendered1, rendered2, rendered3]);
  });
});
