import { PullupSession } from '../types';

export interface PressureState {
  isWarning: boolean;
  daysMissed: number;
  intensity: number;
}

export function calculatePressureState(sessions: PullupSession[]): PressureState {
  if (sessions.length === 0) {
    return { isWarning: false, daysMissed: 0, intensity: 0 };
  }

  const now = Date.now();
  const lastSession = sessions[0];
  const daysSinceLastSession = (now - lastSession.timestamp) / (1000 * 60 * 60 * 24);
  
  const isWarning = daysSinceLastSession >= 3;
  const intensity = Math.min(1, Math.max(0, (daysSinceLastSession - 3) / 7));

  return {
    isWarning,
    daysMissed: Math.floor(daysSinceLastSession),
    intensity,
  };
}
