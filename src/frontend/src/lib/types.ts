export interface PullupSet {
  reps: number;
  weight?: number;
}

export interface PullupSession {
  id: string;
  timestamp: number;
  sets: PullupSet[];
  duration?: number;
  tags: string[];
  totalReps: number;
}

export interface DailyStats {
  date: string;
  totalReps: number;
  sessions: PullupSession[];
}

export interface UserSettings {
  volume: number;
  dailyGoal: number;
}

export interface RankInfo {
  tier: number;
  name: string;
  color: string;
  metalTexture: string;
  threshold: number;
}

export interface StreakInfo {
  current: number;
  longest: number;
  lastWorkoutDate: string | null;
}

export interface PersonalRecords {
  maxDailyTotal: number;
  maxSingleSession: number;
  maxSingleSet: number;
}
