import { PullupSession } from '../types';
import { getStreakInfo, getDailyStats } from '../stats';

export interface DisciplineScore {
  percentage: number;
  explanation: string;
}

export function calculateDisciplineScore(sessions: PullupSession[]): DisciplineScore {
  if (sessions.length === 0) {
    return {
      percentage: 0,
      explanation: 'Start training to build discipline',
    };
  }

  const streakInfo = getStreakInfo(sessions);
  const dailyStats = getDailyStats(sessions);
  
  const last60Days = dailyStats.filter(d => {
    const dayDate = new Date(d.date).getTime();
    const now = Date.now();
    return now - dayDate <= 60 * 86400000;
  });

  const trainingDays = last60Days.length;
  const consistencyRatio = trainingDays / 60;
  
  const streakStability = Math.min(1, streakInfo.longest / 30);
  
  const missedDaysRecent = 60 - trainingDays;
  const missedPenalty = Math.min(0.3, missedDaysRecent / 60);
  
  const hasRecentActivity = sessions[0] && (Date.now() - sessions[0].timestamp) < 7 * 86400000;
  const recencyBonus = hasRecentActivity ? 0.1 : 0;
  
  const disciplineScore = Math.max(0, Math.min(100,
    (consistencyRatio * 50) +
    (streakStability * 30) +
    (recencyBonus * 10) -
    (missedPenalty * 20) +
    10
  ));

  let explanation: string;
  if (disciplineScore >= 85) {
    explanation = 'Elite discipline - unwavering commitment';
  } else if (disciplineScore >= 70) {
    explanation = 'Strong discipline - consistent training';
  } else if (disciplineScore >= 50) {
    explanation = 'Developing discipline - stay focused';
  } else if (disciplineScore >= 30) {
    explanation = 'Building discipline - increase consistency';
  } else {
    explanation = 'Early stage - establish routine';
  }

  return {
    percentage: Math.round(disciplineScore),
    explanation,
  };
}
