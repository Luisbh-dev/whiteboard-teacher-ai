export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export async function sendToGemini(
  history: ChatMessage[],
  newMessage: string,
  systemInstruction?: string
) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      history,
      newMessage,
      systemInstruction,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to communicate with backend server.");
  }

  return data.text;
}
