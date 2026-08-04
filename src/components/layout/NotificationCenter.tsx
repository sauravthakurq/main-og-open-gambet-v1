import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, Shield, Brain, Users, Settings, Gamepad2 } from 'lucide-react';
import { useNotificationStore, NotificationItem } from '@/store/useNotificationStore';

const CATEGORY_ICONS = {
  System: <Settings className="w-4 h-4 text-gray-400" />,
  Security: <Shield className="w-4 h-4 text-red-400" />,
  AI: <Brain className="w-4 h-4 text-indigo-400" />,
  Friends: <Users className="w-4 h-4 text-emerald-400" />,
  Game: <Gamepad2 className="w-4 h-4 text-blue-400" />,
};

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (ts: number) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDifference = Math.round((ts - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (Math.abs(daysDifference) > 0) {
      return rtf.format(daysDifference, 'day');
    }
    const hoursDifference = Math.round((ts - Date.now()) / (1000 * 60 * 60));
    if (Math.abs(hoursDifference) > 0) {
      return rtf.format(hoursDifference, 'hour');
    }
    const minutesDifference = Math.round((ts - Date.now()) / (1000 * 60));
    return rtf.format(minutesDifference, 'minute');
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            className="absolute right-0 mt-2 w-[340px] max-h-[480px] flex flex-col bg-[#1a1a1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[999]"
          >
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="font-semibold text-white/90">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-white transition-colors"
                    title="Mark all as read"
                  >
                    <Check size={14} />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    onClick={clearAll}
                    className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-red-400 transition-colors"
                    title="Clear all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-white/40">
                  <Bell className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors border border-transparent ${
                      n.read ? 'hover:bg-white/5 opacity-70' : 'bg-white/5 hover:bg-white/10 border-white/5'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="shrink-0 mt-0.5">
                        {CATEGORY_ICONS[n.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-medium text-white/90 truncate">{n.title}</h4>
                          <span className="text-[10px] text-white/40 shrink-0 whitespace-nowrap">
                            {formatTime(n.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 mt-0.5 leading-snug break-words line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                      {!n.read && (
                        <div className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
