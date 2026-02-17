import { useState, useEffect } from 'react';
import { ChestTier } from '../../lib/economy/chestsTypes';
import { ASSETS } from '../../assets/generated';

interface CardRevealProps {
  value: number;
  tier: ChestTier;
  delay: number;
  onRevealComplete?: () => void;
}

export default function CardReveal({ value, tier, delay, onRevealComplete }: CardRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
      if (onRevealComplete) {
        setTimeout(onRevealComplete, 400);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onRevealComplete]);

  const tierColor = tier === 'common' ? '#CD7F32' :
                    tier === 'rare' ? '#C0C0C0' :
                    '#FFD700';

  return (
    <div className={`
      card-reveal-container
      ${isRevealed ? 'revealed' : ''}
    `}>
      <div className="card-flip-wrapper">
        <div className="card-face card-back">
          <img src={ASSETS.cardBack} alt="Card back" className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className="card-face card-front" style={{ borderColor: tierColor }}>
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <div className="text-6xl font-bold mb-2" style={{ color: tierColor }}>
              {value}
            </div>
            <div className="text-sm text-app-text-secondary uppercase tracking-wider">
              RS
            </div>
            <div className="absolute inset-0 card-glow-effect" style={{ 
              background: `radial-gradient(circle, ${tierColor}40 0%, transparent 70%)` 
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
