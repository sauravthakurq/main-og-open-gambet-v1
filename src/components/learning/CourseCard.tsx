import React from 'react';
import { Play, CheckCircle2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Course {
  id: string;
  title: string;
  duration: string;
  level: string;
  progress: number;
  image: string;
  locked?: boolean;
}

export const CourseCard = ({ course }: { course: Course }) => {
  return (
    <div className="w-[280px] shrink-0 group cursor-pointer relative">
       {/* Thumbnail */}
       <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative mb-4 border border-white/10 group-hover:border-white/30 transition-colors shadow-lg">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent opacity-80"></div>
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
             <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                course.level === 'Beginner' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                course.level === 'Advanced' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                'bg-purple-500/20 text-purple-400 border-purple-500/30'
             }`}>
                {course.level}
             </span>
          </div>

          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white border border-white/10">
             {course.duration}
          </div>

          {/* Center Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
             {course.locked ? (
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                 <Lock className="text-white" size={24} />
               </div>
             ) : (
               <div className="w-14 h-14 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-[0_0_20px_rgba(227,193,149,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
                 <Play className="text-black ml-1" size={24} fill="currentColor" />
               </div>
             )}
          </div>

          {/* Progress Bar (Bottom Edge of Image) */}
          {course.progress > 0 && !course.locked && (
             <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/50">
                <div 
                  className={`h-full ${course.progress === 100 ? 'bg-green-500' : 'bg-[var(--color-accent)]'}`} 
                  style={{ width: `${course.progress}%` }}
                ></div>
             </div>
          )}
       </div>

       {/* Course Info */}
       <div className="pr-4">
          <h4 className="text-white font-bold text-lg mb-1 group-hover:text-[var(--color-accent)] transition-colors leading-tight line-clamp-2">
            {course.title}
          </h4>
          <div className="flex items-center gap-2 mt-2">
             {course.progress === 100 ? (
                <span className="flex items-center gap-1.5 text-green-400 text-xs font-bold uppercase tracking-wider">
                   <CheckCircle2 size={14} /> Completed
                </span>
             ) : course.progress > 0 ? (
                <span className="text-[var(--color-accent)] text-xs font-bold uppercase tracking-wider">
                   {course.progress}% Complete
                </span>
             ) : (
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">
                   Not Started
                </span>
             )}
          </div>
       </div>
    </div>
  );
};
