// Probability tables for chest card draws
import { ChestTier } from './chestsTypes';

export interface CardProbability {
  value: number;
  probability: number;
}

// Base probability tables per chest tier
export const DRAW_TABLES: Record<ChestTier, CardProbability[]> = {
  common: [
    { value: 10, probability: 0.20 },
    { value: 20, probability: 0.30 },
    { value: 30, probability: 0.50 },
  ],
  rare: [
    { value: 20, probability: 0.10 },
    { value: 40, probability: 0.15 },
    { value: 60, probability: 0.20 },
    { value: 80, probability: 0.25 },
    { value: 100, probability: 0.30 },
  ],
  epic: [
    { value: 50, probability: 0.25 },
    { value: 80, probability: 0.30 },
    { value: 100, probability: 0.20 },
    { value: 120, probability: 0.15 },
    { value: 150, probability: 0.05 },
    { value: 180, probability: 0.05 },
  ],
};

// Weighted random draw helper
export function weightedDraw(table: CardProbability[]): number {
  const random = Math.random();
  let cumulative = 0;

  for (const entry of table) {
    cumulative += entry.probability;
    if (random <= cumulative) {
      return entry.value;
    }
  }

  // Fallback to last entry if rounding errors occur
  return table[table.length - 1].value;
}
