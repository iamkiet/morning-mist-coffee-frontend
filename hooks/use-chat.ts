'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { Product } from '@/lib/types';
import { sendChatMessage, sendChatVoiceMessage, type ChatMessage } from '@/lib/api/chat';

export interface Message extends ChatMessage {
  id: string;
  items?: Product[];
}

const PREFERRED_MIME_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
const MAX_RECORDING_SECONDS = 60;

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return PREFERRED_MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t));
}

function toApiHistory(messages: Message[]): ChatMessage[] {
  return messages.map(({ role, content }) => ({ role, content }));
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?' },
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recorderError, setRecorderError] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(MAX_RECORDING_SECONDS);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const historyRef = useRef<Message[]>(messages);
  useEffect(() => {
    historyRef.current = messages;
  }, [messages]);

  function appendAssistant(reply: { message: string; items: Product[] }) {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'assistant', content: reply.message, items: reply.items },
    ]);
  }

  function appendAssistantError() {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'assistant', content: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.' },
    ]);
  }

  const textMutation = useMutation({
    mutationFn: (history: Message[]) => sendChatMessage(toApiHistory(history)),
    onSuccess: appendAssistant,
    onError: appendAssistantError,
  });

  const voiceMutation = useMutation({
    mutationFn: (audio: Blob) => sendChatVoiceMessage(audio, toApiHistory(historyRef.current)),
    onSuccess: (reply) => {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'user', content: reply.transcript },
      ]);
      appendAssistant(reply);
    },
    onError: appendAssistantError,
  });

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || textMutation.isPending) return;

    const history: Message[] = [
      ...messages,
      { id: crypto.randomUUID(), role: 'user', content: input },
    ];
    setMessages(history);
    setInput('');
    textMutation.mutate(history);
  }

  function clearCountdown() {
    if (countdownRef.current !== null) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function stopRecording() {
    clearCountdown();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      stopStream();
    }
  }

  useEffect(() => {
    return () => {
      clearCountdown();
      stopStream();
    };
  }, []);

  function handleStop() {
    setIsRecording(false);
    const rawMimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
    const mimeType = rawMimeType.split(';')[0];
    voiceMutation.mutate(new Blob(chunksRef.current, { type: mimeType }));
  }

  async function startRecording() {
    setRecorderError(null);
    voiceMutation.reset();

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setRecorderError('Trình duyệt không hỗ trợ ghi âm.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        clearCountdown();
        stopStream();
        handleStop();
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

      setSecondsRemaining(MAX_RECORDING_SECONDS);
      countdownRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setRecorderError('Không thể truy cập micro. Vui lòng cấp quyền và thử lại.');
    }
  }

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading: textMutation.isPending || voiceMutation.isPending,
    isRecording,
    recorderError,
    secondsRemaining,
    startRecording,
    stopRecording,
  };
}
