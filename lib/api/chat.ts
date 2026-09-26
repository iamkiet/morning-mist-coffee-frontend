import type { Product } from '@/lib/types';
import { authFetch } from './client';
import { transform } from './products';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatReply {
  message: string;
  items: Product[];
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatReply> {
  const res = await authFetch('/api/v1/chat/text', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? 'Chat request failed');
  }
  const data = await res.json();
  return { message: data.message, items: (data.items ?? []).map(transform) };
}

export interface ChatVoiceReply extends ChatReply {
  transcript: string;
}

export async function sendChatVoiceMessage(
  audio: Blob,
  history: ChatMessage[],
): Promise<ChatVoiceReply> {
  const formData = new FormData();
  formData.append('messages', JSON.stringify(history));
  formData.append('audio', audio, 'query');

  const res = await authFetch('/api/v1/chat/voice', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? 'Voice chat request failed');
  }
  const data = await res.json();
  return { message: data.message, items: data.items.map(transform), transcript: data.transcript };
}
