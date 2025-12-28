export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Track {
  id: string | number;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  audioUrl: string;
  duration: string;
  lyrics?: LyricLine[]; // Optional parsed lyrics
}

export interface DJState {
  isLoading: boolean;
  message: string | null;
}
