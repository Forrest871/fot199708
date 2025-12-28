import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Square } from 'lucide-react';
import { LyricLine } from '../types';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentTime: number;
  duration: number;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  volume: number;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lyrics?: LyricLine[];
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  lyrics,
}) => {
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Find active lyrics
  const activeIndex = lyrics 
    ? lyrics.findIndex((line, index) => {
        const nextLine = lyrics[index + 1];
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
      })
    : -1;

  const currentLine = activeIndex !== -1 && lyrics ? lyrics[activeIndex].text : "...";
  const nextLine = activeIndex !== -1 && lyrics && lyrics[activeIndex + 1] ? lyrics[activeIndex + 1].text : "";

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg mx-auto p-6 bg-[#1a1a1a] rounded-sm border-t border-white/10 shadow-2xl relative overflow-hidden">
      
      {/* Matte texture */}
      <div className="absolute inset-0 matte-black opacity-30 pointer-events-none"></div>

      {/* Retro LCD Screen Area - Amber Theme */}
      <div className="relative z-10 w-full mb-4 bg-[#1a0f00] border-4 border-[#0f0700] rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] h-32 flex flex-col items-center justify-center p-4 overflow-hidden">
        {/* Screen Glare/Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,176,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,176,0,0.03)_1px,transparent_1px)] bg-[length:3px_3px] pointer-events-none opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        
        {/* Lyrics Text - Retro Dot Pixel Font & Amber Color */}
        <div className="w-full text-center z-10 font-pixel-dots tracking-wide leading-relaxed flex flex-col items-center gap-3">
          {lyrics && lyrics.length > 0 ? (
            <>
              <p className="text-[#ffb000] text-2xl md:text-3xl drop-shadow-[0_0_6px_rgba(255,176,0,0.6)]">
                {currentLine}
              </p>
              <p className="text-[#92540e] text-lg md:text-xl opacity-70 blur-[0.4px]">
                {nextLine}
              </p>
            </>
          ) : (
            <p className="text-[#92540e] text-xl font-retro animate-pulse">NO DATA STREAM</p>
          )}
        </div>
      </div>

      {/* Progress Scale - Amber */}
      <div className="relative z-10 w-full flex items-center gap-4 font-mono text-xs text-amber-600/80 -mt-2">
        <span className="text-amber-500 font-bold tracking-widest">{formatTime(currentTime)}</span>
        <div className="flex-1 relative h-6 flex items-center">
           {/* Track lines graphic */}
           <div className="absolute inset-0 flex flex-col justify-center bg-[#000] border border-gray-700 h-2 my-auto rounded-full">
              <div className="h-full bg-gray-800 w-full rounded-full"></div>
           </div>
           
           <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={onSeek}
            className="relative z-10 w-full h-8 bg-transparent appearance-none cursor-pointer 
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-4 
              [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:bg-amber-500 
              [&::-webkit-slider-thumb]:rounded-sm
              [&::-webkit-slider-thumb]:border
              [&::-webkit-slider-thumb]:border-white
              [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(245,158,11,0.8)]
              [&::-webkit-slider-runnable-track]:h-2
              [&::-webkit-slider-runnable-track]:bg-transparent"
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Control Knobs & Buttons */}
      <div className="relative z-10 flex items-center justify-between mt-2">
        
        {/* Volume Fader Style */}
        <div className="flex flex-col items-center gap-1">
           <div className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Master Vol</div>
           <div className="flex items-center gap-2 bg-[#111] p-2 rounded border border-gray-800">
             <button className="text-gray-500 hover:text-amber-500 transition-colors">
                {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
             </button>
             <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={onVolumeChange}
                className="w-20 h-1 bg-gray-700 appearance-none rounded-lg cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:rounded-none"
             />
           </div>
        </div>

        {/* Transport Buttons - Chunky 90s Style */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onPrev} 
            className="w-10 h-10 bg-[#222] text-gray-400 hover:text-amber-100 border-b-4 border-black active:border-b-0 active:translate-y-1 rounded-sm flex items-center justify-center transition-all"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={onPlayPause} 
            className={`w-14 h-14 rounded-sm flex items-center justify-center shadow-lg border-b-4 active:border-b-0 active:translate-y-1 transition-all ${isPlaying ? 'bg-amber-600 border-amber-900 text-white shadow-[0_0_15px_rgba(217,119,6,0.4)]' : 'bg-[#333] border-black text-gray-300'}`}
          >
            {isPlaying ? (
              <Pause size={24} fill="currentColor" strokeWidth={0} />
            ) : (
              <Play size={24} fill="currentColor" className="ml-1" strokeWidth={0} />
            )}
          </button>

          <button 
             onClick={() => { if (isPlaying) onPlayPause(); }}
             className="w-10 h-10 bg-[#222] text-gray-400 hover:text-amber-500 border-b-4 border-black active:border-b-0 active:translate-y-1 rounded-sm flex items-center justify-center transition-all"
          >
             <Square size={16} fill="currentColor" />
          </button>

          <button 
             onClick={onNext} 
             className="w-10 h-10 bg-[#222] text-gray-400 hover:text-amber-100 border-b-4 border-black active:border-b-0 active:translate-y-1 rounded-sm flex items-center justify-center transition-all"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

      </div>
    </div>
  );
};