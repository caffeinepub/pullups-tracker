import { PullupSession } from '../types';
import { getStreakInfo, getDailyStats } from '../stats';
import { calculateFatigueScore } from '../analytics';

export type ReadinessStatus = 'Peak' | 'Ready' | 'Moderate' | 'Fatigued' | 'Critical';

export interface ReadinessScore {
  score: number;
  status: ReadinessStatus;
  recommendation: string;
}

export function calculateReadiness(sessions: PullupSession[]): ReadinessScore {
  if (sessions.length === 0) {
    return {
      score: 100,
      status: 'Peak',
      recommendation: 'Start your training journey',
    };
  }

  const now = Date.now();
  const oneDayMs = 86400000;
  const lastSession = sessions[0];
  const hoursSinceLastSession = (now - lastSession.timestamp) / (1000 * 60 * 60);
  
  const streakInfo = getStreakInfo(sessions);
  const fatigueScore = calculateFatigueScore(sessions);
  
  const last7Days = sessions.filter(s => s.timestamp >= now - 7 * oneDayMs);
  const recentIntensity = last7Days.reduce((sum, s) => sum + s.totalReps, 0) / 7;
  
  let recoveryScore = 100;
  if (hoursSinceLastSession < 24) {
    recoveryScore = Math.min(100, (hoursSinceLastSession / 24) * 100);
  }
  
  const streakBonus = Math.min(20, streakInfo.current * 2);
  const fatiguePenalty = fatigueScore * 0.5;
  const intensityPenalty = recentIntensity > 50 ? (recentIntensity - 50) * 0.3 : 0;
  
  const readinessScore = Math.max(0, Math.min(100,
    recoveryScore + streakBonus - fatiguePenalty - intensityPenalty
  ));

  let status: ReadinessStatus;
  let recommendation: string;

  if (readinessScore >= 85) {
    status = 'Peak';
    recommendation = 'Train heavy - push for new records';
  } else if (readinessScore >= 70) {
    status = 'Ready';
    recommendation = 'Train normally - maintain intensity';
  } else if (readinessScore >= 50) {
    status = 'Moderate';
    recommendation = 'Train light - focus on technique';
  } else if (readinessScore >= 30) {
    status = 'Fatigued';
    recommendation = 'Active recovery - low volume only';
  } else {
    status = 'Critical';
    recommendation = 'Rest - allow full recovery';
  }

  return {
    score: Math.round(readinessScore),
    status,
    recommendation,
  };
}
