'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { OpponentType } from '@/store/useAppStore';
import { Cpu, Brain, Globe, Terminal, Crown, User, Users, Shield, Eye, Star } from 'lucide-react';

interface OpponentSelectionProps {
  onSelect: (type: OpponentType) => void;
}

import { audioManager } from '@/lib/audioManager';

const MODES = [
  {
    id: 'ai',
    icon: Brain,
    title: 'AI Models',
    description: 'Challenge frontier AI models like GPT-4o, Claude, or Grok.',
    image: '/ai model.avif',
    rating: '4.7',
    badgeIcon: Crown,
    badgeText: 'Best for Learning',
    theme: { accent: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)' }
  },
  {
    id: 'computer',
    icon: Cpu,
    title: 'Computer',
    description: 'Play against a powerful local engine.',
    image: '/computer.avif',
    rating: '4.5',
    badgeIcon: User,
    badgeText: 'Classic Mode',
    theme: { accent: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)' }
  },
  {
    id: 'online',
    icon: Globe,
    title: 'Online',
    description: 'Play with real people around the world.',
    image: '/online.avif',
    rating: '4.6',
    badgeIcon: Users,
    badgeText: 'Live Players',
    theme: { accent: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)' }
  },
  {
    id: 'local',
    icon: Terminal,
    title: 'Local AI',
    description: 'Play against private AI models running directly on your device.',
    image: '/local ai.avif',
    rating: '4.4',
    badgeIcon: Shield,
    badgeText: 'Private & Secure',
    theme: { accent: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)' }
  },
  {
    id: 'aivsai',
    icon: Brain,
    title: 'AI vs AI',
    description: 'Watch two AI models go head to head in an epic battle.',
    image: '/ai vs ai.avif',
    rating: '4.8',
    badgeIcon: Eye,
    badgeText: 'Spectator Mode',
    theme: { accent: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)' }
  }
] as const;

function PremiumSurface({ mode, index, onSelect }: { mode: typeof MODES[number], index: number, onSelect: () => void }) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set((x / rect.width) - 0.5);
    mouseY.set((y / rect.height) - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const Icon = mode.icon;
  const BadgeIcon = mode.badgeIcon;

  return (
    <motion.button
      ref={cardRef}
      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ 
        duration: 0.15, 
        delay: index * 0.1, 
        type: 'spring', 
        bounce: 0.4 
      }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      className="group relative w-full sm:w-[260px] h-[240px] rounded-[24px] text-left outline-none shrink-0"
    >
      <div 
        className="absolute inset-0 rounded-[24px] overflow-hidden bg-black"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundImage: `url("${mode.image}")` }}
        />
        
        {/* Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0e] via-[#0a0a0e]/80 to-transparent opacity-90" />
        
        {/* Glass Bevel/Border */}
        <div className="absolute inset-0 rounded-[24px] border border-white/10" />
      </div>

      {/* Top Left Glass Icon */}
      <div 
        className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/20 shadow-lg pointer-events-none"
        style={{ transform: 'translateZ(30px)' }}
      >
        <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
      </div>

      {/* Bottom Content Area */}
      <div 
        className="absolute bottom-0 left-0 w-full px-5 pb-5 pt-10 flex flex-col justify-end pointer-events-none"
        style={{ transform: 'translateZ(40px)' }}
      >
        <h2 className="text-[20px] font-bold tracking-tight text-white mb-1.5 drop-shadow-md">
          {mode.title}
        </h2>
        
        <p className="text-[13px] font-[500] leading-snug text-white/70 mb-4 line-clamp-2">
          {mode.description}
        </p>
        
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          {/* Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shrink-0 shadow-sm">
            <BadgeIcon className="w-[12px] h-[12px] text-white/90 shrink-0" strokeWidth={2.5} />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap pt-[1px]">{mode.badgeText}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function OpponentSelection({ onSelect }: OpponentSelectionProps) {
  
  const handleSelect = (id: OpponentType) => {
    audioManager.play('select');
    onSelect(id);
  };

  return (
    <div className="w-full flex flex-col items-center px-4">
      
      {/* Header Typography - Apple Vision Pro Style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 relative text-center"
      >
        <h1 className="text-[40px] font-[700] tracking-tight text-[#F5F5F7] mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          Choose Your Opponent
        </h1>
        <p className="text-[17px] font-[500] text-white/70 max-w-[500px] mx-auto leading-[1.5] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Play against a powerful local engine, frontier AI models, or real players online.
        </p>
      </motion.div>

      {/* Surface Layout - 3D Perspective Grid */}
      <div 
        className="flex flex-wrap justify-center gap-6 w-full max-w-[900px] mx-auto"
        style={{ perspective: 1400 }} 
      >
        {MODES.map((mode, index) => (
          <PremiumSurface 
            key={mode.id} 
            mode={mode} 
            index={index} 
            onSelect={() => handleSelect(mode.id as OpponentType)} 
          />
        ))}
      </div>
    </div>
  );
}
