'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendChatMessage, type ChatMessage } from '@/lib/api/chat';

export interface Message extends ChatMessage {
  id: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?' },
  ]);
  const [input, setInput] = useState('');

  function appendAssistant(content: string) {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content }]);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (history: Message[]) =>
      sendChatMessage(history.map(({ role, content }) => ({ role, content }))),
    onSuccess: appendAssistant,
    onError: () => appendAssistant('Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.'),
  });

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const history: Message[] = [
      ...messages,
      { id: crypto.randomUUID(), role: 'user', content: input },
    ];
    setMessages(history);
    setInput('');
    mutate(history);
  }

  return { messages, input, setInput, sendMessage, isLoading: isPending };
}
