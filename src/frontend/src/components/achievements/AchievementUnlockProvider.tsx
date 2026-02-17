import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AchievementDefinition } from '../../lib/achievements/types';
import AchievementUnlockPopup from './AchievementUnlockPopup';

interface AchievementUnlockContextType {
  showAchievement: (achievement: AchievementDefinition) => void;
}

const AchievementUnlockContext = createContext<AchievementUnlockContextType | undefined>(undefined);

export function AchievementUnlockProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<AchievementDefinition[]>([]);
  const [current, setCurrent] = useState<AchievementDefinition | null>(null);

  const showAchievement = useCallback((achievement: AchievementDefinition) => {
    setQueue(prev => [...prev, achievement]);
  }, []);

  const handleComplete = useCallback(() => {
    setCurrent(null);
    setQueue(prev => {
      const [next, ...rest] = prev;
      if (next) {
        setTimeout(() => setCurrent(next), 100);
      }
      return rest;
    });
  }, []);

  // Process queue
  if (current === null && queue.length > 0) {
    const [next, ...rest] = queue;
    setCurrent(next);
    setQueue(rest);
  }

  return (
    <AchievementUnlockContext.Provider value={{ showAchievement }}>
      {children}
      {current && <AchievementUnlockPopup achievement={current} onComplete={handleComplete} />}
    </AchievementUnlockContext.Provider>
  );
}

export function useAchievementUnlock() {
  const context = useContext(AchievementUnlockContext);
  if (!context) {
    throw new Error('useAchievementUnlock must be used within AchievementUnlockProvider');
  }
  return context;
}
