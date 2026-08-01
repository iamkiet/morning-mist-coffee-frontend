'use client';

import { useEffect, useRef, useState } from 'react';
import { searchProductsByVoice, type Product } from '@/lib/api/products';

export type VoiceSearchStatus = 'idle' | 'recording' | 'loading' | 'success' | 'error';

const PREFERRED_MIME_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];

export const MAX_RECORDING_SECONDS = 60;

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return PREFERRED_MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t));
}

export function useVoiceSearch() {
  const [status, setStatus] = useState<VoiceSearchStatus>('idle');
  const [items, setItems] = useState<Product[]>([]);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(MAX_RECORDING_SECONDS);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  async function handleStop() {
    setStatus('loading');
    const rawMimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
    const mimeType = rawMimeType.split(';')[0];
    const blob = new Blob(chunksRef.current, { type: mimeType });

    try {
      const result = await searchProductsByVoice(blob);
      setItems(result.items);
      setTranscript(result.transcript);
      setStatus('success');
    } catch {
      setErrorMessage('Đã có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
      setStatus('error');
    }
  }

  async function startRecording() {
    setErrorMessage(null);
    setTranscript(null);
    setItems([]);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('Trình duyệt không hỗ trợ ghi âm.');
      setStatus('error');
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
        void handleStop();
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setStatus('recording');

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
      setErrorMessage('Không thể truy cập micro. Vui lòng cấp quyền và thử lại.');
      setStatus('error');
    }
  }

  function reset() {
    clearCountdown();
    setStatus('idle');
    setItems([]);
    setTranscript(null);
    setErrorMessage(null);
    setSecondsRemaining(MAX_RECORDING_SECONDS);
  }

  return {
    status,
    items,
    transcript,
    errorMessage,
    secondsRemaining,
    startRecording,
    stopRecording,
    reset,
  };
}
