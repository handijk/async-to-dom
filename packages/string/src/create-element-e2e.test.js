import { describe, expect, test } from 'vitest';
import { createElement as createElementFactory } from './create-element.js';

describe('createElement', () => {
  test('createElement can be aborted', async () => {
    const controller = new AbortController();
    const x = Symbol();
    const args = [{ signal: controller.signal }, x];
    const createElement = createElementFactory();
    const elementPromise = createElement('div', {}, [
      createElement(
        'span',
        {},
        new Promise((resolve) => setTimeout(() => resolve('to late'), 10000))
      ),
      createElement(
        'span',
        {},
        new Promise((resolve) => setTimeout(() => resolve('on time'), 500))
      ),
    ]).render(...args);
    setTimeout(() => {
      controller.abort();
    }, 1000);
    const string = await elementPromise;
    expect(string.toString()).toMatchSnapshot();
  });
});
