import React from 'react';
import { Track } from '../types';
import { Play } from 'lucide-react';

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track;
  onSelect: (track: Track) => void;
}

export const TrackList: React.FC<TrackListProps> = ({ tracks, currentTrack, onSelect }) => {
  return (
      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
        {tracks.map((track, i) => {
          const isCurrent = currentTrack.id === track.id;
          return (
            <div 
              key={track.id}
              onClick={() => onSelect(track)}
              className={`p-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors group border-b border-[#222] last:border-0
                ${isCurrent 
                  ? 'bg-[#1a1a1a] border-l-2 border-l-amber-500' 
                  : 'hover:bg-[#111] border-l-2 border-l-transparent'
                }`}
            >
              <div className="text-xs font-mono text-gray-600 w-6 text-center">
                 {isCurrent ? <Play size={10} className="text-amber-500 mx-auto fill-current" /> : (i + 1).toString().padStart(2, '0')}
              </div>

              <div className="relative w-8 h-8 flex-shrink-0 bg-gray-800">
                <img src={track.coverUrl} alt={track.title} className={`w-full h-full object-cover ${isCurrent ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm truncate ${isCurrent ? 'text-amber-100' : 'text-gray-400 group-hover:text-gray-200'}`}>
                  {track.title}
                </h4>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider truncate">{track.artist}</p>
              </div>
              
              <span className="text-[10px] text-gray-700 font-mono">{track.duration}</span>
            </div>
          );
        })}
      </div>
  );
};