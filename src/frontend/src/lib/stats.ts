import { PullupSession, DailyStats, StreakInfo, PersonalRecords } from './types';

export function getDailyStats(sessions: PullupSession[]): DailyStats[] {
  const dailyMap = new Map<string, DailyStats>();

  sessions.forEach(session => {
    const date = new Date(session.timestamp).toISOString().split('T')[0];
    
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        totalReps: 0,
        sessions: [],
      });
    }

    const dayStats = dailyMap.get(date)!;
    dayStats.totalReps += session.totalReps;
    dayStats.sessions.push(session);
  });

  return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function getTodayTotal(sessions: PullupSession[]): number {
  const today = new Date().toISOString().split('T')[0];
  return sessions
    .filter(s => new Date(s.timestamp).toISOString().split('T')[0] === today)
    .reduce((sum, s) => sum + s.totalReps, 0);
}

export function getLifetimeTotal(sessions: PullupSession[]): number {
  return sessions.reduce((sum, s) => sum + s.totalReps, 0);
}

export function getStreakInfo(sessions: PullupSession[]): StreakInfo {
  if (sessions.length === 0) {
    return { current: 0, longest: 0, lastWorkoutDate: null };
  }

  const dailyStats = getDailyStats(sessions);
  const sortedDates = dailyStats.map(d => d.date).sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  for (let i = sortedDates.length - 1; i >= 0; i--) {
    if (i === sortedDates.length - 1) {
      if (sortedDates[i] === today || sortedDates[i] === yesterday) {
        currentStreak = 1;
      }
    } else {
      const current = new Date(sortedDates[i + 1]);
      const prev = new Date(sortedDates[i]);
      const diffDays = Math.floor((current.getTime() - prev.getTime()) / 86400000);

      if (diffDays === 1) {
        tempStreak++;
        if (i === sortedDates.length - 2 || currentStreak > 0) {
          currentStreak = tempStreak;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        if (currentStreak > 0) break;
      }
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return {
    current: currentStreak,
    longest: longestStreak,
    lastWorkoutDate: sortedDates[sortedDates.length - 1] || null,
  };
}

export function getPersonalRecords(sessions: PullupSession[]): PersonalRecords {
  const dailyStats = getDailyStats(sessions);
  
  return {
    maxDailyTotal: Math.max(0, ...dailyStats.map(d => d.totalReps)),
    maxSingleSession: Math.max(0, ...sessions.map(s => s.totalReps)),
    maxSingleSet: Math.max(0, ...sessions.flatMap(s => s.sets.map(set => set.reps))),
  };
}

export function getDailyAverage(sessions: PullupSession[]): number {
  if (sessions.length === 0) return 0;
  
  const dailyStats = getDailyStats(sessions);
  const total = dailyStats.reduce((sum, d) => sum + d.totalReps, 0);
  return dailyStats.length > 0 ? total / dailyStats.length : 0;
}

export function getWeeklyAverage(sessions: PullupSession[]): number {
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const recentSessions = sessions.filter(s => s.timestamp >= sevenDaysAgo);
  const total = recentSessions.reduce((sum, s) => sum + s.totalReps, 0);
  return total / 7;
}

export function getMonthlyTotal(sessions: PullupSession[]): number {
  const thirtyDaysAgo = Date.now() - 30 * 86400000;
  return sessions
    .filter(s => s.timestamp >= thirtyDaysAgo)
    .reduce((sum, s) => sum + s.totalReps, 0);
}
