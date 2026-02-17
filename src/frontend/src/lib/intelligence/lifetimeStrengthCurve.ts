import { PullupSession } from '../types';
import { getDailyStats } from '../stats';

export interface StrengthCurvePoint {
  date: string;
  maxReps: number;
  rollingMax: number;
}

export function calculateLifetimeStrengthCurve(sessions: PullupSession[]): StrengthCurvePoint[] {
  if (sessions.length === 0) return [];

  const dailyStats = getDailyStats(sessions);
  const points: StrengthCurvePoint[] = [];
  let runningMax = 0;

  dailyStats.forEach(day => {
    runningMax = Math.max(runningMax, day.totalReps);
    points.push({
      date: day.date,
      maxReps: day.totalReps,
      rollingMax: runningMax,
    });
  });

  return points;
}
