import { PullupSession } from '../types';
import { getDailyStats } from '../stats';

export interface PerformanceInsight {
  type: 'time-of-day' | 'rest-duration' | 'frequency';
  message: string;
  confidence: number;
}

export function generateInsights(sessions: PullupSession[]): PerformanceInsight[] {
  const insights: PerformanceInsight[] = [];
  
  if (sessions.length < 5) {
    return [
      {
        type: 'time-of-day',
        message: 'Keep training to unlock performance insights',
        confidence: 0,
      },
      {
        type: 'rest-duration',
        message: 'More data needed for rest analysis',
        confidence: 0,
      },
      {
        type: 'frequency',
        message: 'Continue building your training history',
        confidence: 0,
      },
    ];
  }

  const timeOfDayAnalysis = analyzeTimeOfDay(sessions);
  insights.push(timeOfDayAnalysis);
  
  const restDurationAnalysis = analyzeRestDuration(sessions);
  insights.push(restDurationAnalysis);
  
  const frequencyAnalysis = analyzeFrequency(sessions);
  insights.push(frequencyAnalysis);

  return insights;
}

function analyzeTimeOfDay(sessions: PullupSession[]): PerformanceInsight {
  const timeSlots = {
    morning: { total: 0, count: 0, label: 'morning (6-12)' },
    afternoon: { total: 0, count: 0, label: 'afternoon (12-18)' },
    evening: { total: 0, count: 0, label: 'evening (18-24)' },
    night: { total: 0, count: 0, label: 'night (0-6)' },
  };

  sessions.forEach(session => {
    const hour = new Date(session.timestamp).getHours();
    if (hour >= 6 && hour < 12) {
      timeSlots.morning.total += session.totalReps;
      timeSlots.morning.count++;
    } else if (hour >= 12 && hour < 18) {
      timeSlots.afternoon.total += session.totalReps;
      timeSlots.afternoon.count++;
    } else if (hour >= 18 && hour < 24) {
      timeSlots.evening.total += session.totalReps;
      timeSlots.evening.count++;
    } else {
      timeSlots.night.total += session.totalReps;
      timeSlots.night.count++;
    }
  });

  let bestSlot = 'morning';
  let bestAvg = 0;
  let bestCount = 0;

  Object.entries(timeSlots).forEach(([slot, data]) => {
    if (data.count > 0) {
      const avg = data.total / data.count;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestSlot = slot;
        bestCount = data.count;
      }
    }
  });

  const confidence = Math.min(100, (bestCount / sessions.length) * 100);

  return {
    type: 'time-of-day',
    message: `Peak performance in the ${timeSlots[bestSlot as keyof typeof timeSlots].label}`,
    confidence: Math.round(confidence),
  };
}

function analyzeRestDuration(sessions: PullupSession[]): PerformanceInsight {
  if (sessions.length < 3) {
    return {
      type: 'rest-duration',
      message: 'Insufficient data for rest analysis',
      confidence: 0,
    };
  }

  const restPeriods: Array<{ hours: number; performance: number }> = [];

  for (let i = 0; i < sessions.length - 1; i++) {
    const restHours = (sessions[i].timestamp - sessions[i + 1].timestamp) / (1000 * 60 * 60);
    restPeriods.push({
      hours: restHours,
      performance: sessions[i].totalReps,
    });
  }

  const avgPerformance = restPeriods.reduce((sum, p) => sum + p.performance, 0) / restPeriods.length;
  const goodRests = restPeriods.filter(p => p.performance >= avgPerformance);
  const avgGoodRest = goodRests.reduce((sum, p) => sum + p.hours, 0) / goodRests.length;

  let message: string;
  if (avgGoodRest < 24) {
    message = 'Best results with less than 24h rest';
  } else if (avgGoodRest < 48) {
    message = 'Optimal recovery around 24-48 hours';
  } else {
    message = 'Peak performance with 48+ hours rest';
  }

  return {
    type: 'rest-duration',
    message,
    confidence: Math.min(90, goodRests.length * 10),
  };
}

function analyzeFrequency(sessions: PullupSession[]): PerformanceInsight {
  const dailyStats = getDailyStats(sessions);
  
  if (dailyStats.length < 7) {
    return {
      type: 'frequency',
      message: 'Building frequency baseline',
      confidence: 0,
    };
  }

  const last30Days = dailyStats.slice(-30);
  const trainingDays = last30Days.length;
  const frequency = trainingDays / 30;

  let message: string;
  if (frequency >= 0.8) {
    message = 'Elite frequency - training almost daily';
  } else if (frequency >= 0.5) {
    message = 'Strong consistency - 3-4 sessions per week';
  } else if (frequency >= 0.3) {
    message = 'Moderate frequency - consider increasing';
  } else {
    message = 'Low frequency - aim for more sessions';
  }

  return {
    type: 'frequency',
    message,
    confidence: Math.min(95, trainingDays * 3),
  };
}
