// Service layer for applying coin rewards
import { addCoins } from './economyStore';
import { CoinRewardContext, calculateCoinReward } from './coinRewards';

export interface CoinAwardEvent {
  amount: number;
  timestamp: number;
}

let lastAwardEvent: CoinAwardEvent | null = null;

export async function awardCoins(context: CoinRewardContext): Promise<CoinAwardEvent> {
  const amount = calculateCoinReward(context);
  await addCoins(amount);
  
  const event: CoinAwardEvent = {
    amount,
    timestamp: Date.now(),
  };
  
  lastAwardEvent = event;
  return event;
}

export function getLastAwardEvent(): CoinAwardEvent | null {
  return lastAwardEvent;
}

export function clearLastAwardEvent(): void {
  lastAwardEvent = null;
}
