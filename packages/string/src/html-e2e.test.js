import { describe, expect, test } from 'vitest';
import { html as htmlFactory } from './html.js';

describe('html', () => {
  test('html can be aborted', async () => {
    const controller = new AbortController();
    const x = Symbol();
    const args = [{ signal: controller.signal }, x];
    const html = htmlFactory();
    const elementPromise = html`<div>
      <span
        >${new Promise((resolve) =>
          setTimeout(() => resolve('to late'), 10000)
        )}</span
      >
      <span
        >${new Promise((resolve) =>
          setTimeout(() => resolve('on time'), 500)
        )}</span
      >
    </div>`.render(...args);
    setTimeout(() => {
      controller.abort();
    }, 1000);
    const string = await elementPromise;
    expect(string.toString()).toMatchSnapshot();
  });
});
