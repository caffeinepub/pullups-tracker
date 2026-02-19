import { ChestOpenRecord } from './chestsTypes';
import { getCurrentPSTDate } from '../pstDate';
import { CardProbability } from './drawTables';

export interface ModifierState {
  streakBonusEnabled: boolean;
  dailyBonusEnabled: boolean;
  currentStreak: number;
  lastOpenDate: string | null; // PST date in yyyy-mm-dd format
}

export function getDefaultModifiers(): ModifierState {
  return {
    streakBonusEnabled: false,
    dailyBonusEnabled: false,
    currentStreak: 0,
    lastOpenDate: null,
  };
}

export function updateModifiersAfterOpen(current: ModifierState): ModifierState {
  const today = getCurrentPSTDate();
  
  if (current.lastOpenDate === today) {
    // Same day, no streak change
    return current;
  }

  // Check if consecutive day
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const newStreak = current.lastOpenDate === yesterdayStr 
    ? current.currentStreak + 1 
    : 1;

  return {
    ...current,
    currentStreak: newStreak,
    lastOpenDate: today,
  };
}

export function checkDailyBonus(state: ModifierState): boolean {
  const today = getCurrentPSTDate();
  return state.dailyBonusEnabled && state.lastOpenDate !== today;
}

export function checkModifierActive(
  modifier: 'streak' | 'daily',
  state: ModifierState,
  chestHistory: ChestOpenRecord[]
): boolean {
  const today = getCurrentPSTDate();

  if (modifier === 'streak') {
    return state.streakBonusEnabled && state.currentStreak >= 3;
  }

  if (modifier === 'daily') {
    if (!state.dailyBonusEnabled) return false;
    
    // Check if already opened today
    const todayOpens = chestHistory.filter(record => record.pstDate === today);
    return todayOpens.length === 0;
  }

  return false;
}

export function applyModifiersToProbabilities(
  baseProbabilities: number[],
  activeModifiers: { streak: boolean; daily: boolean }
): number[] {
  let adjusted = [...baseProbabilities];

  if (activeModifiers.streak) {
    // Shift 10% probability from common to rare
    adjusted[0] -= 0.1;
    adjusted[1] += 0.1;
  }

  if (activeModifiers.daily) {
    // Shift 5% from common to epic
    adjusted[0] -= 0.05;
    adjusted[2] += 0.05;
  }

  return adjusted;
}

export function applyModifiers(
  baseTable: CardProbability[],
  tier: string,
  modifiers: ModifierState
): CardProbability[] {
  // Simple implementation: if modifiers are active, boost higher values
  const hasActiveModifiers = modifiers.streakBonusEnabled || modifiers.dailyBonusEnabled;
  
  if (!hasActiveModifiers) {
    return baseTable;
  }

  // Calculate total probability to normalize
  const totalProb = baseTable.reduce((sum, entry) => sum + entry.probability, 0);

  // Boost probabilities for higher values, reduce for lower values
  const modified = baseTable.map(entry => {
    const isHighValue = entry.value >= 100;
    const boost = isHighValue ? 1.3 : 0.8;
    return {
      ...entry,
      probability: entry.probability * boost,
    };
  });

  // Normalize probabilities to sum to 1
  const newTotal = modified.reduce((sum, entry) => sum + entry.probability, 0);
  return modified.map(entry => ({
    ...entry,
    probability: entry.probability / newTotal,
  }));
}
