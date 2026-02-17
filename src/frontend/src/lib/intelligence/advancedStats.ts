import { PullupSession } from '../types';
import { getDailyStats } from '../stats';

export interface AdvancedStatistics {
  lifetimeReps: number;
  totalSessions: number;
  averageRepsPerSession: number;
  mostProductiveWeek: {
    startDate: string;
    totalReps: number;
  };
  fastestImprovement: {
    period: string;
    improvement: number;
  };
  strengthVelocity: number;
}

export function calculateAdvancedStats(sessions: PullupSession[]): AdvancedStatistics {
  if (sessions.length === 0) {
    return {
      lifetimeReps: 0,
      totalSessions: 0,
      averageRepsPerSession: 0,
      mostProductiveWeek: { startDate: 'N/A', totalReps: 0 },
      fastestImprovement: { period: 'N/A', improvement: 0 },
      strengthVelocity: 0,
    };
  }

  const lifetimeReps = sessions.reduce((sum, s) => sum + s.totalReps, 0);
  const totalSessions = sessions.length;
  const averageRepsPerSession = Math.round(lifetimeReps / totalSessions);
  
  const dailyStats = getDailyStats(sessions);
  const mostProductiveWeek = findMostProductiveWeek(dailyStats);
  const fastestImprovement = findFastestImprovement(dailyStats);
  const strengthVelocity = calculateStrengthVelocity(dailyStats);

  return {
    lifetimeReps,
    totalSessions,
    averageRepsPerSession,
    mostProductiveWeek,
    fastestImprovement,
    strengthVelocity,
  };
}

function findMostProductiveWeek(dailyStats: any[]): { startDate: string; totalReps: number } {
  if (dailyStats.length < 7) {
    return { startDate: 'N/A', totalReps: 0 };
  }

  let maxWeekTotal = 0;
  let maxWeekStart = '';

  for (let i = 0; i <= dailyStats.length - 7; i++) {
    const weekTotal = dailyStats.slice(i, i + 7).reduce((sum, d) => sum + d.totalReps, 0);
    if (weekTotal > maxWeekTotal) {
      maxWeekTotal = weekTotal;
      maxWeekStart = dailyStats[i].date;
    }
  }

  return {
    startDate: maxWeekStart || 'N/A',
    totalReps: maxWeekTotal,
  };
}

function findFastestImprovement(dailyStats: any[]): { period: string; improvement: number } {
  if (dailyStats.length < 14) {
    return { period: 'N/A', improvement: 0 };
  }

  let maxImprovement = 0;
  let maxPeriod = '';

  for (let i = 0; i <= dailyStats.length - 14; i++) {
    const firstWeek = dailyStats.slice(i, i + 7).reduce((sum, d) => sum + d.totalReps, 0);
    const secondWeek = dailyStats.slice(i + 7, i + 14).reduce((sum, d) => sum + d.totalReps, 0);
    const improvement = secondWeek - firstWeek;
    
    if (improvement > maxImprovement) {
      maxImprovement = improvement;
      maxPeriod = `${dailyStats[i].date} to ${dailyStats[i + 13].date}`;
    }
  }

  return {
    period: maxPeriod || 'N/A',
    improvement: Math.round(maxImprovement),
  };
}

function calculateStrengthVelocity(dailyStats: any[]): number {
  if (dailyStats.length < 14) return 0;

  const recent14 = dailyStats.slice(-14);
  const firstWeek = recent14.slice(0, 7).reduce((sum, d) => sum + d.totalReps, 0) / 7;
  const secondWeek = recent14.slice(7).reduce((sum, d) => sum + d.totalReps, 0) / 7;
  
  const velocity = secondWeek - firstWeek;
  return Math.round(velocity * 10) / 10;
}
