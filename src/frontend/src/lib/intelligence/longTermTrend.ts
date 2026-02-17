import { PullupSession } from '../types';
import { getDailyStats } from '../stats';

export interface LongTermTrend {
  direction: 'up' | 'stable' | 'down';
  strength: number;
  velocityMultiplier: number;
}

export function calculateLongTermTrend(sessions: PullupSession[]): LongTermTrend {
  if (sessions.length < 5) {
    return { direction: 'stable', strength: 0.5, velocityMultiplier: 1 };
  }

  const dailyStats = getDailyStats(sessions);
  const recentStats = dailyStats.slice(-30);
  
  if (recentStats.length < 5) {
    return { direction: 'stable', strength: 0.5, velocityMultiplier: 1 };
  }

  const midpoint = Math.floor(recentStats.length / 2);
  const firstHalf = recentStats.slice(0, midpoint);
  const secondHalf = recentStats.slice(midpoint);
  
  const firstAvg = firstHalf.reduce((sum, d) => sum + d.totalReps, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, d) => sum + d.totalReps, 0) / secondHalf.length;
  
  const change = secondAvg - firstAvg;
  const changePercent = firstAvg > 0 ? change / firstAvg : 0;
  
  let direction: 'up' | 'stable' | 'down' = 'stable';
  if (changePercent > 0.1) direction = 'up';
  else if (changePercent < -0.1) direction = 'down';
  
  const strength = Math.min(1, Math.abs(changePercent) * 5);
  
  let velocityMultiplier = 1;
  if (direction === 'up') {
    velocityMultiplier = 1 + strength * 0.5;
  } else if (direction === 'down') {
    velocityMultiplier = 1 - strength * 0.3;
  }

  return {
    direction,
    strength,
    velocityMultiplier: Math.max(0.5, Math.min(1.5, velocityMultiplier)),
  };
}
