'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { searchProductsByVoice } from '@/lib/api/products';

export type VoiceSearchStatus = 'idle' | 'recording' | 'loading' | 'success' | 'error';

const PREFERRED_MIME_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];

const MAX_RECORDING_SECONDS = 60;

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return PREFERRED_MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t));
}

export function useVoiceSearch() {
  // Recorder lifecycle stays local — TanStack Query owns only the network call
  const [isRecording, setIsRecording] = useState(false);
  const [recorderError, setRecorderError] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(MAX_RECORDING_SECONDS);

  const search = useMutation({ mutationFn: searchProductsByVoice });

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

  function handleStop() {
    setIsRecording(false);
    const rawMimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
    const mimeType = rawMimeType.split(';')[0];
    search.mutate(new Blob(chunksRef.current, { type: mimeType }));
  }

  async function startRecording() {
    setRecorderError(null);
    search.reset();

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

  function reset() {
    clearCountdown();
    setIsRecording(false);
    setRecorderError(null);
    setSecondsRemaining(MAX_RECORDING_SECONDS);
    search.reset();
  }

  function deriveStatus(): VoiceSearchStatus {
    if (recorderError) return 'error';
    if (isRecording) return 'recording';
    if (search.isPending) return 'loading';
    if (search.isError) return 'error';
    if (search.isSuccess) return 'success';
    return 'idle';
  }

  return {
    status: deriveStatus(),
    items: search.data?.items ?? [],
    transcript: search.data?.transcript ?? null,
    errorMessage:
      recorderError ??
      (search.isError ? 'Đã có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.' : null),
    secondsRemaining,
    startRecording,
    stopRecording,
    reset,
  };
}
