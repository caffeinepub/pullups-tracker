import { ChestTier, CHEST_DEFINITIONS } from '../../lib/economy/chestsTypes';
import { ASSETS } from '../../assets/generated';
import { Lock } from 'lucide-react';

interface ChestTileProps {
  tier: ChestTier;
  coins: number;
  onClick: () => void;
}

export default function ChestTile({ tier, coins, onClick }: ChestTileProps) {
  const definition = CHEST_DEFINITIONS[tier];
  const canAfford = coins >= definition.cost;
  
  const chestImage = tier === 'common' ? ASSETS.chestCommon :
                     tier === 'rare' ? ASSETS.chestRare :
                     ASSETS.chestEpic;

  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`
        relative glass-card border-app-border rounded-xl p-6
        transition-all duration-300
        ${canAfford ? 'hover:scale-105 hover:border-app-accent cursor-pointer' : 'opacity-50 cursor-not-allowed'}
        chest-tile-${tier}
      `}
    >
      <div className="relative">
        <img 
          src={chestImage} 
          alt={definition.name}
          className="w-32 h-32 mx-auto object-contain"
        />
        {!canAfford && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-12 h-12 text-app-text-secondary opacity-70" />
          </div>
        )}
      </div>
      
      <h3 className="text-app-text-primary font-bold text-lg mt-4">
        {definition.name}
      </h3>
      
      <div className="flex items-center justify-center gap-2 mt-2">
        <Coins className="w-4 h-4 text-app-accent" />
        <span className="text-app-accent font-bold">{definition.cost}</span>
      </div>
      
      <p className="text-app-text-secondary text-sm mt-2">
        {definition.cardCount} cards
      </p>
    </button>
  );
}

function Coins({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}
