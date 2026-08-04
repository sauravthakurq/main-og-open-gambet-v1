import React from 'react';

export const Skeleton = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
  return (
    <div 
      className={`relative overflow-hidden bg-[#1a1a1a] ${className || ''}`}
      style={style}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  );
};

export const SkeletonText = ({ className, lines = 1 }: { className?: string, lines?: number }) => (
  <div className={`flex flex-col gap-2 ${className || ''}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={`h-4 rounded ${i === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'}`} 
      />
    ))}
  </div>
);

export const SkeletonImage = ({ className, variant = 'rectangular' }: { className?: string, variant?: 'circular' | 'rectangular' }) => (
  <Skeleton className={`${variant === 'circular' ? 'rounded-full' : 'rounded-2xl'} ${className || 'w-full h-full'}`} />
);

export const SkeletonButton = ({ className }: { className?: string }) => (
  <Skeleton className={`h-10 rounded-xl ${className || 'w-32'}`} />
);

export const SkeletonHero = () => (
  <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] rounded-[32px] overflow-hidden border border-white/5 bg-[#151515] mb-8">
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
    
    <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end z-10 pointer-events-none">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-24 h-6 rounded-full bg-[#242424]" />
      </div>
      
      <Skeleton className="w-3/4 max-w-[600px] h-12 rounded-xl bg-[#242424] mb-4" />
      <Skeleton className="w-1/2 max-w-[400px] h-6 rounded-lg bg-[#1a1a1a] mb-8" />

      <Skeleton className="w-48 h-12 rounded-2xl bg-[#2a2a2a]" />
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="flex flex-col justify-between rounded-3xl border border-white/5 bg-[#151515] overflow-hidden w-full h-[320px]">
    <div className="relative w-full h-36 shrink-0 border-b border-white/5 overflow-hidden">
       <Skeleton className="w-full h-full" />
    </div>
    <div className="flex flex-col flex-1 p-5">
      <Skeleton className="w-32 h-4 rounded-full mb-4 bg-[#242424]" />
      <SkeletonText lines={2} className="mb-4" />
      <div className="mt-auto pt-4 border-t border-white/5 flex justify-between">
        <Skeleton className="w-1/2 h-3 rounded-full" />
        <Skeleton className="w-4 h-4 rounded-full" />
      </div>
    </div>
  </div>
);

export const SkeletonChessBoard = () => (
  <div className="w-full max-w-[800px] flex flex-col gap-2">
    {/* Player Top */}
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <div className="flex flex-col flex-1 gap-2">
        <Skeleton className="w-32 h-4 rounded" />
        <Skeleton className="w-20 h-3 rounded" />
      </div>
    </div>
    
    {/* Board */}
    <div className="aspect-square w-full rounded-xl overflow-hidden border-2 border-white/5">
      <Skeleton className="w-full h-full" />
    </div>

    {/* Player Bottom */}
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <div className="flex flex-col flex-1 gap-2">
        <Skeleton className="w-32 h-4 rounded" />
        <Skeleton className="w-20 h-3 rounded" />
      </div>
    </div>
  </div>
);
