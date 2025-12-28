import React from 'react';
import { DJState } from '../types';

interface AIDJDisplayProps {
  djState: DJState;
}

export const AIDJDisplay: React.FC<AIDJDisplayProps> = ({ djState }) => {
  return (
    <div className="w-full max-w-lg mx-auto mt-6 relative group">
      
      {/* Casing */}
      <div className="w-full bg-[#111] border-2 border-[#333] rounded-sm p-1 shadow-md relative overflow-hidden">
        
        {/* Label */}
        <div className="absolute top-2 left-3 flex items-center gap-2 z-20">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
             <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest font-sans drop-shadow-md">
                MENGTIAN
             </span>
        </div>

        {/* LCD Screen - Smaller now */}
        <div className="bg-[#051005] h-24 rounded-sm p-4 flex flex-col items-center justify-center relative border-t-2 border-black inset-shadow overflow-hidden">
           
           {/* Pixel Grid/Scanlines */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(0,20,0,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,20,0,0.5)_1px,transparent_1px)] bg-[length:3px_3px] pointer-events-none z-20 opacity-40"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#102010] to-transparent pointer-events-none z-10 opacity-20"></div>

           <div className="relative z-0 w-full text-center">
             {djState.isLoading ? (
                <div className="text-green-500/80 animate-pulse font-retro text-lg">
                   [ ESTABLISHING UPLINK... ]
                </div>
             ) : (
                <p className="text-green-400 font-retro text-lg md:text-xl leading-relaxed tracking-wide uppercase shadow-green-glow px-4">
                    {djState.message || "SYSTEM READY. WAITING FOR AUDIO STREAM..."}
                </p>
             )}
           </div>

        </div>
      </div>
    </div>
  );
};