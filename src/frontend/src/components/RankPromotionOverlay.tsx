import { useEffect, useRef } from 'react';
import { RankInfo } from '../lib/types';
import RankBadge from './RankBadge';
import { useSfx } from '../hooks/useSfx';
import { triggerHaptic } from '../lib/haptics';

interface RankPromotionOverlayProps {
  rank: RankInfo;
  onComplete: () => void;
}

export default function RankPromotionOverlay({ rank, onComplete }: RankPromotionOverlayProps) {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300"
      style={{
        background: 'radial-gradient(circle, #0d1117 0%, #000000 100%)',
      }}
    >
      <div className="text-center space-y-6 animate-in zoom-in duration-500">
        <div className="text-4xl font-bold text-app-accent animate-pulse">
          RANK UP!
        </div>
        <div className="flex justify-center">
          <RankBadge rank={rank} size={320} isPromoting />
        </div>
        <div className="text-2xl font-bold" style={{ color: rank.color }}>
          {rank.name}
        </div>
      </div>
    </div>
  );
}
