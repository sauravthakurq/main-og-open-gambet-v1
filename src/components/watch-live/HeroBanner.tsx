'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ImageWithSkeleton } from '@/components/ui/ImageWithSkeleton';

interface Broadcast {
  tour: {
    id: string;
    name: string;
    description: string;
    url: string;
    image?: string;
  };
}

interface HeroBannerProps {
  broadcasts: Broadcast[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ broadcasts }) => {
  const featured = broadcasts.filter(b => b.tour.image);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featured.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000); // 7 seconds
    
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) {
    return null; // Fallback: don't render hero if no images
  }

  const current = featured[currentIndex];

  return (
    <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 group mb-8 bg-[#151515]">
      {/* Background with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.tour.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <ImageWithSkeleton 
            src={current.tour.image} 
            alt={current.tour.name}
            className="w-full h-full object-cover"
            wrapperClassName="w-full h-full absolute inset-0"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]"></span>
          <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-[11px] uppercase tracking-widest rounded-full backdrop-blur-md">
            Live Featured
          </span>
        </div>
        
        <h2 className="text-xl sm:text-3xl font-bold text-white leading-snug mb-2 max-w-xl drop-shadow-lg line-clamp-1">
          {current.tour.name}
        </h2>
        
        <p className="text-white/80 text-sm sm:text-base max-w-lg font-medium drop-shadow-md line-clamp-1">
          {current.tour.description || "Official Lichess Broadcast"}
        </p>

        {/* Call to action (pointer events auto so it can be clicked) */}
        <div className="mt-8 pointer-events-auto">
          <a 
            href={`https://lichess.org/broadcast/-/${current.tour.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-black hover:bg-white/90 rounded-2xl font-bold text-sm transition-all duration-150 hover:scale-105 active:scale-95 shadow-xl"
          >
            <svg viewBox="0 0 1024 1024" width="18" height="18" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M225.1 251.9h592.7c14.2 0 25.8 11.5 25.8 25.8V690c0 14.2-11.5 25.8-25.8 25.8H225.1c-14.2 0-25.8-11.5-25.8-25.8V277.6c0-14.2 11.6-25.7 25.8-25.7z" fill="#000000"></path><path d="M817.9 741.5H225.1c-28.4 0-51.5-23.1-51.5-51.5V277.6c0-28.4 23.1-51.5 51.5-51.5h592.7c28.4 0 51.5 23.1 51.5 51.5V690c0.1 28.4-23 51.5-51.4 51.5zM225.1 277.6V690h592.7V277.6H225.1z" fill="#000000"></path><path d="M379.7 544.1c-6 0-12.1-2.1-17-6.4-10.7-9.4-11.7-25.7-2.3-36.4l92.2-104.8c4.8-5.5 11.8-8.7 19.1-8.8 7.2 0.3 14.3 3 19.3 8.3l70.9 77.2L659.2 362c9.4-10.7 25.7-11.8 36.4-2.4s11.8 25.7 2.4 36.4L581.6 528.8c-4.8 5.5-11.8 8.7-19.1 8.8-7.1 0.1-14.3-2.9-19.3-8.3L472.3 452l-73.2 83.3c-5.1 5.8-12.2 8.8-19.4 8.8z" fill="#000000"></path><path d="M225.1 638.4h592.7v51.5H225.1z" fill="#000000"></path><path d="M212.2 586.9h631.4v51.5H212.2z" fill="#000000"></path><path d="M276.7 780.2h476.8c14.2 0 25.8 11.5 25.8 25.8 0 14.2-11.5 25.8-25.8 25.8H276.7c-14.2 0-25.8-11.5-25.8-25.8s11.5-25.8 25.8-25.8z" fill="#000000"></path><path d="M748.9 831.7H289.1L349.9 690h358.6l40.4 141.7z m-381.6-51.5h313.3l-11-38.7H383.8l-16.5 38.7z" fill="#000000"></path></g></svg>
            Watch Broadcast
          </a>
        </div>
      </div>
      
      {/* Progress Indicators */}
      {featured.length > 1 && (
        <div className="absolute bottom-8 right-8 flex gap-2 z-10">
          {featured.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-150 ${
                idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
