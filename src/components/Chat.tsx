import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Eraser } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import clsx from 'clsx';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface ChatProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onClearBoard: () => void;
}

const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, isLoading, onClearBoard }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-lg w-96">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-indigo-600 text-white">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <h2 className="font-bold text-lg">Poly Math & Physics Teacher</h2>
        </div>
        <button 
          onClick={onClearBoard}
          className="p-2 hover:bg-indigo-700 rounded-full transition-colors"
          title="Limpiar Pizarra"
        >
          <Eraser className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <p className="mb-2">¡Hola! Soy tu asistente matemático.</p>
            <p className="text-sm">Puedo ayudarte a resolver problemas y dibujar gráficas en la pizarra.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex gap-3 max-w-[90%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              msg.role === 'user' ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white"
            )}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={clsx(
              "p-3 rounded-lg text-sm shadow-sm prose prose-sm max-w-none overflow-x-auto",
              msg.role === 'user' 
                ? "bg-indigo-100 text-indigo-900 rounded-tr-none" 
                : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
            )}>
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm ml-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Pensando...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un problema matemático..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
