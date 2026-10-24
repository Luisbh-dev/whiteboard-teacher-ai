import { test, expect, vi, afterEach, describe } from 'vitest';
import { getApiKey } from './gemini';

describe('getApiKey', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('returns null when VITE_GEMINI_API_KEY is not set', () => {
    delete import.meta.env.VITE_GEMINI_API_KEY;
    expect(getApiKey()).toBeNull();
  });

  test('returns the key correctly trimmed when VITE_GEMINI_API_KEY is set with spaces', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '  test-key-with-spaces  ');
    expect(getApiKey()).toBe('test-key-with-spaces');
  });

  test('returns the exact key when it is set without spaces', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'exact-key-no-spaces');
    expect(getApiKey()).toBe('exact-key-no-spaces');
  });
});
