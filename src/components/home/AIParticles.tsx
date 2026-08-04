'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, BrainCircuit, Cpu, Zap } from 'lucide-react';

const CHESS_PIECES = ['♘', '♙', '♕', '♔', '♖', '♗'];
const AI_ICONS = [Bot, Sparkles, BrainCircuit, Cpu, Zap];

export default function AIParticles() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle Parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate particles
  const particles = useMemo(() => {
    const items = [];
    // Generate AI Icons
    for (let i = 0; i < 15; i++) {
      const Icon = AI_ICONS[i % AI_ICONS.length];
      items.push({
        id: `ai-${i}`,
        type: 'icon',
        Icon,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 20, // 20-40px
        duration: Math.random() * 20 + 20, // 20-40s
        delay: Math.random() * -30,
        direction: Math.random() > 0.5 ? 1 : -1,
        parallaxSpeed: Math.random() * 50 + 20,
      });
    }
    // Generate Chess Pieces
    for (let i = 0; i < 15; i++) {
      items.push({
        id: `chess-${i}`,
        type: 'text',
        content: CHESS_PIECES[i % CHESS_PIECES.length],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 30 + 30, // 30-60px
        duration: Math.random() * 25 + 25,
        delay: Math.random() * -30,
        direction: Math.random() > 0.5 ? 1 : -1,
        parallaxSpeed: Math.random() * 60 + 30,
      });
    }
    return items;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => {
        const parallaxX = mousePosition.x * p.parallaxSpeed;
        const parallaxY = mousePosition.y * p.parallaxSpeed;

        return (
          <motion.div
            key={p.id}
            className="absolute text-white/10 filter blur-[1px]"
            initial={{ 
              x: `${p.x}vw`, 
              y: `${p.y}vh`,
              opacity: 0.1,
              rotate: 0,
              scale: 0.8
            }}
            animate={{
              x: [`${p.x}vw`, `${p.x + (p.direction * 5)}vw`, `${p.x}vw`],
              y: [`${p.y}vh`, `${p.y - 10}vh`, `${p.y}vh`],
              rotate: [0, 180 * p.direction, 360 * p.direction],
              opacity: [0.05, 0.2, 0.05],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay
            }}
            style={{
              translateX: parallaxX,
              translateY: parallaxY,
              fontSize: p.type === 'text' ? p.size : undefined
            }}
          >
            {p.type === 'icon' && p.Icon && <p.Icon size={p.size} strokeWidth={1} />}
            {p.type === 'text' && p.content}
          </motion.div>
        );
      })}
    </div>
  );
}
