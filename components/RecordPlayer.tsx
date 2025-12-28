import React from 'react';
import { Track } from '../types';

interface RecordPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
}

export const RecordPlayer: React.FC<RecordPlayerProps> = ({ currentTrack, isPlaying }) => {
  return (
    <div className="relative w-full max-w-md aspect-square mx-auto flex items-center justify-center select-none">
      
      {/* Base Unit - Matte Dark Grey/Black Technics Style */}
      <div className="absolute inset-0 rounded-sm bg-[#1a1a1a] shadow-2xl border-t border-white/5 border-b-8 border-black">
        {/* Texture */}
        <div className="absolute inset-0 matte-black opacity-50 rounded-sm"></div>
        {/* Branding badge area */}
        <div className="absolute bottom-4 right-4 w-24 h-4 bg-black/50 border border-white/10 rounded-sm"></div>
      </div>

      {/* Main Platter Container - Circular */}
      <div className="absolute inset-4 rounded-full bg-[#0a0a0a] shadow-[inset_0_0_20px_rgba(0,0,0,1)] border-4 border-[#222] flex items-center justify-center overflow-hidden">
        {/* Strobe Dots Ring */}
        <div className="absolute inset-1 rounded-full border-[12px] border-[#333] border-dashed opacity-50"></div>
        <div className="absolute inset-1 rounded-full border-[12px] border-[#222] border-dashed rotate-3 opacity-50"></div>
      </div>

      {/* The Vinyl Record - Perfectly Circular */}
      <div 
        className={`relative w-[85%] h-[85%] rounded-full bg-[#050505] shadow-xl flex items-center justify-center overflow-hidden animate-spin-slow ${isPlaying ? '' : 'paused-spin'}`}
      >
        {/* Realistic Grooves */}
        <div className="absolute inset-0 rounded-full vinyl-grooves opacity-90"></div>
        
        {/* Light reflection on grooves */}
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(transparent_0deg,rgba(255,255,255,0.08)_45deg,transparent_70deg,rgba(255,255,255,0.08)_225deg,transparent_250deg)] pointer-events-none"></div>

        {/* 3D Gold Text Engraving on Vinyl - Symmetrical Ring Layout */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
             <svg viewBox="0 0 300 300" className="w-full h-full">
                <defs>
                    {/* Circle Path for Text - Radius 108 */}
                    <path id="textCircle" d="M 150, 150 m -108, 0 a 108, 108 0 1, 1 216, 0 a 108, 108 0 1, 1 -216, 0" />
                    
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="25%" stopColor="#fbbf24" />
                        <stop offset="50%" stopColor="#b45309" />
                        <stop offset="75%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <filter id="textShadow">
                        <feDropShadow dx="1" dy="1" stdDeviation="0.5" floodColor="#000" floodOpacity="0.9"/>
                    </filter>
                </defs>
                
                {/* 
                   Circumference ~678.
                   startOffset="0%" aligns the first segment to the Top (12 o'clock) assuming path starts at 9 o'clock.
                   Text repeated twice for symmetry.
                */}
                <text className="text-[12px] font-black tracking-[0.2em] uppercase" fill="url(#goldGradient)" filter="url(#textShadow)">
                   <textPath href="#textCircle" startOffset="0%" lengthAdjust="spacing" textLength="678">
                      MENGTIAN LIVESHOW × JAY CHOU • MENGTIAN LIVESHOW × JAY CHOU •
                   </textPath>
                </text>
             </svg>
        </div>

        {/* Record Label / Cover Art */}
        <div className="w-[40%] h-[40%] rounded-full overflow-hidden border-4 border-[#111] relative z-20 shadow-[0_0_10px_rgba(0,0,0,0.8)]">
          <img 
            src={currentTrack.coverUrl} 
            alt="Album Art" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        
        {/* Spindle */}
        <div className="absolute w-3 h-3 bg-gray-300 rounded-full z-30 shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-black rounded-full"></div>
        </div>
      </div>

      {/* Power/Strobe Light (Amber) */}
      <div className="absolute bottom-4 left-4 w-6 h-6 bg-[#111] rounded-full border-2 border-[#333] shadow-lg flex items-center justify-center overflow-hidden">
         <div className={`w-full h-full bg-amber-500 rounded-full blur-[2px] ${isPlaying ? 'opacity-100 animate-pulse' : 'opacity-20'}`}></div>
      </div>

      {/* Tone Arm Assembly - Silver/Industrial */}
      <div className="absolute top-4 right-4 w-24 h-64 z-30 pointer-events-none flex flex-col items-end">
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-b from-gray-400 to-gray-700 rounded-full shadow-xl border-2 border-gray-600 flex items-center justify-center">
           <div className="w-12 h-12 bg-[#111] rounded-full border border-gray-600"></div>
        </div>
        <div 
          className="absolute top-12 right-12 w-4 h-48 origin-[50%_10%] transition-transform duration-1000 ease-in-out"
          style={{ 
            transform: isPlaying ? 'rotate(18deg)' : 'rotate(-15deg)' 
          }}
        >
          <div className="w-2 h-full bg-gradient-to-r from-gray-300 via-white to-gray-400 mx-auto rounded-full shadow-lg"></div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-10 bg-[#222] border border-gray-600 rounded-sm"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-10 bg-[#111] border-t-2 border-gray-400 rounded-b-sm">
             <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white"></div>
          </div>
        </div>
      </div>

      {/* Pitch Slider (Decoration) */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 h-32 w-6 bg-[#111] rounded border border-[#333] flex flex-col items-center justify-center gap-1">
        <div className="w-1 h-28 bg-[#000] rounded-full flex items-center justify-center relative">
            <div className="w-4 h-6 bg-[#222] border-t border-b border-gray-500 shadow-md absolute top-1/2 -translate-y-1/2 cursor-not-allowed"></div>
        </div>
      </div>

    </div>
  );
};