import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CourseCard } from './CourseCard';

interface CourseCarouselProps {
  title: string;
  icon?: React.ReactNode;
  courses: any[];
}

export const CourseCarousel = ({ title, icon, courses }: CourseCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/carousel">
       <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             {icon && <div className="p-2 bg-white/5 rounded-xl border border-white/10">{icon}</div>}
             <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
             <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/5">
               <ChevronLeft size={20} />
             </button>
             <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/5">
               <ChevronRight size={20} />
             </button>
          </div>
       </div>

       <div 
         ref={scrollRef}
         className="flex gap-6 overflow-x-auto custom-scrollbar pb-6 snap-x snap-mandatory"
         style={{ scrollbarWidth: 'none' }}
       >
          {courses.map((course, idx) => (
             <div key={course.id} className="snap-start">
               <CourseCard course={course} />
             </div>
          ))}
       </div>
    </div>
  );
};
