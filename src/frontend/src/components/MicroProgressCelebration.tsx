import { useEffect, useState } from 'react';
import { useSfx } from '../hooks/useSfx';
import { Sparkles } from 'lucide-react';

interface MicroProgressCelebrationProps {
  message: string;
  onComplete: () => void;
}

export default function MicroProgressCelebration({ 
  message, 
  onComplete 
}: MicroProgressCelebrationProps) {
  const { play } = useSfx();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    play('micro-progress-reinforce');

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 200);
    }, 2000);

    return () => clearTimeout(timer);
  }, [play, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-top duration-300">
      <div className="glass-card border-app-accent px-6 py-3 rounded-full flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-app-accent" />
        <span className="text-app-text-primary font-semibold text-sm">{message}</span>
      </div>
    </div>
  );
}
