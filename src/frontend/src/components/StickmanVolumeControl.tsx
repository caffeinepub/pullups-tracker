import { useState, useRef, useEffect } from 'react';
import { useSfx } from '../hooks/useSfx';
import { triggerHaptic } from '../lib/haptics';
import { useScrollLock } from '../hooks/useScrollLock';
import StickmanPullupRig from './StickmanPullupRig';
import VerticalVolumeSlider from './VerticalVolumeSlider';
import SweatParticles from './SweatParticles';
import RollingCounter from './RollingCounter';

export default function StickmanVolumeControl() {
  const { volume, setVolume } = useSfx();
  const [localVolume, setLocalVolume] = useState(volume * 100);
  const [isDragging, setIsDragging] = useState(false);
  const [pullupProgress, setPullupProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const tickSoundRef = useRef<HTMLAudioElement | null>(null);

  useScrollLock(isDragging);

  // Load tick sound
  useEffect(() => {
    tickSoundRef.current = new Audio('/assets/sfx/tick_soft.wav');
    tickSoundRef.current.volume = 0.15;
  }, []);

  // Sync local volume with global volume
  useEffect(() => {
    setLocalVolume(volume * 100);
  }, [volume]);

  const handleVolumeChange = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(100, newVolume));
    setLocalVolume(clamped);
    setVolume(clamped / 100);
  };

  const handleStepComplete = (direction: 'up' | 'down') => {
    // Trigger haptic feedback
    triggerHaptic('light');

    // Play tick sound
    if (tickSoundRef.current) {
      tickSoundRef.current.currentTime = 0;
      tickSoundRef.current.play().catch(() => {});
    }

    // Animate pullup
    animatePullup(direction);
  };

  const animatePullup = (direction: 'up' | 'down') => {
    if (isAnimating) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const duration = 800; // 0.8s
    const pauseDuration = 200; // 0.2s pause at top

    const animate = () => {
      const elapsed = Date.now() - startTime;
      let progress = elapsed / duration;

      if (direction === 'up') {
        if (progress < 0.3) {
          // Rising phase
          const t = progress / 0.3;
          const eased = cubicBezier(t, 0.4, 0, 0.2, 1);
          setPullupProgress(eased);
        } else if (progress < 0.3 + pauseDuration / duration) {
          // Pause at top
          setPullupProgress(1);
        } else if (progress < 1) {
          // Lowering phase
          const t = (progress - 0.3 - pauseDuration / duration) / (1 - 0.3 - pauseDuration / duration);
          const eased = cubicBezier(t, 0.4, 0, 0.2, 1);
          setPullupProgress(1 - eased);
        } else {
          setPullupProgress(0);
          setIsAnimating(false);
          return;
        }
      } else {
        // Reverse animation for down
        if (progress < 0.5) {
          const t = progress / 0.5;
          const eased = cubicBezier(t, 0.4, 0, 0.2, 1);
          setPullupProgress(1 - eased);
        } else {
          setPullupProgress(0);
          setIsAnimating(false);
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const cubicBezier = (t: number, p1: number, p2: number, p3: number, p4: number) => {
    const u = 1 - t;
    return 3 * u * u * t * p1 + 3 * u * t * t * p3 + t * t * t;
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Color interpolation for volume text
  const getVolumeColor = (vol: number) => {
    const t = vol / 100;
    // Interpolate from #9ca3af to #22c55e
    const r1 = 156, g1 = 163, b1 = 175;
    const r2 = 34, g2 = 197, b2 = 94;
    
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="relative flex items-start justify-between gap-8 h-[500px] select-none">
      {/* Left side - Stickman area */}
      <div className="flex-1 relative h-full">
        {/* Volume percentage display */}
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl font-bold z-10"
          style={{ color: getVolumeColor(localVolume) }}
        >
          <RollingCounter value={Math.round(localVolume)} duration={300} />%
        </div>

        {/* Stickman rig */}
        <div className="absolute inset-0">
          <StickmanPullupRig
            pullupProgress={pullupProgress}
            isAnimating={isAnimating}
            volume={localVolume / 100}
          />
        </div>

        {/* Sweat particles */}
        {localVolume > 70 && isAnimating && (
          <SweatParticles
            isActive={true}
            originX={150}
            originY={100}
          />
        )}
      </div>

      {/* Right side - Volume slider */}
      <div className="w-20 h-full flex items-center">
        <VerticalVolumeSlider
          value={localVolume}
          onChange={handleVolumeChange}
          onStepComplete={handleStepComplete}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        />
      </div>
    </div>
  );
}
