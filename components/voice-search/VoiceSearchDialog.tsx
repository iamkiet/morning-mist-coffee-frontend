'use client';

import { useState } from 'react';
import { AlertCircle, Loader2, Mic, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/app/_components/ProductCard';
import { useVoiceSearch } from '@/hooks/use-voice-search';

export function VoiceSearchDialog() {
  const [open, setOpen] = useState(false);
  const {
    status,
    items,
    transcript,
    errorMessage,
    secondsRemaining,
    startRecording,
    stopRecording,
    reset,
  } = useVoiceSearch();

  function handleOpenChange(next: boolean) {
    if (!next) {
      stopRecording();
      reset();
    }
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 sm:h-12 sm:w-12"
          aria-label="Tìm kiếm bằng giọng nói"
        >
          <Mic className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tìm kiếm bằng giọng nói</DialogTitle>
          <DialogDescription>
            Nói tên hoặc mô tả loại cà phê bạn muốn tìm.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-6">
          {status === 'idle' && (
            <button
              onClick={() => void startRecording()}
              aria-label="Bắt đầu ghi âm"
              className="size-16 rounded-full bg-primary text-on-primary flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <Mic className="size-6" />
            </button>
          )}

          {status === 'recording' && (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={stopRecording}
                aria-label="Dừng ghi âm"
                className="relative size-16 rounded-full bg-primary text-on-primary flex items-center justify-center cursor-pointer"
              >
                <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-50" />
                <Mic className="size-6 relative" />
              </button>
              <p className="text-sm text-muted-foreground">
                Đang nghe... nhấn để dừng ({secondsRemaining}s)
              </p>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground py-4">
              <Loader2 className="size-8 animate-spin" />
              <p className="text-sm">Đang tìm kiếm...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-3 text-center py-4">
              <AlertCircle className="size-8 text-destructive" />
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
              <Button variant="outline" size="sm" onClick={reset} className="gap-2">
                <RotateCcw className="size-3.5" />
                Thử lại
              </Button>
            </div>
          )}

          {status === 'success' && (
            <div className="w-full">
              {transcript && (
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Bạn vừa nói:{' '}
                  <span className="text-foreground italic">&quot;{transcript}&quot;</span>
                </p>
              )}
              {items.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Không tìm thấy sản phẩm phù hợp. Vui lòng thử lại với câu nói khác.
                </p>
              )}
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm" onClick={reset} className="gap-2">
                  <Mic className="size-3.5" />
                  Tìm lại
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
