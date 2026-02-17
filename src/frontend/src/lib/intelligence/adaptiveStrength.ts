import { PullupSession } from '../types';
import { getDailyStats } from '../stats';

export interface PredictionHorizon {
  days: number;
  predictedMax: number;
  confidence: number;
}

export interface StrengthPrediction {
  horizons: {
    sevenDays: PredictionHorizon;
    thirtyDays: PredictionHorizon;
    ninetyDays: PredictionHorizon;
  };
  trend: 'improving' | 'stable' | 'declining';
  momentum: number;
}

export function calculateStrengthPrediction(sessions: PullupSession[]): StrengthPrediction {
  if (sessions.length === 0) {
    return {
      horizons: {
        sevenDays: { days: 7, predictedMax: 0, confidence: 0 },
        thirtyDays: { days: 30, predictedMax: 0, confidence: 0 },
        ninetyDays: { days: 90, predictedMax: 0, confidence: 0 },
      },
      trend: 'stable',
      momentum: 0,
    };
  }

  const dailyStats = getDailyStats(sessions);
  const recentDays = dailyStats.slice(-30);
  
  if (recentDays.length < 3) {
    const currentMax = Math.max(...sessions.map(s => s.totalReps));
    return {
      horizons: {
        sevenDays: { days: 7, predictedMax: currentMax, confidence: 50 },
        thirtyDays: { days: 30, predictedMax: currentMax, confidence: 40 },
        ninetyDays: { days: 90, predictedMax: currentMax, confidence: 30 },
      },
      trend: 'stable',
      momentum: 0,
    };
  }

  const maxValues = recentDays.map(d => d.totalReps);
  const currentMax = Math.max(...maxValues);
  
  const firstHalfMax = Math.max(...maxValues.slice(0, Math.floor(maxValues.length / 2)));
  const secondHalfMax = Math.max(...maxValues.slice(Math.floor(maxValues.length / 2)));
  
  const improvement = secondHalfMax - firstHalfMax;
  const improvementRate = firstHalfMax > 0 ? improvement / firstHalfMax : 0;
  
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (improvementRate > 0.05) trend = 'improving';
  else if (improvementRate < -0.05) trend = 'declining';
  
  const momentum = Math.max(-1, Math.min(1, improvementRate * 10));
  
  const weeklyGrowth = trend === 'improving' ? currentMax * 0.05 : trend === 'declining' ? -currentMax * 0.02 : 0;
  const monthlyGrowth = weeklyGrowth * 4;
  const quarterlyGrowth = weeklyGrowth * 12;
  
  const dataQuality = Math.min(100, (recentDays.length / 30) * 100);
  const trendStrength = Math.abs(improvementRate) * 100;
  
  const sevenDayConfidence = Math.min(95, 60 + dataQuality * 0.2 + trendStrength * 0.15);
  const thirtyDayConfidence = Math.min(85, 50 + dataQuality * 0.15 + trendStrength * 0.1);
  const ninetyDayConfidence = Math.min(70, 40 + dataQuality * 0.1 + trendStrength * 0.05);

  return {
    horizons: {
      sevenDays: {
        days: 7,
        predictedMax: Math.max(0, Math.round(currentMax + weeklyGrowth)),
        confidence: Math.round(sevenDayConfidence),
      },
      thirtyDays: {
        days: 30,
        predictedMax: Math.max(0, Math.round(currentMax + monthlyGrowth)),
        confidence: Math.round(thirtyDayConfidence),
      },
      ninetyDays: {
        days: 90,
        predictedMax: Math.max(0, Math.round(currentMax + quarterlyGrowth)),
        confidence: Math.round(ninetyDayConfidence),
      },
    },
    trend,
    momentum,
  };
}
