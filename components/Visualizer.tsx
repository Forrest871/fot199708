import React, { useRef, useEffect } from 'react';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle idle state
    if (!analyser || !isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw idle "off" segments (dark green)
        ctx.fillStyle = '#022c22'; // Very dark green
        const segmentHeight = 3;
        const gap = 1;
        const barWidth = 6;
        const totalBars = Math.ceil(canvas.width / (barWidth + 2));
        
        for (let i = 0; i < totalBars; i++) {
            const x = i * (barWidth + 2);
            for (let j = 0; j < 3; j++) {
                const y = canvas.height - (j * (segmentHeight + gap)) - segmentHeight;
                ctx.fillRect(x, y, barWidth, segmentHeight);
            }
        }
        return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationId: number;

    const renderFrame = () => {
      animationId = requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5; 
      let x = 0;

      const segmentHeight = 3;
      const gap = 1;

      for (let i = 0; i < bufferLength; i++) {
        const multiplier = 1 + (i / bufferLength); 
        const value = dataArray[i] * multiplier; 
        const barHeight = Math.min((value / 255) * canvas.height, canvas.height);
        const numSegments = Math.floor(barHeight / (segmentHeight + gap));

        for (let j = 0; j < numSegments; j++) {
            const y = canvas.height - (j * (segmentHeight + gap)) - segmentHeight;
            
            // Color Logic: Bottom = Green, Top = Red
            const percentHeight = j / (canvas.height / (segmentHeight + gap));
            if (percentHeight > 0.8) {
                ctx.fillStyle = '#ef4444'; // Red peak
            } else if (percentHeight > 0.6) {
                ctx.fillStyle = '#eab308'; // Yellow mid
            } else {
                ctx.fillStyle = '#22c55e'; // Green base
            }

            ctx.fillRect(x, y, barWidth, segmentHeight);
        }
        
        // Draw "off" segments
        ctx.fillStyle = '#064e3b'; // Dark Green dim
        const maxSegments = Math.floor(canvas.height / (segmentHeight + gap));
        for (let k = numSegments; k < maxSegments; k++) {
             const y = canvas.height - (k * (segmentHeight + gap)) - segmentHeight;
             ctx.fillRect(x, y, barWidth, segmentHeight);
        }

        x += barWidth + 2;
      }
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyser, isPlaying]);

  return (
    <div className="w-full h-16 bg-black rounded-sm border border-gray-800 relative overflow-hidden mb-4">
        {/* Grid Overlay */}
        <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(0,0,0,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.8)_1px,transparent_1px)] bg-[length:4px_4px] pointer-events-none opacity-20"></div>
        
        <canvas 
            ref={canvasRef} 
            width={300} 
            height={60} 
            className="w-full h-full block"
        />
    </div>
  );
};