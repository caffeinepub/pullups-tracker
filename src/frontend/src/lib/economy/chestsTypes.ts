// Chest tier definitions and types for the economy system
export type ChestTier = 'common' | 'rare' | 'epic';

export interface ChestDefinition {
  tier: ChestTier;
  cost: number;
  cardCount: number;
  name: string;
  color: string;
  glowColor: string;
}

export interface ChestOpenRecord {
  id: string;
  tier: ChestTier;
  cost: number;
  cards: number[];
  timestamp: number;
  pstDate: string; // yyyy-mm-dd format
}

export interface CardWalletItem {
  id: string;
  value: number;
  tier: ChestTier;
  timestamp: number;
}

export interface ChestModifiers {
  streakBonusEnabled: boolean;
  dailyBonusEnabled: boolean;
  currentStreak: number;
  lastOpenDate: string | null;
}

export const CHEST_DEFINITIONS: Record<ChestTier, ChestDefinition> = {
  common: {
    tier: 'common',
    cost: 5000,
    cardCount: 3,
    name: 'Common Chest',
    color: '#CD7F32',
    glowColor: 'rgba(205, 127, 50, 0.5)',
  },
  rare: {
    tier: 'rare',
    cost: 10000,
    cardCount: 5,
    name: 'Rare Chest',
    color: '#C0C0C0',
    glowColor: 'rgba(192, 192, 192, 0.6)',
  },
  epic: {
    tier: 'epic',
    cost: 20000,
    cardCount: 7,
    name: 'Epic Chest',
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.7)',
  },
};
