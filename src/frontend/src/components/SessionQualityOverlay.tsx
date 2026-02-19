import { useEffect, useRef } from 'react';
import { useSfx } from '../hooks/useSfx';

interface SessionQualityOverlayProps {
  score: number;
  onComplete: () => void;
}

export default function SessionQualityOverlay({ score, onComplete }: SessionQualityOverlayProps) {
  const { play } = useSfx();
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!hasPlayed.current) {
      play('session-quality-elite');
      hasPlayed.current = true;
    }

    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [play, onComplete]);

  const getQualityLabel = (score: number) => {
    if (score >= 90) return 'ELITE';
    if (score >= 80) return 'EXCELLENT';
    if (score >= 70) return 'GREAT';
    return 'GOOD';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="text-center space-y-4 animate-in zoom-in duration-500">
        <div className="text-6xl font-bold text-app-accent animate-pulse">
          {getQualityLabel(score)}
        </div>
        <div className="text-3xl text-app-text-primary">
          Quality Score: {score}%
        </div>
      </div>
    </div>
  );
}
