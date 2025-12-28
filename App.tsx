import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Track, DJState } from './types';
import { TRACKS } from './constants';
import { RecordPlayer } from './components/RecordPlayer';
import { Controls } from './components/Controls';
import { TrackList } from './components/TrackList';
import { generateDJIntro } from './services/geminiService';
import { Menu, X, FolderOpen, Disc } from 'lucide-react';
import { processDirectory } from './utils/parsers'; 

const App: React.FC = () => {
  const [playlist, setPlaylist] = useState<Track[]>(TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showPlaylist, setShowPlaylist] = useState(false);
  // DJ State logic retained in case needed later, but display is removed
  const [djState, setDjState] = useState<DJState>({ isLoading: false, message: null });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
      audioRef.current.volume = volume;
    }
    
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        if (playlist[currentTrackIndex].duration === "0:00") {
             const m = Math.floor(audio.duration / 60);
             const s = Math.floor(audio.duration % 60).toString().padStart(2, '0');
             const newPlaylist = [...playlist];
             newPlaylist[currentTrackIndex].duration = `${m}:${s}`;
             setPlaylist(newPlaylist);
        }
    };
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist, currentTrackIndex]); 

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.audioUrl;
      setCurrentTime(0);
      
      const fetchIntro = async () => {
        setDjState({ isLoading: true, message: null });
        const intro = await generateDJIntro(currentTrack);
        setDjState({ isLoading: false, message: intro });
      };
      fetchIntro();

      if (wasPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
               if (audioContextRef.current?.state === 'suspended') {
                 audioContextRef.current.resume();
               }
            })
            .catch(e => console.log("Playback failed", e));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, currentTrack]); 

  const handleFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
        setIsPlaying(false);
        if (audioRef.current) audioRef.current.pause();
        
        const newTracks = await processDirectory(event.target.files);
        if (newTracks.length > 0) {
            setPlaylist(newTracks);
            setCurrentTrackIndex(0);
            setIsPlaying(true);
        } else {
            alert("No audio files found in this folder.");
        }
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }

      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Play error:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  }, [playlist.length]);

  const handlePrev = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  }, [playlist.length]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const handleTrackSelect = (track: Track) => {
    const index = playlist.findIndex(t => t.id === track.id);
    if (index !== -1) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      setShowPlaylist(false);
    }
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans relative text-amber-500">
      
      <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          // @ts-ignore
          webkitdirectory=""
          directory=""
          multiple
          onChange={handleFolderUpload}
      />

      {/* Playlist Toggle */}
      <button 
        onClick={() => setShowPlaylist(!showPlaylist)}
        className="absolute top-6 left-6 z-50 p-2 bg-[#111] rounded text-gray-500 border border-gray-800 hover:text-amber-500 transition-all"
      >
        {showPlaylist ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Upload Button */}
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="absolute top-6 right-6 z-50 px-3 py-1.5 bg-[#111] text-gray-500 border border-gray-800 font-mono text-xs rounded hover:text-amber-500 hover:border-amber-800 transition-all flex items-center gap-2 uppercase tracking-wide"
      >
        <FolderOpen size={14} /> Import
      </button>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 pt-16 relative w-full overflow-y-auto scrollbar-hide">
        
        <div className="z-10 w-full flex flex-col gap-6 max-w-lg items-center">
          
          {/* Header Info */}
          <div className="text-center w-full">
            <h2 className="text-2xl font-bold text-gray-200 tracking-tight truncate">
              {currentTrack.title}
            </h2>
            <p className="text-gray-500 font-mono text-xs tracking-widest uppercase mt-1">
               {currentTrack.artist}
            </p>
          </div>

          <RecordPlayer currentTrack={currentTrack} isPlaying={isPlaying} />
          
          <div className="w-full">
            <Controls 
              isPlaying={isPlaying} 
              onPlayPause={togglePlayPause} 
              onNext={handleNext}
              onPrev={handlePrev}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              volume={volume}
              onVolumeChange={handleVolumeChange}
              lyrics={currentTrack.lyrics}
            />
          </div>
        </div>
      </div>

      {/* Playlist Sidebar - Dark Theme */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-[#0a0a0a] border-r border-[#222] transform transition-transform duration-300 ease-in-out shadow-2xl
        ${showPlaylist ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
            <h3 className="text-gray-400 text-sm font-mono uppercase tracking-widest mb-6 flex items-center gap-2">
                <Disc size={16} /> Library
            </h3>
            <TrackList 
            tracks={playlist} 
            currentTrack={currentTrack} 
            onSelect={handleTrackSelect} 
            />
        </div>
      </div>

      {showPlaylist && (
        <div 
          className="fixed inset-0 bg-black/80 z-30 backdrop-blur-sm"
          onClick={() => setShowPlaylist(false)}
        />
      )}

    </div>
  );
};

export default App;