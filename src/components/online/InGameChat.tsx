'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, X, Smile } from 'lucide-react';
import {
  collection, addDoc, query, orderBy, limit,
  onSnapshot, serverTimestamp, Timestamp
} from 'firebase/firestore';
import { ref, set, onValue, remove } from 'firebase/database';
import { db, rtdb, isFirebaseConfigured } from '@/lib/firebase';
import { useOnlineStore } from '@/store/useOnlineStore';
import { ChatMessage } from '@/lib/firebase-types';

const QUICK_MESSAGES = [
  'Good luck! 🤝', 'Nice move! 👏', 'Good game! 🎉',
  'Thanks! 🙏', 'Well played! ⭐', 'Interesting…🤔',
];

interface InGameChatProps {
  gameId: string;
}

export default function InGameChat({ gameId }: InGameChatProps) {
  const { firebaseUser, userProfile } = useOnlineStore();
  const [messages, setMessages] = useState<(ChatMessage & { id: string })[]>([]);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [opponentTyping, setOpponentTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [showQuick, setShowQuick] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to messages
  useEffect(() => {
    if (!isFirebaseConfigured || !db || !gameId) return;
    const q = query(
      collection(db, 'games', gameId, 'chat'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage & { id: string }));
      setMessages(msgs);
      if (!open && msgs.length > 0) setUnread((u) => u + 1);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return unsub;
  }, [gameId, open]);

  // Subscribe to typing indicator from opponent
  useEffect(() => {
    if (!isFirebaseConfigured || !rtdb || !gameId || !firebaseUser) return;
    const typingRef = ref(rtdb, `typing/${gameId}`);
    const unsub = onValue(typingRef, (snap) => {
      const data = snap.val() || {};
      const others = Object.entries(data)
        .filter(([uid]) => uid !== firebaseUser.uid)
        .some(([, isTyping]) => isTyping);
      setOpponentTyping(others);
    });
    return unsub;
  }, [gameId, firebaseUser?.uid]);

  const handleTyping = () => {
    if (!isFirebaseConfigured || !rtdb || !firebaseUser) return;
    set(ref(rtdb, `typing/${gameId}/${firebaseUser.uid}`), true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      if (rtdb) remove(ref(rtdb, `typing/${gameId}/${firebaseUser?.uid}`));
    }, 2000);
  };

  const sendMessage = async (msgText: string, isQuick = false) => {
    if (!isFirebaseConfigured || !db || !firebaseUser || !userProfile || !msgText.trim()) return;

    const msg: Omit<ChatMessage, 'id'> = {
      senderUid: firebaseUser.uid,
      senderUsername: userProfile.username,
      senderPhotoURL: userProfile.photoURL,
      text: msgText.trim(),
      isQuick,
      createdAt: serverTimestamp() as Timestamp,
    };

    setText('');
    setShowQuick(false);
    if (rtdb) remove(ref(rtdb, `typing/${gameId}/${firebaseUser.uid}`));
    await addDoc(collection(db, 'games', gameId, 'chat'), msg);
  };

  const handleOpenChat = () => {
    setOpen(true);
    setUnread(0);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!open && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#1a1a1c] border border-white/10 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
        >
          <MessageCircle size={20} className="text-white/70" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-[300px] h-[380px] flex flex-col bg-[#141416]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <span className="text-sm font-semibold text-white">Chat</span>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {messages.map((msg) => {
                const isMe = msg.senderUid === firebaseUser?.uid;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${isMe ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                      {!isMe && <p className="text-[10px] text-white/50 mb-0.5">{msg.senderUsername}</p>}
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {opponentTyping && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 px-3 py-2 rounded-2xl bg-white/10">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick messages */}
            <AnimatePresence>
              {showQuick && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/[0.06] overflow-hidden"
                >
                  <div className="p-2 flex flex-wrap gap-1.5">
                    {QUICK_MESSAGES.map((qm) => (
                      <button
                        key={qm}
                        onClick={() => sendMessage(qm, true)}
                        className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/[0.06]"
                      >
                        {qm}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-white/[0.06]">
              <button
                onClick={() => setShowQuick(!showQuick)}
                className="text-white/30 hover:text-white/70 transition-colors shrink-0"
              >
                <Smile size={18} />
              </button>
              <input
                type="text"
                value={text}
                onChange={(e) => { setText(e.target.value); handleTyping(); }}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(text)}
                placeholder="Say something…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
              <button
                onClick={() => sendMessage(text)}
                disabled={!text.trim()}
                className="text-white/30 hover:text-emerald-400 transition-colors disabled:opacity-30 shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
