import { PullupSession } from '../types';

export function calculateFatigue(sessions: PullupSession[]): number {
  if (sessions.length === 0) return 0;

  const now = Date.now();
  const oneDayMs = 86400000;
  const last7Days = sessions.filter(s => s.timestamp >= now - 7 * oneDayMs);
  
  if (last7Days.length === 0) return 0;

  // Calculate total volume in last 7 days
  const totalReps = last7Days.reduce((sum, s) => sum + s.totalReps, 0);
  const avgRepsPerDay = totalReps / 7;

  // Calculate session frequency
  const sessionCount = last7Days.length;
  const avgSessionsPerDay = sessionCount / 7;

  // Fatigue increases with high volume and frequency
  const volumeFatigue = Math.min(50, avgRepsPerDay * 0.5);
  const frequencyFatigue = Math.min(30, avgSessionsPerDay * 15);

  // Check for insufficient rest
  const lastSession = sessions[0];
  const hoursSinceLastSession = (now - lastSession.timestamp) / (1000 * 60 * 60);
  const restFatigue = hoursSinceLastSession < 24 ? 20 : 0;

  const totalFatigue = volumeFatigue + frequencyFatigue + restFatigue;
  return Math.min(100, Math.round(totalFatigue));
}
