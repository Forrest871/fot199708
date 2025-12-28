import React, { useEffect, useRef } from 'react';
import { LyricLine } from '../types';
import { Mic2, Music } from 'lucide-react';

interface LyricsDisplayProps {
  lyrics?: LyricLine[];
  currentTime: number;
}

export const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ lyrics, currentTime }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIndex = lyrics 
    ? lyrics.findIndex((line, index) => {
        const nextLine = lyrics[index + 1];
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
      })
    : -1;

  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  const activeLineRef = useRef<HTMLParagraphElement>(null);

  if (!lyrics || lyrics.length === 0) {
    return (
        <div className="w-full h-48 flex flex-col items-center justify-center text-gray-700 border-t border-gray-900 bg-black mt-4">
            <Music size={24} className="mb-2 opacity-50" />
            <p className="font-mono text-xs uppercase tracking-widest">No Lyrics Available</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-4 bg-black border-t-2 border-green-900/30 relative flex flex-col h-64">
       {/* Simple Header */}
       <div className="bg-black py-2 border-b border-gray-900 flex justify-between items-center px-2">
          <span className="text-green-700 font-mono text-[10px] uppercase tracking-[0.2em]">Lyric Feed</span>
       </div>

       {/* Lyrics Scroll Area */}
       <div 
         ref={containerRef}
         className="flex-1 overflow-y-auto p-4 text-center space-y-4 scrollbar-hide relative"
       >
         {lyrics.map((line, index) => {
           const isActive = index === activeIndex;
           return (
             <p
               key={index}
               ref={isActive ? activeLineRef : null}
               className={`font-sans transition-all duration-200 ${
                 isActive 
                   ? 'text-white text-base font-bold scale-105' 
                   : 'text-gray-600 text-sm'
               }`}
             >
               {line.text}
             </p>
           );
         })}
         <div className="h-24"></div> 
       </div>
    </div>
  );
};