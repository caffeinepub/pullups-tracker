import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AchievementUnlock } from '../lib/achievements/types';
import { getUnlockedAchievements } from '../lib/achievements/service';

interface AchievementsContextType {
  unlockedIds: Set<string>;
  refreshUnlocks: () => Promise<void>;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [unlocks, setUnlocks] = useState<AchievementUnlock[]>([]);

  const refreshUnlocks = async () => {
    const data = await getUnlockedAchievements();
    setUnlocks(data);
  };

  useEffect(() => {
    refreshUnlocks();
  }, []);

  const unlockedIds = new Set(unlocks.map(u => u.achievementId));

  return (
    <AchievementsContext.Provider value={{ unlockedIds, refreshUnlocks }}>
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within AchievementsProvider');
  }
  return context;
}
