import { useEffect, useRef } from 'react';
import { useSfx } from '../hooks/useSfx';

interface MicroProgressCelebrationProps {
  message: string;
  onComplete: () => void;
}

export default function MicroProgressCelebration({ message, onComplete }: MicroProgressCelebrationProps) {
  const { play } = useSfx();
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!hasPlayed.current) {
      play('micro-progress-reinforce');
      hasPlayed.current = true;
    }

    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [play, onComplete]);

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="glass-card border-app-accent p-4 rounded-lg shadow-lg">
        <div className="text-app-accent font-semibold text-center">
          ✨ {message}
        </div>
      </div>
    </div>
  );
}
