import { useEffect, useState } from 'react';
import { usePullupStore } from '../../hooks/usePullupStore';
import { useSfx } from '../../hooks/useSfx';
import { triggerHaptic } from '../../lib/haptics';
import RollingCounter from '../RollingCounter';
import { ASSETS } from '../../assets/generated';
import { Coins } from 'lucide-react';

export default function CoinBalanceBadge() {
  const { coins } = usePullupStore();
  const { play } = useSfx();
  const [prevCoins, setPrevCoins] = useState(coins);
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    if (coins > prevCoins) {
      setShowGlow(true);
      play('coin-award');
      triggerHaptic('light');
      
      setTimeout(() => setShowGlow(false), 800);
    }
    setPrevCoins(coins);
  }, [coins, prevCoins, play]);

  return (
    <div className={`
      fixed top-6 right-6 z-50
      glass-card border-app-border rounded-full
      px-4 py-2 flex items-center gap-2
      transition-all duration-300
      ${showGlow ? 'coin-glow-burst' : ''}
    `}>
      <Coins className="w-5 h-5 text-app-accent" />
      <div className="text-app-accent font-bold text-lg tabular-nums">
        <RollingCounter value={coins} duration={600} />
      </div>
    </div>
  );
}
