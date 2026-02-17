import { AchievementDefinition } from './types';

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Pull-up count achievements (1-6)
  {
    id: 'first-pullup',
    name: 'First Pull-up',
    description: 'Complete your very first pull-up',
    difficulty: 'easy',
    icon: 'bar-single',
    checkUnlock: (ctx) => ctx.totalReps >= 1,
  },
  {
    id: '5-pullups',
    name: '5 Pull-ups',
    description: 'Reach 5 total pull-ups',
    difficulty: 'easy',
    icon: 'bars-five',
    checkUnlock: (ctx) => ctx.totalReps >= 5,
  },
  {
    id: '10-pullups',
    name: '10 Pull-ups',
    description: 'Reach 10 total pull-ups',
    difficulty: 'easy',
    icon: 'bars-ten',
    checkUnlock: (ctx) => ctx.totalReps >= 10,
  },
  {
    id: '20-pullups',
    name: '20 Pull-ups',
    description: 'Reach 20 total pull-ups',
    difficulty: 'easy',
    icon: 'bars-twenty',
    checkUnlock: (ctx) => ctx.totalReps >= 20,
  },
  {
    id: '50-pullups',
    name: '50 Pull-ups',
    description: 'Reach 50 total pull-ups',
    difficulty: 'easy',
    icon: 'bars-stacked',
    checkUnlock: (ctx) => ctx.totalReps >= 50,
  },
  {
    id: '100-pullups',
    name: 'Century Club',
    description: 'Reach 100 total pull-ups',
    difficulty: 'medium',
    icon: 'trophy-silver',
    checkUnlock: (ctx) => ctx.totalReps >= 100,
  },

  // Session logging achievements (7-8)
  {
    id: 'first-set',
    name: 'First Set',
    description: 'Log your first set',
    difficulty: 'easy',
    icon: 'clipboard',
    checkUnlock: (ctx) => ctx.sessions.length >= 1,
  },
  {
    id: 'first-session',
    name: 'First Session',
    description: 'Complete your first training session',
    difficulty: 'easy',
    icon: 'stopwatch',
    checkUnlock: (ctx) => ctx.sessions.length >= 1,
  },

  // Streak achievements (9-15)
  {
    id: '7-day-streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day training streak',
    difficulty: 'medium',
    icon: 'flame',
    checkUnlock: (ctx) => ctx.currentStreak >= 7,
  },
  {
    id: '14-day-streak',
    name: 'Fortnight Fighter',
    description: 'Maintain a 14-day training streak',
    difficulty: 'medium',
    icon: 'flame-large',
    checkUnlock: (ctx) => ctx.currentStreak >= 14,
  },
  {
    id: '21-day-streak',
    name: 'Triple Week',
    description: 'Maintain a 21-day training streak',
    difficulty: 'medium',
    icon: 'flame-triple',
    checkUnlock: (ctx) => ctx.currentStreak >= 21,
  },
  {
    id: '30-day-streak',
    name: 'Monthly Master',
    description: 'Maintain a 30-day training streak',
    difficulty: 'hard',
    icon: 'flame-wreath',
    checkUnlock: (ctx) => ctx.currentStreak >= 30,
  },
  {
    id: '50-day-streak',
    name: 'Unstoppable',
    description: 'Maintain a 50-day training streak',
    difficulty: 'hard',
    icon: 'flame-rotating',
    checkUnlock: (ctx) => ctx.currentStreak >= 50,
  },
  {
    id: '60-day-streak',
    name: 'Golden Flame',
    description: 'Maintain a 60-day training streak',
    difficulty: 'hard',
    icon: 'flame-gold',
    checkUnlock: (ctx) => ctx.currentStreak >= 60,
  },
  {
    id: '90-day-streak',
    name: 'Elite Flame',
    description: 'Maintain a 90-day training streak',
    difficulty: 'legendary',
    icon: 'flame-elite',
    checkUnlock: (ctx) => ctx.currentStreak >= 90,
  },

  // Single set achievements (16-20)
  {
    id: '5-reps-set',
    name: 'Strong Start',
    description: 'Complete 5 reps in a single set',
    difficulty: 'easy',
    icon: 'fist-small',
    checkUnlock: (ctx) => ctx.maxSingleSet >= 5,
  },
  {
    id: '10-reps-set',
    name: 'Power Set',
    description: 'Complete 10 reps in a single set',
    difficulty: 'medium',
    icon: 'fist-clenched',
    checkUnlock: (ctx) => ctx.maxSingleSet >= 10,
  },
  {
    id: '20-reps-set',
    name: 'Beast Mode',
    description: 'Complete 20 reps in a single set',
    difficulty: 'hard',
    icon: 'fist-glowing',
    checkUnlock: (ctx) => ctx.maxSingleSet >= 20,
  },
  {
    id: '50-reps-set',
    name: 'Superhuman',
    description: 'Complete 50 reps in a single set',
    difficulty: 'legendary',
    icon: 'fist-radiant',
    checkUnlock: (ctx) => ctx.maxSingleSet >= 50,
  },
  {
    id: '100-total-reps',
    name: 'Hundred Hero',
    description: 'Complete 100 total reps across all sessions',
    difficulty: 'medium',
    icon: 'fist-pedestal',
    checkUnlock: (ctx) => ctx.totalReps >= 100,
  },

  // Session quality achievements (21-23)
  {
    id: 'max-session',
    name: 'Session Champion',
    description: 'Achieve your highest rep count in a session',
    difficulty: 'medium',
    icon: 'starburst',
    checkUnlock: (ctx) => ctx.maxSingleSession >= 30,
  },
  {
    id: 'quality-80',
    name: 'Quality Training',
    description: 'Achieve 80+ session quality score',
    difficulty: 'medium',
    icon: 'speedometer',
    checkUnlock: (ctx) => ctx.qualityRecords.some(q => q.score >= 80),
  },
  {
    id: 'quality-90',
    name: 'Elite Performance',
    description: 'Achieve 90+ session quality score',
    difficulty: 'hard',
    icon: 'speedometer-glow',
    checkUnlock: (ctx) => ctx.qualityRecords.some(q => q.score >= 90),
  },

  // Personal records (24-25)
  {
    id: 'first-pr',
    name: 'Personal Best',
    description: 'Set your first personal record',
    difficulty: 'easy',
    icon: 'medal',
    checkUnlock: (ctx) => ctx.maxSingleSession > 0,
  },
  {
    id: '3-prs',
    name: 'Record Breaker',
    description: 'Set 3 personal records',
    difficulty: 'medium',
    icon: 'medal-triple',
    checkUnlock: (ctx) => ctx.sessions.length >= 3 && ctx.maxSingleSession >= 15,
  },

  // Fatigue management (26-27)
  {
    id: 'fatigue-30',
    name: 'Well Rested',
    description: 'Maintain fatigue under 30%',
    difficulty: 'medium',
    icon: 'heart',
    checkUnlock: (ctx) => (ctx.fatigue || 100) < 30,
  },
  {
    id: 'fatigue-20',
    name: 'Peak Recovery',
    description: 'Maintain fatigue under 20%',
    difficulty: 'hard',
    icon: 'heart-glow',
    checkUnlock: (ctx) => (ctx.fatigue || 100) < 20,
  },

  // Orb energy (28-30)
  {
    id: 'orb-100',
    name: 'Energy Surge',
    description: 'Fill orb to 100%',
    difficulty: 'medium',
    icon: 'orb',
    checkUnlock: (ctx) => (ctx.orbEnergy || 0) >= 100,
  },
  {
    id: 'orb-200',
    name: 'Double Power',
    description: 'Fill orb to 200%',
    difficulty: 'hard',
    icon: 'orb-double',
    checkUnlock: (ctx) => (ctx.orbEnergy || 0) >= 200,
  },
  {
    id: 'orb-300',
    name: 'Maximum Energy',
    description: 'Fill orb to 300%',
    difficulty: 'legendary',
    icon: 'orb-radiant',
    checkUnlock: (ctx) => (ctx.orbEnergy || 0) >= 300,
  },

  // Consistency (31-33)
  {
    id: 'daily-100',
    name: 'Daily Dedication',
    description: 'Achieve 100% daily consistency',
    difficulty: 'medium',
    icon: 'shield-check',
    checkUnlock: (ctx) => ctx.currentStreak >= 1,
  },
  {
    id: 'weekly-100',
    name: 'Weekly Warrior',
    description: 'Achieve 100% weekly consistency',
    difficulty: 'hard',
    icon: 'shield-wreath',
    checkUnlock: (ctx) => ctx.currentStreak >= 7,
  },
  {
    id: 'monthly-100',
    name: 'Monthly Legend',
    description: 'Achieve 100% monthly consistency',
    difficulty: 'legendary',
    icon: 'shield-gold',
    checkUnlock: (ctx) => ctx.currentStreak >= 30,
  },

  // Prediction accuracy (34-35)
  {
    id: 'prediction-5',
    name: 'Good Estimate',
    description: 'Prediction accurate within 5%',
    difficulty: 'medium',
    icon: 'target',
    checkUnlock: (ctx) => ctx.sessions.length >= 5,
  },
  {
    id: 'prediction-2',
    name: 'Perfect Prediction',
    description: 'Prediction accurate within 2%',
    difficulty: 'hard',
    icon: 'target-glow',
    checkUnlock: (ctx) => ctx.sessions.length >= 10,
  },

  // Readiness (36-37)
  {
    id: 'readiness-peak',
    name: 'Peak Readiness',
    description: 'Achieve peak readiness score',
    difficulty: 'medium',
    icon: 'sun',
    checkUnlock: (ctx) => (ctx.readiness || 0) >= 80,
  },
  {
    id: 'readiness-critical',
    name: 'Critical State',
    description: 'Train despite critical readiness',
    difficulty: 'hard',
    icon: 'warning',
    checkUnlock: (ctx) => ctx.sessions.length >= 3,
  },

  // Focus and psychology (38)
  {
    id: 'elite-focus',
    name: 'Elite Focus',
    description: 'Complete session in elite focus mode',
    difficulty: 'hard',
    icon: 'eye',
    checkUnlock: (ctx) => ctx.sessions.some(s => s.tags?.includes('focus')),
  },

  // Plateau (39-40)
  {
    id: 'plateau-detected',
    name: 'Plateau Awareness',
    description: 'Detect your first plateau',
    difficulty: 'medium',
    icon: 'mountain',
    checkUnlock: (ctx) => ctx.sessions.length >= 10,
  },
  {
    id: 'plateau-escape',
    name: 'Breakthrough',
    description: 'Escape a training plateau',
    difficulty: 'hard',
    icon: 'flag-peak',
    checkUnlock: (ctx) => ctx.milestones.some(m => m.type.includes('improvement')),
  },

  // Strength velocity (41-42)
  {
    id: 'velocity-50',
    name: 'Rapid Progress',
    description: '50% strength velocity increase',
    difficulty: 'hard',
    icon: 'arrow-up',
    checkUnlock: (ctx) => ctx.sessions.length >= 5 && ctx.maxSingleSession >= 20,
  },
  {
    id: 'velocity-100',
    name: 'Explosive Growth',
    description: '100% strength velocity increase',
    difficulty: 'legendary',
    icon: 'arrow-double',
    checkUnlock: (ctx) => ctx.sessions.length >= 10 && ctx.maxSingleSession >= 40,
  },

  // Rare milestones (43-46)
  {
    id: 'rare-milestone',
    name: 'Rare Achievement',
    description: 'Unlock your first rare milestone',
    difficulty: 'hard',
    icon: 'diamond',
    checkUnlock: (ctx) => ctx.milestones.length >= 1,
  },
  {
    id: 'legendary-milestone',
    name: 'Legendary Status',
    description: 'Unlock your first legendary milestone',
    difficulty: 'legendary',
    icon: 'crown',
    checkUnlock: (ctx) => ctx.totalReps >= 1000,
  },
  {
    id: '3-rare-milestones',
    name: 'Triple Rare',
    description: 'Unlock 3 rare milestones',
    difficulty: 'legendary',
    icon: 'diamond-triple',
    checkUnlock: (ctx) => ctx.milestones.length >= 3,
  },
  {
    id: '3-legendary-milestones',
    name: 'Triple Crown',
    description: 'Unlock 3 legendary milestones',
    difficulty: 'legendary',
    icon: 'crown-triple',
    checkUnlock: (ctx) => ctx.milestones.length >= 5,
  },

  // Micro progress (47-49)
  {
    id: 'micro-1',
    name: 'Small Step',
    description: 'Achieve +1 rep micro progress',
    difficulty: 'easy',
    icon: 'spark',
    checkUnlock: (ctx) => ctx.sessions.length >= 2,
  },
  {
    id: 'micro-5',
    name: 'Steady Growth',
    description: 'Achieve +5 reps micro progress',
    difficulty: 'medium',
    icon: 'spark-cluster',
    checkUnlock: (ctx) => ctx.sessions.length >= 3,
  },
  {
    id: 'micro-10',
    name: 'Consistent Gains',
    description: 'Achieve 10 micro progress events',
    difficulty: 'hard',
    icon: 'spark-glow',
    checkUnlock: (ctx) => ctx.sessions.length >= 10,
  },

  // Ultimate achievement (50)
  {
    id: 'month-perfect',
    name: 'Perfect Month',
    description: 'Complete first month without missing a day',
    difficulty: 'legendary',
    icon: 'calendar',
    checkUnlock: (ctx) => ctx.currentStreak >= 30,
  },
];
