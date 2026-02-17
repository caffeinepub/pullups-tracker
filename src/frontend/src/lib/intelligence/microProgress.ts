import { PullupSession } from '../types';

export interface MicroProgressEvent {
  detected: boolean;
  improvement: number;
  message: string;
}

export function detectMicroProgress(
  newSession: PullupSession,
  previousSessions: PullupSession[]
): MicroProgressEvent {
  if (previousSessions.length === 0) {
    return {
      detected: true,
      improvement: newSession.totalReps,
      message: 'First session logged!',
    };
  }

  const recentSessions = previousSessions.slice(0, 5);
  const recentAvg = recentSessions.reduce((sum, s) => sum + s.totalReps, 0) / recentSessions.length;
  const previousBest = Math.max(...previousSessions.map(s => s.totalReps));
  
  const improvement = newSession.totalReps - recentAvg;
  
  if (newSession.totalReps > previousBest) {
    return {
      detected: true,
      improvement: newSession.totalReps - previousBest,
      message: 'New personal record!',
    };
  }
  
  if (improvement >= 1) {
    return {
      detected: true,
      improvement: Math.round(improvement),
      message: `+${Math.round(improvement)} above average`,
    };
  }

  return {
    detected: false,
    improvement: 0,
    message: '',
  };
}
