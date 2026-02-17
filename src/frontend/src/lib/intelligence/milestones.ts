import { PullupSession } from '../types';
import { getLifetimeTotal, getStreakInfo } from '../stats';

export interface Milestone {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: number;
  value: number;
}

export function detectMilestones(
  sessions: PullupSession[],
  previousMilestones: Milestone[]
): Milestone[] {
  const newMilestones: Milestone[] = [];
  const existingTypes = new Set(previousMilestones.map(m => m.type));
  
  const lifetimeTotal = getLifetimeTotal(sessions);
  const streakInfo = getStreakInfo(sessions);
  
  if (!existingTypes.has('first-10') && lifetimeTotal >= 10) {
    newMilestones.push({
      id: `milestone-${Date.now()}-first10`,
      type: 'first-10',
      title: 'First 10 Reps',
      description: 'You completed your first 10 pull-ups!',
      timestamp: Date.now(),
      value: 10,
    });
  }
  
  if (!existingTypes.has('first-100') && lifetimeTotal >= 100) {
    newMilestones.push({
      id: `milestone-${Date.now()}-first100`,
      type: 'first-100',
      title: 'Century Club',
      description: 'You reached 100 total pull-ups!',
      timestamp: Date.now(),
      value: 100,
    });
  }
  
  if (!existingTypes.has('first-1000') && lifetimeTotal >= 1000) {
    newMilestones.push({
      id: `milestone-${Date.now()}-first1000`,
      type: 'first-1000',
      title: 'Thousand Strong',
      description: 'You achieved 1,000 total pull-ups!',
      timestamp: Date.now(),
      value: 1000,
    });
  }
  
  if (streakInfo.current >= 7 && !existingTypes.has('streak-7')) {
    newMilestones.push({
      id: `milestone-${Date.now()}-streak7`,
      type: 'streak-7',
      title: 'Week Warrior',
      description: '7-day training streak achieved!',
      timestamp: Date.now(),
      value: 7,
    });
  }
  
  if (streakInfo.current >= 30 && !existingTypes.has('streak-30')) {
    newMilestones.push({
      id: `milestone-${Date.now()}-streak30`,
      type: 'streak-30',
      title: 'Monthly Master',
      description: '30-day training streak achieved!',
      timestamp: Date.now(),
      value: 30,
    });
  }
  
  if (sessions.length >= 2) {
    const latest = sessions[0];
    const previous = sessions[1];
    const improvement = latest.totalReps - previous.totalReps;
    
    if (improvement >= 10 && !existingTypes.has(`improvement-${latest.id}`)) {
      newMilestones.push({
        id: `milestone-${Date.now()}-improvement`,
        type: `improvement-${latest.id}`,
        title: 'Breakthrough',
        description: `Improved by ${improvement} reps in one session!`,
        timestamp: Date.now(),
        value: improvement,
      });
    }
  }

  return newMilestones;
}
