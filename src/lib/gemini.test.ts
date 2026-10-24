import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendToGemini } from './gemini';

describe('sendToGemini', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('throws an error when API key is missing', async () => {
    await expect(sendToGemini([], 'Hello')).rejects.toThrowError(
      "API Key missing. Please check VITE_GEMINI_API_KEY in .env file."
    );
  });
});
