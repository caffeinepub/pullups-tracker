export type AchievementDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  difficulty: AchievementDifficulty;
  icon: string;
  checkUnlock: (context: AchievementContext) => boolean;
}

export interface AchievementContext {
  totalReps: number;
  sessions: any[];
  currentStreak: number;
  longestStreak: number;
  maxDailyTotal: number;
  maxSingleSession: number;
  maxSingleSet: number;
  qualityRecords: any[];
  milestones: any[];
  orbEnergy?: number;
  readiness?: number;
  fatigue?: number;
}

export interface AchievementUnlock {
  achievementId: string;
  timestamp: number;
}
