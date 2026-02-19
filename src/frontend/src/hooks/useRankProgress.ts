import { useMemo } from 'react';
import { usePullupStore } from './usePullupStore';
import { getLifetimeTotal } from '../lib/stats';
import { getRankByTotalReps, getNextRank, getRankProgress } from '../lib/ranks';
import { RankInfo } from '../lib/types';

export function useRankProgress() {
  const { sessions } = usePullupStore();

  const data = useMemo(() => {
    const totalReps = getLifetimeTotal(sessions);
    const currentRank = getRankByTotalReps(totalReps);
    const nextRank = getNextRank(currentRank);
    const progress = getRankProgress(totalReps);

    return {
      totalReps,
      currentRank,
      nextRank,
      progress,
    };
  }, [sessions]);

  const checkForPromotion = (previousTotal: number, newTotal: number): RankInfo | null => {
    const oldRank = getRankByTotalReps(previousTotal);
    const newRank = getRankByTotalReps(newTotal);
    
    if (newRank.tier > oldRank.tier) {
      return newRank;
    }
    return null;
  };

  return {
    ...data,
    checkForPromotion,
  };
}
