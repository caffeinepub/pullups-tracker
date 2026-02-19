import { useMemo } from 'react';
import { usePullupStore } from '../hooks/usePullupStore';
import { useRankProgress } from '../hooks/useRankProgress';
import { getLifetimeTotal, getStreakInfo, getPersonalRecords } from '../lib/stats';
import { calculateReadiness } from '../lib/intelligence/readiness';
import { calculateFatigue } from '../lib/intelligence/fatigue';
import RankBadge from '../components/RankBadge';

export default function AnalyticsScreen() {
  const { sessions } = usePullupStore();
  const { currentRank } = useRankProgress();

  const lifetimeTotal = useMemo(() => getLifetimeTotal(sessions), [sessions]);
  const streakInfo = useMemo(() => getStreakInfo(sessions), [sessions]);
  const records = useMemo(() => getPersonalRecords(sessions), [sessions]);
  const readinessData = useMemo(() => calculateReadiness(sessions), [sessions]);
  const fatigue = useMemo(() => calculateFatigue(sessions), [sessions]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold text-app-text-primary">Analytics</h1>

      {/* Rank Badge */}
      <div className="flex justify-center py-6">
        <RankBadge rank={currentRank} size={100} />
      </div>

      {/* Lifetime Stats */}
      <div className="glass-card border-app-border p-6 rounded-xl">
        <h2 className="text-app-text-primary font-semibold mb-4">Lifetime Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-app-text-secondary text-sm">Total Reps</div>
            <div className="text-3xl font-bold text-app-accent">{lifetimeTotal}</div>
          </div>
          <div>
            <div className="text-app-text-secondary text-sm">Current Streak</div>
            <div className="text-3xl font-bold text-app-accent">{streakInfo.current}</div>
          </div>
        </div>
      </div>

      {/* Personal Records */}
      <div className="glass-card border-app-border p-6 rounded-xl">
        <h2 className="text-app-text-primary font-semibold mb-4">Personal Records</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-app-text-secondary text-sm">Max Daily Total</span>
            <span className="text-app-accent font-bold text-lg">{records.maxDailyTotal}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-app-text-secondary text-sm">Max Single Session</span>
            <span className="text-app-accent font-bold text-lg">{records.maxSingleSession}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-app-text-secondary text-sm">Max Single Set</span>
            <span className="text-app-accent font-bold text-lg">{records.maxSingleSet}</span>
          </div>
        </div>
      </div>

      {/* Readiness & Fatigue */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card border-app-border p-4 rounded-xl">
          <div className="text-app-text-secondary text-xs mb-1">Readiness</div>
          <div className="text-2xl font-bold text-app-accent">{readinessData.score}%</div>
          <div className="text-xs text-app-text-secondary mt-1">{readinessData.status}</div>
        </div>
        <div className="glass-card border-app-border p-4 rounded-xl">
          <div className="text-app-text-secondary text-xs mb-1">Fatigue</div>
          <div className="text-2xl font-bold text-app-accent">{fatigue}%</div>
        </div>
      </div>
    </div>
  );
}
