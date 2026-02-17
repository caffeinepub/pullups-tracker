import { useMemo, useState } from 'react';
import { ACHIEVEMENTS } from '../lib/achievements/definitions';
import { AchievementDifficulty } from '../lib/achievements/types';
import { useAchievements } from '../hooks/useAchievements';
import AchievementCard from '../components/achievements/AchievementCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy } from 'lucide-react';

export default function AchievementsScreen() {
  const { unlockedIds } = useAchievements();
  const [filter, setFilter] = useState<AchievementDifficulty | 'all'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);

  const filteredAchievements = useMemo(() => {
    if (filter === 'all') return ACHIEVEMENTS;
    return ACHIEVEMENTS.filter(a => a.difficulty === filter);
  }, [filter]);

  const unlockedCount = ACHIEVEMENTS.filter(a => unlockedIds.has(a.id)).length;

  const selectedAch = selectedAchievement ? ACHIEVEMENTS.find(a => a.id === selectedAchievement) : null;

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-app-text-primary flex items-center gap-3">
            <Trophy className="w-8 h-8" />
            Achievements
          </h1>
          <p className="text-app-text-secondary mt-2">
            {unlockedCount} / {ACHIEVEMENTS.length} unlocked
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          className="text-sm"
        >
          All
        </Button>
        <Button
          variant={filter === 'easy' ? 'default' : 'outline'}
          onClick={() => setFilter('easy')}
          className="text-sm"
          style={{ borderColor: filter === 'easy' ? '#00f0ff' : undefined }}
        >
          Easy
        </Button>
        <Button
          variant={filter === 'medium' ? 'default' : 'outline'}
          onClick={() => setFilter('medium')}
          className="text-sm"
          style={{ borderColor: filter === 'medium' ? '#ffcc00' : undefined }}
        >
          Medium
        </Button>
        <Button
          variant={filter === 'hard' ? 'default' : 'outline'}
          onClick={() => setFilter('hard')}
          className="text-sm"
          style={{ borderColor: filter === 'hard' ? '#ff3bff' : undefined }}
        >
          Hard
        </Button>
        <Button
          variant={filter === 'legendary' ? 'default' : 'outline'}
          onClick={() => setFilter('legendary')}
          className="text-sm"
          style={{ borderColor: filter === 'legendary' ? '#ffd700' : undefined }}
        >
          Legendary
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="grid grid-cols-1 gap-3 pr-4">
          {filteredAchievements.map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={unlockedIds.has(achievement.id)}
              onSelect={() => setSelectedAchievement(achievement.id)}
            />
          ))}
        </div>
      </ScrollArea>

      {selectedAch && (
        <div
          className="fixed bottom-6 left-6 right-6 glass-card border-2 p-6 rounded-xl animate-in slide-in-from-bottom duration-300"
          style={{
            backgroundColor: '#0b0f14',
            borderColor: '#00f0ff',
            boxShadow: '0 0 30px #00f0ff44',
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xl font-bold text-white">{selectedAch.name}</div>
              <div className="text-sm text-app-text-secondary mt-2">{selectedAch.description}</div>
              <div className="text-xs mt-3 uppercase tracking-wider text-app-accent">
                {selectedAch.difficulty} • {unlockedIds.has(selectedAch.id) ? 'Unlocked' : 'Locked'}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedAchievement(null)}
              className="text-app-text-secondary"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
