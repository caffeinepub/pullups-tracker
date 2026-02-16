import { useEffect, useRef } from 'react';
import { useSfx } from '../hooks/useSfx';
import { triggerHaptic } from '../lib/haptics';

interface RecordCelebrationProps {
  onComplete: () => void;
}

export default function RecordCelebration({ onComplete }: RecordCelebrationProps) {
  const { play } = useSfx();
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!hasPlayed.current) {
      play('pr-bass');
      triggerHaptic('strong');
      hasPlayed.current = true;
    }

    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [play, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="text-center space-y-4 animate-in zoom-in duration-500">
        <div className="text-6xl font-bold text-app-success animate-pulse">
          NEW RECORD!
        </div>
        <div className="text-2xl text-app-text-primary">
          Personal Best Achieved
        </div>
      </div>
    </div>
  );
}
