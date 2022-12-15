import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAsyncIterablePlaceholder } from './create-async-iterable-placeholder.js';

describe('create-async-iterable-placeholder', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('replace on the first iteration', () => {
    const after = {
      before: vi.fn(),
    };
    const thirdSibling = {
      nextSibling: after,
      remove: vi.fn(),
    };
    const secondSibling = {
      nextSibling: thirdSibling,
      remove: vi.fn(),
    };
    const firstSibling = {
      nextSibling: secondSibling,
      remove: vi.fn(),
    };
    const before = {
      nextSibling: firstSibling,
    };
    const placeholder = {
      replaceWith: vi.fn(),
    };
    const asyncIterablePlaceholder = createAsyncIterablePlaceholder({
      placeholder,
      after,
      before,
      i: 0,
    });
    const element1 = Symbol('element 1');
    const element2 = Symbol('element 2');
    const element3 = Symbol('element 3');
    const elements = [element1, element2, element3];
    asyncIterablePlaceholder.replaceWith(...elements);
    expect(firstSibling.remove).not.toBeCalled();
    expect(secondSibling.remove).not.toBeCalled();
    expect(thirdSibling.remove).not.toBeCalled();
    expect(placeholder.replaceWith).toBeCalledWith(before, after);
    expect(after.before).toBeCalledWith(...elements);
  });

  test('replace on the second iteration', () => {
    const after = {
      before: vi.fn(),
    };
    const thirdSibling = {
      nextSibling: after,
      remove: vi.fn(),
    };
    const secondSibling = {
      nextSibling: thirdSibling,
      remove: vi.fn(),
    };
    const firstSibling = {
      nextSibling: secondSibling,
      remove: vi.fn(),
    };
    const before = {
      nextSibling: firstSibling,
    };
    const placeholder = {
      replaceWith: vi.fn(),
    };
    const asyncIterablePlaceholder = createAsyncIterablePlaceholder({
      placeholder,
      after,
      before,
      i: 1,
    });
    const element1 = Symbol('element 1');
    const element2 = Symbol('element 2');
    const element3 = Symbol('element 3');
    const elements = [element1, element2, element3];
    asyncIterablePlaceholder.replaceWith(...elements);
    expect(firstSibling.remove).toBeCalled();
    expect(secondSibling.remove).toBeCalled();
    expect(thirdSibling.remove).toBeCalled();
    expect(placeholder.replaceWith).not.toBeCalled();
    expect(after.before).toBeCalledWith(...elements);
  });

  test('remove on the first iteration', () => {
    const after = {
      before: vi.fn(),
    };
    const thirdSibling = {
      nextSibling: after,
      remove: vi.fn(),
    };
    const secondSibling = {
      nextSibling: thirdSibling,
      remove: vi.fn(),
    };
    const firstSibling = {
      nextSibling: secondSibling,
      remove: vi.fn(),
    };
    const before = {
      nextSibling: firstSibling,
    };
    const placeholder = {
      replaceWith: vi.fn(),
    };
    const asyncIterablePlaceholder = createAsyncIterablePlaceholder({
      placeholder,
      after,
      before,
      i: 0,
    });
    asyncIterablePlaceholder.remove();
    expect(firstSibling.remove).not.toBeCalled();
    expect(secondSibling.remove).not.toBeCalled();
    expect(thirdSibling.remove).not.toBeCalled();
    expect(placeholder.replaceWith).toBeCalledWith(before, after);
  });

  test('remove on the second iteration', () => {
    const after = {
      before: vi.fn(),
    };
    const thirdSibling = {
      nextSibling: after,
      remove: vi.fn(),
    };
    const secondSibling = {
      nextSibling: thirdSibling,
      remove: vi.fn(),
    };
    const firstSibling = {
      nextSibling: secondSibling,
      remove: vi.fn(),
    };
    const before = {
      nextSibling: firstSibling,
    };
    const placeholder = {
      replaceWith: vi.fn(),
    };
    const asyncIterablePlaceholder = createAsyncIterablePlaceholder({
      placeholder,
      after,
      before,
      i: 1,
    });
    asyncIterablePlaceholder.remove();
    expect(firstSibling.remove).toBeCalled();
    expect(secondSibling.remove).toBeCalled();
    expect(thirdSibling.remove).toBeCalled();
    expect(placeholder.replaceWith).not.toBeCalled();
  });
});
