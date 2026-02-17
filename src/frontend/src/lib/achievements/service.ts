import { offlineDb } from '../offlineDb';
import { AchievementContext, AchievementUnlock } from './types';
import { detectNewAchievements } from './detector';
import { ACHIEVEMENTS } from './definitions';

export async function checkAndUnlockAchievements(context: AchievementContext): Promise<AchievementUnlock[]> {
  const existingUnlocks = await offlineDb.getAllAchievementUnlocks();
  const newAchievements = detectNewAchievements(context, existingUnlocks);

  const newUnlocks: AchievementUnlock[] = [];

  for (const achievement of newAchievements) {
    const unlock: AchievementUnlock = {
      achievementId: achievement.id,
      timestamp: Date.now(),
    };
    await offlineDb.addAchievementUnlock(unlock);
    newUnlocks.push(unlock);
  }

  return newUnlocks;
}

export async function getUnlockedAchievements(): Promise<AchievementUnlock[]> {
  return offlineDb.getAllAchievementUnlocks();
}

export function getAchievementById(id: string) {
  return ACHIEVEMENTS.find(a => a.id === id);
}
