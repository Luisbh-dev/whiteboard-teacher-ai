import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendToGemini, ChatMessage } from './gemini';

// Mock the GoogleGenerativeAI module
vi.mock('@google/generative-ai', () => {
  const sendMessageMock = vi.fn();
  const startChatMock = vi.fn(() => ({
    sendMessage: sendMessageMock,
  }));
  const getGenerativeModelMock = vi.fn(() => ({
    startChat: startChatMock,
  }));

  return {
    GoogleGenerativeAI: vi.fn(() => ({
      getGenerativeModel: getGenerativeModelMock,
    })),
    // Expose mocks for asserting
    _mocks: {
      sendMessageMock,
      startChatMock,
      getGenerativeModelMock,
    },
  };
});

describe('sendToGemini', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('should throw an error if VITE_GEMINI_API_KEY is not set', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');

    await expect(sendToGemini([], 'Hello')).rejects.toThrow(
      'API Key missing. Please check VITE_GEMINI_API_KEY in .env file.'
    );
  });

  it('should successfully send a message and return the response text', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');

    const { GoogleGenerativeAI, _mocks } = await import('@google/generative-ai') as any;

    _mocks.sendMessageMock.mockResolvedValueOnce({
      response: {
        text: () => 'Hello, I am a model!',
      },
    });

    const history: ChatMessage[] = [
      { role: 'user', text: 'Hi' },
      { role: 'model', text: 'Hello' },
    ];

    const responseText = await sendToGemini(history, 'How are you?');

    expect(responseText).toBe('Hello, I am a model!');

    // Verify GoogleGenerativeAI was initialized with the API key
    expect(GoogleGenerativeAI).toHaveBeenCalledWith('test-api-key');

    // Verify getGenerativeModel was called with correct parameters
    expect(_mocks.getGenerativeModelMock).toHaveBeenCalledWith({
      model: 'gemini-2.5-flash',
      systemInstruction: undefined,
    });

    // Verify startChat was called with mapped history and correct generationConfig
    expect(_mocks.startChatMock).toHaveBeenCalledWith({
      history: [
        { role: 'user', parts: [{ text: 'Hi' }] },
        { role: 'model', parts: [{ text: 'Hello' }] },
      ],
      generationConfig: {
        maxOutputTokens: 8192,
      },
    });

    // Verify sendMessage was called with the new message
    expect(_mocks.sendMessageMock).toHaveBeenCalledWith('How are you?');
  });

  it('should successfully send a message with system instruction', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key-2');

    const { _mocks } = await import('@google/generative-ai') as any;

    _mocks.sendMessageMock.mockResolvedValueOnce({
      response: {
        text: () => 'Yes, sir!',
      },
    });

    const systemInstruction = 'You are a helpful assistant';
    const responseText = await sendToGemini([], 'Do this', systemInstruction);

    expect(responseText).toBe('Yes, sir!');

    // Verify getGenerativeModel was called with the systemInstruction
    expect(_mocks.getGenerativeModelMock).toHaveBeenCalledWith({
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction,
    });
  });
});
