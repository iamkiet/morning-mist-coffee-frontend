import { authFetch } from './client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const res = await authFetch('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? 'Chat request failed');
  }
  const data = await res.json();
  return data.message;
}
