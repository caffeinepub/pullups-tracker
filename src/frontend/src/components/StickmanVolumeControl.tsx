import { useRef, useState, useEffect } from 'react';
import { useSfx } from '../hooks/useSfx';
import { triggerHaptic } from '../lib/haptics';

export default function StickmanVolumeControl() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullHeight, setPullHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { volume, setVolume } = useSfx();
  const maxPullHeight = 200;

  useEffect(() => {
    setPullHeight(volume * maxPullHeight);
  }, [volume, maxPullHeight]);

  useEffect(() => {
    if (pullHeight >= maxPullHeight) {
      triggerHaptic('special');
      setTimeout(() => {
        setPullHeight(0);
        setVolume(0);
      }, 200);
    }
  }, [pullHeight, maxPullHeight, setVolume]);

  const handleStart = (clientY: number) => {
    if (!containerRef.current) return;
    setIsDragging(true);
  };

  const handleMove = (clientY: number) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = rect.bottom - clientY;
    const newHeight = Math.max(0, Math.min(maxPullHeight, relativeY));
    
    setPullHeight(newHeight);
    setVolume(newHeight / maxPullHeight);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const armStretch = pullHeight / maxPullHeight;

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="text-app-text-secondary text-sm">
        Volume: {Math.round(volume * 100)}%
      </div>
      
      <div
        ref={containerRef}
        className="relative w-64 h-80 glass-card border-app-border rounded-xl overflow-hidden"
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseMove={(e) => handleMove(e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientY)}
        onTouchEnd={handleEnd}
      >
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-app-text-secondary rounded-full" />
        
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-100"
          style={{
            bottom: `${pullHeight}px`,
            transform: `translateX(-50%) scaleY(${1 + armStretch * 0.5})`,
          }}
        >
          <svg width="60" height="100" viewBox="0 0 60 100" className="text-app-accent">
            <circle cx="30" cy="15" r="12" fill="currentColor" />
            <line x1="30" y1="27" x2="30" y2="60" stroke="currentColor" strokeWidth="3" />
            <line x1="30" y1="35" x2="10" y2="50" stroke="currentColor" strokeWidth="3" />
            <line x1="30" y1="35" x2="50" y2="50" stroke="currentColor" strokeWidth="3" />
            <line x1="30" y1="60" x2="15" y2="90" stroke="currentColor" strokeWidth="3" />
            <line x1="30" y1="60" x2="45" y2="90" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-app-text-secondary text-xs">
          Drag up to increase
        </div>
      </div>
    </div>
  );
}
