import { PullupSession } from '../types';

export interface FatigueLoadMetrics {
  muscularFatigue: number;
  nervousSystemLoad: number;
}

export function calculateFatigueLoad(sessions: PullupSession[]): FatigueLoadMetrics {
  if (sessions.length === 0) {
    return { muscularFatigue: 0, nervousSystemLoad: 0 };
  }

  const now = Date.now();
  const oneDayMs = 86400000;
  
  let muscularFatigue = 0;
  let nervousSystemLoad = 0;

  sessions.forEach(session => {
    const daysAgo = (now - session.timestamp) / oneDayMs;
    if (daysAgo > 14) return;
    
    const sessionIntensity = session.totalReps;
    const isHighIntensity = sessionIntensity > 30;
    
    const muscularDecay = Math.exp(-daysAgo / 2);
    const nsDecay = Math.exp(-daysAgo / 5);
    
    const muscularContribution = sessionIntensity * 0.5 * muscularDecay;
    muscularFatigue += muscularContribution;
    
    const nsMultiplier = isHighIntensity ? 1.5 : 0.8;
    const nsContribution = sessionIntensity * 0.4 * nsMultiplier * nsDecay;
    nervousSystemLoad += nsContribution;
  });

  muscularFatigue = Math.min(100, muscularFatigue);
  nervousSystemLoad = Math.min(100, nervousSystemLoad);

  return {
    muscularFatigue: Math.round(muscularFatigue),
    nervousSystemLoad: Math.round(nervousSystemLoad),
  };
}
