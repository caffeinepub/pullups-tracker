import { useEffect, useRef } from 'react';
import { AchievementDefinition } from '../../lib/achievements/types';
import TrophyIcon from './TrophyIcon';
import { useSfx } from '../../hooks/useSfx';

interface AchievementUnlockPopupProps {
  achievement: AchievementDefinition;
  onComplete: () => void;
}

export default function AchievementUnlockPopup({ achievement, onComplete }: AchievementUnlockPopupProps) {
  const { play } = useSfx();
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!hasPlayed.current) {
      play('save-chime');
      setTimeout(() => play('pr-bass'), 150);
      hasPlayed.current = true;
    }

    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [play, onComplete]);

  const difficultyColors = {
    easy: '#00f0ff',
    medium: '#ffcc00',
    hard: '#ff3bff',
    legendary: '#ffd700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className="glass-card border-2 p-8 rounded-2xl animate-achievement-bounce shadow-2xl"
        style={{
          backgroundColor: '#0b0f14',
          borderColor: difficultyColors[achievement.difficulty],
          boxShadow: `0 0 40px ${difficultyColors[achievement.difficulty]}66, 0 20px 60px rgba(0,0,0,0.8)`,
        }}
      >
        <div className="text-center space-y-4">
          <div className="text-sm font-bold uppercase tracking-wider" style={{ color: difficultyColors[achievement.difficulty] }}>
            Achievement Unlocked
          </div>
          
          <div className="flex justify-center animate-trophy-shine">
            <div
              className="p-6 rounded-full"
              style={{
                background: `radial-gradient(circle, ${difficultyColors[achievement.difficulty]}33 0%, transparent 70%)`,
                boxShadow: `0 0 30px ${difficultyColors[achievement.difficulty]}66`,
              }}
            >
              <TrophyIcon icon={achievement.icon} size={48} className="text-white" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-white mb-2">{achievement.name}</div>
            <div className="text-sm text-app-text-secondary">{achievement.description}</div>
          </div>

          <div className="flex justify-center gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full animate-particle-flare"
                style={{
                  backgroundColor: difficultyColors[achievement.difficulty],
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
