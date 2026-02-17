import { AchievementDefinition, AchievementContext, AchievementUnlock } from './types';
import { ACHIEVEMENTS } from './definitions';

export function detectNewAchievements(
  context: AchievementContext,
  existingUnlocks: AchievementUnlock[]
): AchievementDefinition[] {
  const unlockedIds = new Set(existingUnlocks.map(u => u.achievementId));
  const newlyUnlocked: AchievementDefinition[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlockedIds.has(achievement.id) && achievement.checkUnlock(context)) {
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}
