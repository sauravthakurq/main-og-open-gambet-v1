import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Orb } from '../../../orb';

type Message = {
  id: string;
  sender: 'user' | 'gambit';
  text: string;
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'gambit',
    text: "Hello! I'm Gambit, your personal AI chess coach. Ask me about your last game, request opening analysis, or let me review a specific position.",
    timestamp: new Date()
  }
];

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'gambit',
        text: "That's an interesting question. In a real environment, I would analyze this deeply using AlphaZero or Stockfish 16.1. For now, I'm observing your board state to give you context-aware advice.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="px-8 pb-6 border-b border-white/5 shrink-0 flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-bold text-white mb-1">Ask Gambit</h2>
            <p className="text-white/50 text-sm">Real-time coaching and analysis</p>
         </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col gap-6">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center overflow-hidden relative ${
              msg.sender === 'gambit' 
                ? 'bg-black/40 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                : 'bg-white/10'
            }`}>
              {msg.sender === 'gambit' ? (
                 <Orb 
                   theme="cloud" 
                   size={44} 
                   state="thinking" 
                   className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                 />
              ) : (
                <User size={20} className="text-white/70" />
              )}
            </div>

            {/* Bubble */}
            <div className={`p-5 rounded-2xl text-[15px] leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-white/10 text-white rounded-tr-sm border border-white/5'
                : 'bg-black/60 text-white/90 rounded-tl-sm border border-[var(--color-accent)]/20 shadow-xl backdrop-blur-md'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 max-w-[85%]"
          >
            <div className="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center overflow-hidden relative bg-black/40 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
               <Orb 
                 theme="cloud" 
                 size={44} 
                 state="thinking" 
                 className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
               />
            </div>
            <div className="p-5 rounded-2xl bg-black/60 text-white/90 rounded-tl-sm border border-[var(--color-accent)]/20 shadow-xl backdrop-blur-md flex items-center gap-1.5">
               <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
               <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
               <span className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-bounce"></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-black/40 border-t border-white/5 shrink-0 backdrop-blur-xl">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about chess..."
            className="w-full bg-[#1c1c1e]/80 border border-white/10 text-white placeholder:text-white/30 rounded-2xl pl-6 pr-14 py-4 outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all font-medium shadow-inner"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-3 p-2.5 rounded-xl bg-[var(--color-accent)] text-black hover:bg-[#b58863] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="text-center mt-3 flex items-center justify-center gap-1 text-white/30 text-xs">
          <AlertCircle size={12} /> Gambit AI can make mistakes. Verify critical lines with the engine.
        </div>
      </div>
    </div>
  );
};
