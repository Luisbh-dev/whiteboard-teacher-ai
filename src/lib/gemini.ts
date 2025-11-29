import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

// Helper to get the API Key from env
const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  return key ? key.trim() : null;
};

export async function sendToGemini(
  history: ChatMessage[],
  newMessage: string,
  systemInstruction?: string
) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key missing. Please check VITE_GEMINI_API_KEY in .env file.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Usamos el modelo solicitado explícitamente por el usuario
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: systemInstruction 
  });

  const chat = model.startChat({
    history: history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    generationConfig: {
      maxOutputTokens: 8192,
    },
  });

  const result = await chat.sendMessage(newMessage);
  const response = result.response;
  return response.text();
}
