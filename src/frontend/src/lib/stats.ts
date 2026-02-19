import { PullupSession, DailyStats, StreakInfo, PersonalRecords } from './types';
import { getCurrentPSTDate, getPSTDateFromTimestamp } from './pstDate';

export function getLifetimeTotal(sessions: PullupSession[]): number {
  return sessions.reduce((sum, session) => sum + session.totalReps, 0);
}

export function getDailyStats(sessions: PullupSession[]): DailyStats[] {
  const dailyMap = new Map<string, PullupSession[]>();

  sessions.forEach(session => {
    const pstDate = session.pstDate || getPSTDateFromTimestamp(session.timestamp);
    if (!dailyMap.has(pstDate)) {
      dailyMap.set(pstDate, []);
    }
    dailyMap.get(pstDate)!.push(session);
  });

  const stats: DailyStats[] = [];
  dailyMap.forEach((daySessions, date) => {
    const totalReps = daySessions.reduce((sum, s) => sum + s.totalReps, 0);
    stats.push({
      date,
      totalReps,
      sessions: daySessions,
    });
  });

  return stats.sort((a, b) => a.date.localeCompare(b.date));
}

export function getStreakInfo(sessions: PullupSession[]): StreakInfo {
  if (sessions.length === 0) {
    return { current: 0, longest: 0, lastWorkoutDate: null };
  }

  const dailyStats = getDailyStats(sessions);
  const sortedDates = dailyStats.map(d => d.date).sort((a, b) => b.localeCompare(a));

  if (sortedDates.length === 0) {
    return { current: 0, longest: 0, lastWorkoutDate: null };
  }

  const today = getCurrentPSTDate();
  const lastWorkoutDate = sortedDates[0];

  // Calculate current streak
  let currentStreak = 0;
  const todayDate = new Date(today);
  
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(todayDate);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    if (sortedDates.includes(dateStr)) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  const allDates = sortedDates.sort((a, b) => a.localeCompare(b));
  
  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(allDates[i - 1]);
      const currDate = new Date(allDates[i]);
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    current: currentStreak,
    longest: longestStreak,
    lastWorkoutDate,
  };
}

export function getPersonalRecords(sessions: PullupSession[]): PersonalRecords {
  if (sessions.length === 0) {
    return { maxDailyTotal: 0, maxSingleSession: 0, maxSingleSet: 0 };
  }

  const dailyStats = getDailyStats(sessions);
  const maxDailyTotal = Math.max(...dailyStats.map(d => d.totalReps), 0);
  const maxSingleSession = Math.max(...sessions.map(s => s.totalReps), 0);
  
  let maxSingleSet = 0;
  sessions.forEach(session => {
    session.sets.forEach(set => {
      maxSingleSet = Math.max(maxSingleSet, set.reps);
    });
  });

  return { maxDailyTotal, maxSingleSession, maxSingleSet };
}

export function getWeeklyAverage(sessions: PullupSession[]): number {
  if (sessions.length === 0) return 0;

  const today = getCurrentPSTDate();
  const todayDate = new Date(today);
  const sevenDaysAgo = new Date(todayDate);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

  const recentSessions = sessions.filter(s => {
    const sessionDate = s.pstDate || getPSTDateFromTimestamp(s.timestamp);
    return sessionDate >= sevenDaysAgoStr && sessionDate <= today;
  });

  const totalReps = recentSessions.reduce((sum, s) => sum + s.totalReps, 0);
  return totalReps / 7;
}

export function getMonthlyTotal(sessions: PullupSession[]): number {
  const today = getCurrentPSTDate();
  const todayDate = new Date(today);
  const thirtyDaysAgo = new Date(todayDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

  const recentSessions = sessions.filter(s => {
    const sessionDate = s.pstDate || getPSTDateFromTimestamp(s.timestamp);
    return sessionDate >= thirtyDaysAgoStr && sessionDate <= today;
  });

  return recentSessions.reduce((sum, s) => sum + s.totalReps, 0);
}

export function getTodayTotal(sessions: PullupSession[]): number {
  const today = getCurrentPSTDate();
  const todaySessions = sessions.filter(s => {
    const sessionDate = s.pstDate || getPSTDateFromTimestamp(s.timestamp);
    return sessionDate === today;
  });
  return todaySessions.reduce((sum, s) => sum + s.totalReps, 0);
}

export function calculateStreak(sessions: PullupSession[]): number {
  return getStreakInfo(sessions).current;
}
