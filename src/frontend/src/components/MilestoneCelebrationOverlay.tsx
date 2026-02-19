import { useEffect, useRef } from 'react';
import { Milestone } from '../lib/intelligence/milestones';
import { useSfx } from '../hooks/useSfx';
import { triggerHaptic } from '../lib/haptics';

interface MilestoneCelebrationOverlayProps {
  milestone: Milestone;
  onComplete: () => void;
}

export default function MilestoneCelebrationOverlay({ milestone, onComplete }: MilestoneCelebrationOverlayProps) {
  const { play } = useSfx();
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!hasPlayed.current) {
      play('rank-promotion');
      triggerHaptic('strong');
      hasPlayed.current = true;
    }

    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [play, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="text-center space-y-4 animate-in zoom-in duration-500 p-8">
        <div className="text-5xl font-bold text-app-accent animate-pulse">
          🏆 MILESTONE!
        </div>
        <div className="text-2xl text-app-text-primary font-semibold">
          {milestone.title}
        </div>
        <div className="text-lg text-app-text-secondary">
          {milestone.description}
        </div>
      </div>
    </div>
  );
}
