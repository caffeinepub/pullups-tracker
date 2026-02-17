import { useEffect, useState } from 'react';
import { useSfx } from '../hooks/useSfx';
import RollingCounter from './RollingCounter';
import { Award } from 'lucide-react';

interface SessionQualityOverlayProps {
  score: number;
  onComplete: () => void;
}

export default function SessionQualityOverlay({ score, onComplete }: SessionQualityOverlayProps) {
  const { play } = useSfx();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    play('session-quality-elite');

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [play, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-card border-app-accent p-8 rounded-2xl text-center space-y-4 animate-in zoom-in duration-500">
        <div className="flex justify-center">
          <Award className="w-16 h-16 text-app-accent animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-app-text-primary">Session Quality</h2>
        <div className="text-6xl font-bold text-app-accent">
          <RollingCounter value={score} duration={1500} />
        </div>
        <p className="text-app-text-secondary">
          {score >= 85 ? 'Elite Performance!' :
           score >= 70 ? 'Excellent Work!' :
           score >= 50 ? 'Good Session!' :
           'Keep Building!'}
        </p>
      </div>
    </div>
  );
}
