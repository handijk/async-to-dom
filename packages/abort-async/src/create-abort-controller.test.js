import { afterEach, describe, expect, test, vi } from 'vitest';
import { createAbortController } from './create-abort-controller.js';

describe('createAbortController', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('output signal gets aborted when the input signal gets aborted', async () => {
    const reason = Symbol('reason');
    const signal = {
      aborted: false,
      addEventListener: vi.fn(),
    };
    const abortController = createAbortController({
      signal,
    });
    expect(abortController.signal.aborted).toEqual(false);
    await new Promise((resolve) => {
      setTimeout(() => {
        signal.reason = reason;
        signal.addEventListener.mock.calls[0][1]();
        resolve();
      }, 50);
    });
    expect(abortController.signal.aborted).toEqual(true);
    expect(abortController.signal.reason).toEqual(reason);
  });

  test('output signal is aborted when the input signal was already aborted', () => {
    const reason = Symbol('reason');
    const signal = {
      aborted: true,
      reason,
      addEventListener: vi.fn(),
    };
    const abortController = createAbortController({
      signal,
    });
    expect(abortController.signal.aborted).toEqual(true);
    expect(abortController.signal.reason).toEqual(reason);
  });
});
