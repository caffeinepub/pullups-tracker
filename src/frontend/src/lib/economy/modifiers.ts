// Chest modifier logic for streak and daily bonuses
import { ChestTier, ChestModifiers } from './chestsTypes';
import { CardProbability } from './drawTables';

export interface ModifierState {
  streakBonusEnabled: boolean;
  dailyBonusEnabled: boolean;
  currentStreak: number;
  lastOpenDate: string | null;
}

export function getDefaultModifiers(): ModifierState {
  return {
    streakBonusEnabled: false,
    dailyBonusEnabled: false,
    currentStreak: 0,
    lastOpenDate: null,
  };
}

export function checkDailyBonus(modifiers: ModifierState): boolean {
  if (!modifiers.dailyBonusEnabled) return false;
  
  const today = new Date().toDateString();
  return modifiers.lastOpenDate !== today;
}

export function updateModifiersAfterOpen(modifiers: ModifierState): ModifierState {
  const today = new Date().toDateString();
  const isNewDay = modifiers.lastOpenDate !== today;
  
  return {
    ...modifiers,
    currentStreak: isNewDay ? 1 : modifiers.currentStreak + 1,
    lastOpenDate: today,
  };
}

export function applyModifiers(
  baseTable: CardProbability[],
  tier: ChestTier,
  modifiers: ModifierState
): CardProbability[] {
  if (!modifiers.streakBonusEnabled && !modifiers.dailyBonusEnabled) {
    return baseTable;
  }

  const isDailyBonus = checkDailyBonus(modifiers);
  const streakBonus = modifiers.streakBonusEnabled ? Math.min(modifiers.currentStreak * 0.02, 0.1) : 0;
  const dailyBonus = isDailyBonus ? 0.05 : 0;
  const totalBonus = streakBonus + dailyBonus;

  if (totalBonus === 0) return baseTable;

  // Shift probability toward higher values
  const modified = baseTable.map((entry, index) => {
    const isHighValue = index >= Math.floor(baseTable.length * 0.6);
    const boost = isHighValue ? totalBonus / (baseTable.length * 0.4) : 0;
    const reduction = !isHighValue ? totalBonus / (baseTable.length * 0.6) : 0;
    
    return {
      value: entry.value,
      probability: Math.max(0.01, entry.probability + boost - reduction),
    };
  });

  // Normalize probabilities
  const sum = modified.reduce((acc, e) => acc + e.probability, 0);
  return modified.map(e => ({ ...e, probability: e.probability / sum }));
}
