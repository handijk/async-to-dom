import { afterEach, describe, expect, test, vi } from 'vitest';
import { createIterablePlaceholderFactory } from './create-iterable-placeholder-factory.js';

describe('create-iterable-placeholder-factory', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('start with replacing an element', () => {
    const item1 = Symbol('item1');
    const item2 = Symbol('item2');
    const item3 = Symbol('item3');
    const iterable = [item1, item2, item3];
    const replaceWith = vi.fn();
    const remove = vi.fn();
    const placeholder = {
      replaceWith,
      remove,
    };
    const createComment = vi.fn();
    const document = {
      createComment,
    };
    const replaceWith1 = vi.fn();
    const remove1 = vi.fn();
    const replaceWith2 = vi.fn();
    const remove2 = vi.fn();
    const replaceWith3 = vi.fn();
    const remove3 = vi.fn();
    const comment1 = {
      replaceWith: replaceWith1,
      remove: remove1,
    };
    const comment2 = {
      replaceWith: replaceWith2,
      remove: remove2,
    };
    const comment3 = {
      replaceWith: replaceWith3,
      remove: remove3,
    };
    createComment.mockReturnValueOnce(comment1);
    createComment.mockReturnValueOnce(comment2);
    createComment.mockReturnValueOnce(comment3);
    const createIterablePlaceholder = createIterablePlaceholderFactory({
      iterable,
      placeholder,
      document,
    });
    expect(createComment).toBeCalledTimes(3);
    const iterablePlaceholder1 = createIterablePlaceholder(0);
    const iterablePlaceholder2 = createIterablePlaceholder(1);
    const iterablePlaceholder3 = createIterablePlaceholder(2);
    const replaceElement1 = Symbol('replace element 1');
    const replaceElement2 = Symbol('replace element 2');
    const replaceElement3 = Symbol('replace element 3');
    const replaceElements = [replaceElement1, replaceElement2, replaceElement3];
    iterablePlaceholder2.replaceWith(...replaceElements);
    expect(replaceWith).toBeCalledTimes(1);
    expect(replaceWith).toHaveBeenCalledWith(
      comment1,
      replaceElement1,
      replaceElement2,
      replaceElement3,
      comment3
    );
    expect(replaceWith1).not.toHaveBeenCalled();
    expect(replaceWith2).not.toHaveBeenCalled();
    expect(replaceWith3).not.toHaveBeenCalled();
    expect(remove1).not.toHaveBeenCalled();
    expect(remove2).not.toHaveBeenCalled();
    expect(remove3).not.toHaveBeenCalled();
    iterablePlaceholder3.replaceWith(...replaceElements);
    expect(replaceWith).toBeCalledTimes(1);
    expect(replaceWith1).not.toHaveBeenCalled();
    expect(replaceWith2).not.toHaveBeenCalled();
    expect(replaceWith3).toHaveBeenCalledTimes(1);
    expect(replaceWith3).toHaveBeenCalledWith(...replaceElements);
    expect(remove1).not.toHaveBeenCalled();
    expect(remove2).not.toHaveBeenCalled();
    expect(remove3).not.toHaveBeenCalled();
    iterablePlaceholder1.remove();
    expect(replaceWith1).not.toHaveBeenCalled();
    expect(replaceWith2).not.toHaveBeenCalled();
    expect(replaceWith3).toHaveBeenCalledTimes(1);
    expect(remove1).toHaveBeenCalledTimes(1);
    expect(remove2).not.toHaveBeenCalled();
    expect(remove3).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  test('start with removing an element', () => {
    const item1 = Symbol('item1');
    const item2 = Symbol('item2');
    const item3 = Symbol('item3');
    const iterable = [item1, item2, item3];
    const replaceWith = vi.fn();
    const remove = vi.fn();
    const placeholder = {
      replaceWith,
      remove,
    };
    const createComment = vi.fn();
    const document = {
      createComment,
    };
    const replaceWith1 = vi.fn();
    const remove1 = vi.fn();
    const replaceWith2 = vi.fn();
    const remove2 = vi.fn();
    const replaceWith3 = vi.fn();
    const remove3 = vi.fn();
    const comment1 = {
      replaceWith: replaceWith1,
      remove: remove1,
    };
    const comment2 = {
      replaceWith: replaceWith2,
      remove: remove2,
    };
    const comment3 = {
      replaceWith: replaceWith3,
      remove: remove3,
    };
    createComment.mockReturnValueOnce(comment1);
    createComment.mockReturnValueOnce(comment2);
    createComment.mockReturnValueOnce(comment3);
    const createIterablePlaceholder = createIterablePlaceholderFactory({
      iterable,
      placeholder,
      document,
    });
    expect(createComment).toBeCalledTimes(3);
    const iterablePlaceholder1 = createIterablePlaceholder(0);
    const iterablePlaceholder2 = createIterablePlaceholder(1);
    const iterablePlaceholder3 = createIterablePlaceholder(2);
    const replaceElement1 = Symbol('replace element 1');
    const replaceElement2 = Symbol('replace element 2');
    const replaceElement3 = Symbol('replace element 3');
    const replaceElements = [replaceElement1, replaceElement2, replaceElement3];
    iterablePlaceholder2.remove();
    expect(replaceWith).not.toHaveBeenCalled();
    expect(replaceWith1).not.toHaveBeenCalled();
    expect(replaceWith2).not.toHaveBeenCalled();
    expect(replaceWith3).not.toHaveBeenCalled();
    expect(remove1).not.toHaveBeenCalled();
    expect(remove2).not.toHaveBeenCalled(1);
    expect(remove3).not.toHaveBeenCalled();
    iterablePlaceholder3.replaceWith(...replaceElements);
    expect(replaceWith).toBeCalledTimes(1);
    expect(replaceWith).toHaveBeenCalledWith(
      comment1,
      replaceElement1,
      replaceElement2,
      replaceElement3
    );
    expect(replaceWith1).not.toHaveBeenCalled();
    expect(replaceWith2).not.toHaveBeenCalled();
    expect(replaceWith3).not.toHaveBeenCalled();
    expect(remove1).not.toHaveBeenCalled();
    expect(remove2).not.toHaveBeenCalled();
    expect(remove3).not.toHaveBeenCalled();
    iterablePlaceholder1.remove();
    expect(replaceWith1).not.toHaveBeenCalled();
    expect(replaceWith2).not.toHaveBeenCalled();
    expect(replaceWith3).not.toHaveBeenCalled();
    expect(remove1).toHaveBeenCalledTimes(1);
    expect(remove2).not.toHaveBeenCalled();
    expect(remove3).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  test('all elements get removed', () => {
    const item1 = Symbol('item1');
    const item2 = Symbol('item2');
    const item3 = Symbol('item3');
    const iterable = [item1, item2, item3];
    const replaceWith = vi.fn();
    const remove = vi.fn();
    const placeholder = {
      replaceWith,
      remove,
    };
    const createComment = vi.fn();
    const document = {
      createComment,
    };
    const replaceWith1 = vi.fn();
    const remove1 = vi.fn();
    const replaceWith2 = vi.fn();
    const remove2 = vi.fn();
    const replaceWith3 = vi.fn();
    const remove3 = vi.fn();
    const comment1 = {
      replaceWith: replaceWith1,
      remove: remove1,
    };
    const comment2 = {
      replaceWith: replaceWith2,
      remove: remove2,
    };
    const comment3 = {
      replaceWith: replaceWith3,
      remove: remove3,
    };
    createComment.mockReturnValueOnce(comment1);
    createComment.mockReturnValueOnce(comment2);
    createComment.mockReturnValueOnce(comment3);
    const createIterablePlaceholder = createIterablePlaceholderFactory({
      iterable,
      placeholder,
      document,
    });
    expect(createComment).toBeCalledTimes(3);
    const iterablePlaceholder1 = createIterablePlaceholder(0);
    const iterablePlaceholder2 = createIterablePlaceholder(1);
    const iterablePlaceholder3 = createIterablePlaceholder(2);
    iterablePlaceholder2.remove();
    expect(replaceWith1).not.toHaveBeenCalled();
    expect(replaceWith2).not.toHaveBeenCalled();
    expect(replaceWith3).not.toHaveBeenCalled();
    expect(remove1).not.toHaveBeenCalled();
    expect(remove2).not.toHaveBeenCalled();
    expect(remove3).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
    iterablePlaceholder3.remove();
    expect(replaceWith1).not.toHaveBeenCalled();
    expect(replaceWith2).not.toHaveBeenCalled();
    expect(replaceWith3).not.toHaveBeenCalled();
    expect(remove1).not.toHaveBeenCalled();
    expect(remove2).not.toHaveBeenCalled();
    expect(remove3).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
    iterablePlaceholder1.remove();
    expect(replaceWith1).not.toHaveBeenCalled();
    expect(replaceWith2).not.toHaveBeenCalled();
    expect(replaceWith3).not.toHaveBeenCalled();
    expect(remove1).not.toHaveBeenCalled();
    expect(remove2).not.toHaveBeenCalled();
    expect(remove3).not.toHaveBeenCalled();
    expect(remove).toHaveBeenCalledTimes(1);
  });
});
