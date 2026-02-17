import { useState } from 'react';
import { AchievementDefinition } from '../../lib/achievements/types';
import TrophyIcon from './TrophyIcon';

interface AchievementCardProps {
  achievement: AchievementDefinition;
  isUnlocked: boolean;
  onSelect: () => void;
}

export default function AchievementCard({ achievement, isUnlocked, onSelect }: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const difficultyColors = {
    easy: '#00f0ff',
    medium: '#ffcc00',
    hard: '#ff3bff',
    legendary: '#ffd700',
  };

  const color = difficultyColors[achievement.difficulty];

  return (
    <button
      className="glass-card border-app-border p-4 rounded-xl transition-all duration-300 text-left w-full"
      style={{
        opacity: isUnlocked ? 1 : 0.5,
        borderColor: isHovered && isUnlocked ? color : undefined,
        boxShadow: isHovered && isUnlocked ? `0 0 20px ${color}44` : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4">
        <div
          className="p-3 rounded-lg transition-all duration-300"
          style={{
            backgroundColor: isUnlocked ? `${color}22` : '#1a1a1a',
            boxShadow: isHovered && isUnlocked ? `0 0 15px ${color}66` : undefined,
          }}
        >
          <TrophyIcon
            icon={achievement.icon}
            size={32}
            className={isUnlocked ? 'text-white' : 'text-gray-600'}
          />
        </div>
        
        <div className="flex-1">
          <div className="font-semibold text-app-text-primary">{achievement.name}</div>
          <div className="text-xs text-app-text-secondary mt-1">{achievement.description}</div>
          <div className="text-xs mt-2 uppercase tracking-wider" style={{ color }}>
            {achievement.difficulty}
          </div>
        </div>

        {isUnlocked && (
          <div className="text-2xl">✓</div>
        )}
      </div>
    </button>
  );
}
