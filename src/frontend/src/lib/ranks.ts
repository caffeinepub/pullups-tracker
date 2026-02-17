import { RankInfo } from './types';

export const RANKS: RankInfo[] = [
  { tier: 0, name: 'Bronze III', color: '#ff8c42', auraColor: '#ffb37a', metalTexture: '/assets/generated/metal-bronze.dim_1024x1024.png', threshold: 0 },
  { tier: 1, name: 'Bronze II', color: '#ff8c42', auraColor: '#ffb37a', metalTexture: '/assets/generated/metal-bronze.dim_1024x1024.png', threshold: 100 },
  { tier: 2, name: 'Bronze I', color: '#ff8c42', auraColor: '#ffb37a', metalTexture: '/assets/generated/metal-bronze.dim_1024x1024.png', threshold: 250 },
  { tier: 3, name: 'Silver III', color: '#cfd8dc', auraColor: '#ffffff', metalTexture: '/assets/generated/metal-silver.dim_1024x1024.png', threshold: 500 },
  { tier: 4, name: 'Silver II', color: '#cfd8dc', auraColor: '#ffffff', metalTexture: '/assets/generated/metal-silver.dim_1024x1024.png', threshold: 750 },
  { tier: 5, name: 'Silver I', color: '#cfd8dc', auraColor: '#ffffff', metalTexture: '/assets/generated/metal-silver.dim_1024x1024.png', threshold: 1000 },
  { tier: 6, name: 'Gold III', color: '#ffd700', auraColor: '#fff3b0', metalTexture: '/assets/generated/metal-gold.dim_1024x1024.png', threshold: 1500 },
  { tier: 7, name: 'Gold II', color: '#ffd700', auraColor: '#fff3b0', metalTexture: '/assets/generated/metal-gold.dim_1024x1024.png', threshold: 2000 },
  { tier: 8, name: 'Gold I', color: '#ffd700', auraColor: '#fff3b0', metalTexture: '/assets/generated/metal-gold.dim_1024x1024.png', threshold: 2500 },
  { tier: 9, name: 'Platinum III', color: '#00e5ff', auraColor: '#6ff9ff', metalTexture: '/assets/generated/metal-platinum.dim_1024x1024.png', threshold: 3500 },
  { tier: 10, name: 'Platinum II', color: '#00e5ff', auraColor: '#6ff9ff', metalTexture: '/assets/generated/metal-platinum.dim_1024x1024.png', threshold: 4500 },
  { tier: 11, name: 'Platinum I', color: '#00e5ff', auraColor: '#6ff9ff', metalTexture: '/assets/generated/metal-platinum.dim_1024x1024.png', threshold: 6000 },
  { tier: 12, name: 'Diamond III', color: '#7c4dff', auraColor: '#b388ff', metalTexture: '/assets/generated/metal-diamond.dim_1024x1024.png', threshold: 8000 },
  { tier: 13, name: 'Diamond II', color: '#7c4dff', auraColor: '#b388ff', metalTexture: '/assets/generated/metal-diamond.dim_1024x1024.png', threshold: 10000 },
  { tier: 14, name: 'Diamond I', color: '#7c4dff', auraColor: '#b388ff', metalTexture: '/assets/generated/metal-diamond.dim_1024x1024.png', threshold: 13000 },
  { tier: 15, name: 'Elite', color: '#00ff95', auraColor: '#7dffc1', metalTexture: '/assets/generated/metal-elite.dim_1024x1024.png', threshold: 17000 },
  { tier: 16, name: 'Ascendant', color: '#00ff95', auraColor: '#7dffc1', metalTexture: '/assets/generated/metal-ascendant.dim_1024x1024.png', threshold: 25000 },
];

export function getRankByTotalReps(totalReps: number): RankInfo {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalReps >= RANKS[i].threshold) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

export function getNextRank(currentRank: RankInfo): RankInfo | null {
  const currentIndex = RANKS.findIndex(r => r.tier === currentRank.tier);
  if (currentIndex < RANKS.length - 1) {
    return RANKS[currentIndex + 1];
  }
  return null;
}

export function getRankProgress(totalReps: number): number {
  const currentRank = getRankByTotalReps(totalReps);
  const nextRank = getNextRank(currentRank);
  
  if (!nextRank) return 1;
  
  const progress = (totalReps - currentRank.threshold) / (nextRank.threshold - currentRank.threshold);
  return Math.min(Math.max(progress, 0), 1);
}
