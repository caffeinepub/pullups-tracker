import { PullupSession } from './types';
import { getDailyStats } from './stats';

export function calculateFatigueScore(sessions: PullupSession[]): number {
  const last7Days = sessions.filter(s => s.timestamp >= Date.now() - 7 * 86400000);
  
  if (last7Days.length === 0) return 0;

  const dailyStats = getDailyStats(last7Days);
  const avgReps = dailyStats.reduce((sum, d) => sum + d.totalReps, 0) / 7;
  
  const todayTotal = dailyStats.find(d => d.date === new Date().toISOString().split('T')[0])?.totalReps || 0;
  
  if (avgReps === 0) return 0;
  
  const ratio = todayTotal / avgReps;
  const fatigueScore = Math.max(0, Math.min(100, (1 - ratio) * 100));
  
  return Math.round(fatigueScore);
}

export function calculateConsistencyScore(sessions: PullupSession[]): number {
  const last30Days = 30;
  const dailyStats = getDailyStats(sessions.filter(s => s.timestamp >= Date.now() - last30Days * 86400000));
  
  const daysWorked = dailyStats.length;
  const consistencyScore = (daysWorked / last30Days) * 100;
  
  return Math.round(Math.min(100, consistencyScore));
}

export const FATIGUE_FORMULA = "Fatigue = (1 - Today's Reps / 7-Day Average) × 100. Lower is better.";
export const CONSISTENCY_FORMULA = "Consistency = (Days Worked / 30) × 100. Higher is better.";
