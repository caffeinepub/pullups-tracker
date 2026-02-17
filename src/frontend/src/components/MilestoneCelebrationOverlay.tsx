import { useEffect, useState } from 'react';
import { useSfx } from '../hooks/useSfx';
import { Milestone } from '../lib/intelligence/milestones';
import { Trophy, Flame, TrendingUp } from 'lucide-react';

interface MilestoneCelebrationOverlayProps {
  milestone: Milestone;
  onComplete: () => void;
}

export default function MilestoneCelebrationOverlay({ 
  milestone, 
  onComplete 
}: MilestoneCelebrationOverlayProps) {
  const { play } = useSfx();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    play('rank-promotion');

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [play, onComplete]);

  if (!visible) return null;

  const getIcon = () => {
    if (milestone.type.includes('streak')) return <Flame className="w-20 h-20 text-orange-500" />;
    if (milestone.type.includes('improvement')) return <TrendingUp className="w-20 h-20 text-app-accent" />;
    return <Trophy className="w-20 h-20 text-yellow-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-card border-app-accent p-10 rounded-2xl text-center space-y-6 max-w-md animate-in zoom-in duration-700">
        <div className="flex justify-center animate-bounce">
          {getIcon()}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-app-accent mb-2">{milestone.title}</h2>
          <p className="text-app-text-secondary text-lg">{milestone.description}</p>
        </div>
        <div className="text-5xl font-bold text-app-text-primary">
          {milestone.value}
        </div>
      </div>
    </div>
  );
}
