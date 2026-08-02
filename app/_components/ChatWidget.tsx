'use client';

import { useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '@/hooks/use-chat';

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, setInput, sendMessage, isLoading } = useChat();

  const isAdminPage = pathname?.startsWith('/mist-ops') || pathname?.startsWith('/login');

  if (isAdminPage) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-96 rounded-xl overflow-hidden shadow-2xl border border-border bg-card"
            style={{ 
              boxShadow: '0 20px 40px rgba(85, 98, 84, 0.08)'
            }}
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex justify-between items-center text-primary-foreground">
              <div>
                <h3 className="font-medium text-sm">Trợ lý Morning Mist</h3>
                <p className="text-xs opacity-80">Trực tuyến</p>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setIsOpen(false)}
                aria-label="Đóng hộp thoại"
                className="rounded-full hover:bg-primary-foreground/10"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Chat Area */}
            <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3 bg-background">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-muted text-foreground rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }: { children?: ReactNode }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                          ul: ({ children }: { children?: ReactNode }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }: { children?: ReactNode }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                          li: ({ children }: { children?: ReactNode }) => <li className="text-xs leading-normal">{children}</li>,
                          strong: ({ children }: { children?: ReactNode }) => <strong className="font-semibold text-primary">{children}</strong>,
                          em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground max-w-[85%] rounded-xl rounded-tl-sm px-4 py-2 text-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-3 bg-card border-t border-border flex gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi về sản phẩm..."
                className="flex-1 bg-muted rounded-full border-none"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                aria-label="Gửi tin nhắn"
                disabled={!input.trim() || isLoading}
                className="shrink-0 rounded-full"
              >
                <Send className="size-3.5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center cursor-pointer shrink-0"
        style={{ 
          boxShadow: '0 10px 25px rgba(85, 98, 84, 0.2)'
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
