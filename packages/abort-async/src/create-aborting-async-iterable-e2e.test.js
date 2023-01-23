import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAbortingAsyncIterable } from './create-aborting-async-iterable.js';

// TODO: finish this

describe('createAbortingAsyncIterableE2E', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('runs until the end', async () => {
    let returnValue;
    const nextResult = Symbol();
    const innerResults = [];
    let innerReturn = false;
    const outerResults = [];
    let outerReturn = false;
    const mapFn = vi.fn(async (result, signal) => {
      const innerMapFn = vi.fn((mapResult) => mapResult);

      const asyncIterable2 = createAbortingAsyncIterable({
        asyncIterable: {
          [Symbol.asyncIterator]() {
            return {
              next: async () => {
                await new Promise((resolve) => {
                  setTimeout(resolve, 10000);
                });
                return {
                  value: nextResult,
                  done: false,
                };
              },
              return: () => {
                innerReturn = true;
                return { done: true };
              },
            };
          },
        },
        signal,
        mapFn: innerMapFn,
      });

      for await (const innerResult of asyncIterable2) {
        innerResults.push(innerResult);
      }

      return result;
    });
    const controller = new AbortController();

    const asyncIterable = createAbortingAsyncIterable({
      asyncIterable: {
        [Symbol.asyncIterator]() {
          let i = 0;
          return {
            next: async () => {
              await new Promise((resolve) => {
                setTimeout(resolve, 50);
              });
              i++;
              return {
                value: nextResult,
                done: i > 5,
              };
            },
            return: () => {
              outerReturn = true;
              return { done: true };
            },
          };
        },
      },
      signal: controller.signal,
      mapFn,
    });

    setTimeout(() => {
      controller.abort();
    }, 180);

    for await (const result of asyncIterable) {
      returnValue = result;
      outerResults.push(result);
    }

    expect(innerReturn).toBe(true);
    expect(outerReturn).toBe(true);
    expect(innerResults.length).toBe(0);
    expect(outerResults.length).toBe(1);

    return returnValue;
  });
});
