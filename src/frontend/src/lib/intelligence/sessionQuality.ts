import { PullupSession } from '../types';
import { getPersonalRecords } from '../stats';

export interface SessionQualityResult {
  score: number;
  breakdown: {
    consistency: number;
    improvement: number;
    fatigueManagement: number;
  };
}

export function calculateSessionQuality(
  newSession: PullupSession,
  previousSessions: PullupSession[]
): SessionQualityResult {
  const allSessions = [...previousSessions, newSession];
  const records = getPersonalRecords(allSessions);
  const previousRecords = getPersonalRecords(previousSessions);
  
  let consistencyScore = 50;
  if (previousSessions.length > 0) {
    const recentAvg = previousSessions
      .slice(0, 5)
      .reduce((sum, s) => sum + s.totalReps, 0) / Math.min(5, previousSessions.length);
    
    const deviation = Math.abs(newSession.totalReps - recentAvg) / Math.max(1, recentAvg);
    consistencyScore = Math.max(0, Math.min(100, 100 - deviation * 100));
  }
  
  let improvementScore = 50;
  if (newSession.totalReps > previousRecords.maxSingleSession) {
    improvementScore = 100;
  } else if (newSession.totalReps >= previousRecords.maxSingleSession * 0.9) {
    improvementScore = 80;
  } else if (newSession.totalReps >= previousRecords.maxSingleSession * 0.7) {
    improvementScore = 60;
  } else {
    improvementScore = 40;
  }
  
  let fatigueScore = 70;
  const last24h = previousSessions.filter(s => 
    newSession.timestamp - s.timestamp < 86400000
  );
  if (last24h.length > 0) {
    fatigueScore = 50;
  } else if (last24h.length > 1) {
    fatigueScore = 30;
  }
  
  const totalScore = Math.round(
    consistencyScore * 0.3 + improvementScore * 0.5 + fatigueScore * 0.2
  );

  return {
    score: Math.max(0, Math.min(100, totalScore)),
    breakdown: {
      consistency: Math.round(consistencyScore),
      improvement: Math.round(improvementScore),
      fatigueManagement: Math.round(fatigueScore),
    },
  };
}
