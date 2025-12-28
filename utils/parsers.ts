import { Track, LyricLine } from "../types";

// --- Lyrics Parsing ---

const parseTime = (timeStr: string): number => {
  // Handles mm:ss.xx or mm:ss:xx
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  const minutes = parseInt(parts[0], 10);
  const seconds = parseFloat(parts[1].replace(',', '.')); // Replace comma for SRT format
  return minutes * 60 + seconds;
};

export const parseLRC = (content: string): LyricLine[] => {
  const lines = content.split('\n');
  const lyrics: LyricLine[] = [];
  const regex = /\[(\d{2}):(\d{2}(?:\.\d{2,3})?)\](.*)/;

  lines.forEach(line => {
    const match = line.match(regex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      const text = match[3].trim();
      if (text) {
        lyrics.push({ time: minutes * 60 + seconds, text });
      }
    }
  });
  return lyrics;
};

export const parseSRT = (content: string): LyricLine[] => {
  // Simple SRT parser
  const blocks = content.trim().split(/\n\s*\n/);
  const lyrics: LyricLine[] = [];

  blocks.forEach(block => {
    const lines = block.split('\n');
    if (lines.length >= 3) {
      // Line 0 is index, Line 1 is timestamp, Line 2+ is text
      const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3}) -->/);
      if (timeMatch) {
         // SRT time is HH:MM:SS,ms
         const parts = timeMatch[1].split(':');
         const seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2].replace(',', '.'));
         const text = lines.slice(2).join(' ').trim();
         if (text) {
             lyrics.push({ time: seconds, text });
         }
      }
    }
  });
  return lyrics;
};

// --- File Organizing ---

export const processDirectory = async (files: FileList): Promise<Track[]> => {
  const fileArray = Array.from(files);
  const tracks: Track[] = [];
  
  // 1. Identify Audio Files
  const audioFiles = fileArray.filter(f => f.type.startsWith('audio/') || f.name.endsWith('.mp3') || f.name.endsWith('.wav'));
  
  // 2. Identify Images
  const images = fileArray.filter(f => f.type.startsWith('image/'));
  
  // 3. Identify Lyrics
  const lyricFiles = fileArray.filter(f => f.name.endsWith('.lrc') || f.name.endsWith('.srt'));

  // 4. Default Cover (if folder has a generic cover.jpg)
  const defaultCover = images.find(f => f.name.toLowerCase().includes('cover') || f.name.toLowerCase().includes('folder'));
  const defaultCoverUrl = defaultCover ? URL.createObjectURL(defaultCover) : "https://picsum.photos/id/1016/500/500"; // Fallback

  for (let i = 0; i < audioFiles.length; i++) {
    const audio = audioFiles[i];
    const baseName = audio.name.substring(0, audio.name.lastIndexOf('.'));

    // Find matching cover
    const exactCover = images.find(f => f.name.startsWith(baseName));
    const coverUrl = exactCover ? URL.createObjectURL(exactCover) : defaultCoverUrl;

    // Find matching lyrics
    const lyricFile = lyricFiles.find(f => f.name.startsWith(baseName));
    let parsedLyrics: LyricLine[] | undefined = undefined;

    if (lyricFile) {
      try {
        const text = await lyricFile.text();
        if (lyricFile.name.endsWith('.srt')) {
            parsedLyrics = parseSRT(text);
        } else {
            parsedLyrics = parseLRC(text);
        }
      } catch (e) {
        console.error("Error reading lyric file", e);
      }
    }

    tracks.push({
      id: i + 100, // Offset IDs to avoid conflict with constants
      title: baseName, // Use filename as title initially
      artist: "Local Upload", // Placeholder until ID3 implemented or user edit
      album: "My Folder",
      coverUrl,
      audioUrl: URL.createObjectURL(audio),
      duration: "0:00", // Will be updated by onLoadedMetadata
      lyrics: parsedLyrics
    });
  }

  return tracks;
};
