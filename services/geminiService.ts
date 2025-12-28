import { GoogleGenAI } from "@google/genai";
import { Track } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateDJIntro = async (track: Track): Promise<string> => {
  if (!apiKey) {
    return `Now playing ${track.title} by ${track.artist}. (API Key missing for AI DJ)`;
  }

  try {
    const prompt = `
      You are "Midnight Jack", a legendary radio host on a vintage frequency 108.5 FM. The year is timeless, somewhere between 1970 and 1985.
      
      Introduce the next record:
      Title: "${track.title}"
      Artist: "${track.artist}"
      Album: "${track.album}"
      
      Style guide:
      - Voice: Deep, smooth, nostalgic, warm.
      - Keep it short (max 2 sentences).
      - Mention the "wax" or the "groove".
      - No hashtags, no emojis.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text?.trim() || `Spinning ${track.title} for you right now.`;
  } catch (error) {
    console.error("Gemini DJ Error:", error);
    return `Up next on the turntable, we have ${track.title}.`;
  }
};