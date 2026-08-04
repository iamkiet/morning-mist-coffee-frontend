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
import { ProductCard } from './ProductCard';
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
      <DialogContent className="flex max-h-[85dvh] flex-col gap-4 overflow-hidden sm:max-w-2xl">
        <DialogHeader className="shrink-0 pr-8">
          <DialogTitle>Tìm kiếm bằng giọng nói</DialogTitle>
          <DialogDescription>
            Nói tên hoặc mô tả loại cà phê bạn muốn tìm.
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-1 flex min-h-0 flex-1 flex-col items-center gap-4 overflow-y-auto px-1 py-2">
          {(status === 'idle' || status === 'recording') && (
            <div className="flex flex-col items-center gap-3 py-4">
              <button
                onClick={status === 'recording' ? stopRecording : () => void startRecording()}
                aria-label={status === 'recording' ? 'Dừng ghi âm' : 'Bắt đầu ghi âm'}
                className="relative size-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                {status === 'recording' && (
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-50" />
                )}
                <Mic className="size-6 relative" />
              </button>
              {status === 'recording' && (
                <p className="text-sm text-muted-foreground">
                  Đang nghe... nhấn để dừng ({secondsRemaining}s)
                </p>
              )}
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
                <p className="text-sm text-muted-foreground text-center mb-2">
                  Bạn vừa nói:{' '}
                  <span className="text-foreground italic">&quot;{transcript}&quot;</span>
                </p>
              )}
              {items.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Không tìm thấy sản phẩm phù hợp. Vui lòng thử lại với câu nói khác.
                </p>
              )}
            </div>
          )}
        </div>

        {status === 'success' && (
          <div className="flex shrink-0 justify-center border-t border-border pt-3">
            <Button variant="outline" size="sm" onClick={reset} className="gap-2">
              <Mic className="size-3.5" />
              Tìm lại
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
