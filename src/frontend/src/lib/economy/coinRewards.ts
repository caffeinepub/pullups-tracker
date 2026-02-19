// Coin reward calculation based on session performance
import { PullupSession } from '../types';
import { Milestone } from '../intelligence/milestones';

export interface CoinRewardContext {
  session: PullupSession;
  qualityScore: number;
  newMilestones: Milestone[];
  streakBonus: number;
  isPR: boolean;
}

export function calculateCoinReward(context: CoinRewardContext): number {
  let coins = 0;

  // Base reward for session (1 coin per rep)
  coins += context.session.totalReps;

  // Quality bonus (up to 50% more)
  const qualityBonus = Math.floor(context.session.totalReps * (context.qualityScore / 100) * 0.5);
  coins += qualityBonus;

  // Milestone rewards
  coins += context.newMilestones.length * 100;

  // Streak bonus (10 coins per day)
  coins += context.streakBonus * 10;

  // PR bonus
  if (context.isPR) coins += 150;

  return Math.floor(coins);
}
