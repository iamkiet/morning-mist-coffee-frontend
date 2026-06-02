'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../../hooks/use-chat';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, setInput, sendMessage, isLoading } = useChat();

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-96 rounded-2xl overflow-hidden shadow-2xl border border-border bg-card"
            style={{ 
              boxShadow: '0 20px 40px rgba(85, 98, 84, 0.08)'
            }}
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex justify-between items-center text-on-primary">
              <div>
                <h3 className="font-medium text-sm">Trợ lý Morning Mist</h3>
                <p className="text-xs opacity-80">Trực tuyến</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3 bg-surface">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-on-primary rounded-tr-sm' 
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
                  <div className="bg-muted text-foreground max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2 text-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-3 bg-card border-t border-border flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi về sản phẩm..."
                className="flex-1 bg-muted text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary border-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="size-8 shrink-0 flex items-center justify-center rounded-full bg-primary text-on-primary transition-all duration-300 hover:scale-105 active:scale-95 disabled:bg-muted disabled:text-muted-foreground/30 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow"
              >
                <Send size={14} className="translate-x-[-1px] translate-y-[0.5px]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center cursor-pointer shrink-0"
        style={{ 
          boxShadow: '0 10px 25px rgba(85, 98, 84, 0.2)'
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
