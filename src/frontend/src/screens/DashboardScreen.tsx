import { useMemo, useEffect, useState } from 'react';
import { usePullupStore } from '../hooks/usePullupStore';
import { useRankProgress } from '../hooks/useRankProgress';
import { usePSTSync } from '../hooks/usePSTSync';
import { getTodayTotal, getStreakInfo } from '../lib/stats';
import { formatPSTDateForDisplay } from '../lib/pstDate';
import RankBadge from '../components/RankBadge';
import CoinBalanceBadge from '../components/coins/CoinBalanceBadge';
import { Progress } from '@/components/ui/progress';

export default function DashboardScreen() {
  const { sessions, settings } = usePullupStore();
  const { currentRank, nextRank, progress } = useRankProgress();
  const { currentPSTDate } = usePSTSync();
  const [displayDate, setDisplayDate] = useState(formatPSTDateForDisplay(currentPSTDate));

  useEffect(() => {
    setDisplayDate(formatPSTDateForDisplay(currentPSTDate));
  }, [currentPSTDate]);

  const todayTotal = useMemo(() => getTodayTotal(sessions), [sessions, currentPSTDate]);
  const streakInfo = useMemo(() => getStreakInfo(sessions), [sessions]);
  const goalProgress = (todayTotal / settings.dailyGoal) * 100;

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header with Coin Balance */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-app-text-primary">Dashboard</h1>
          <p className="text-app-text-secondary text-sm mt-1">{displayDate}</p>
        </div>
        <CoinBalanceBadge />
      </div>

      {/* Rank Badge */}
      <div className="flex justify-center py-8">
        <RankBadge rank={currentRank} size={120} />
      </div>

      {/* Rank Progress */}
      <div className="glass-card border-app-border p-6 rounded-xl space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-app-text-secondary text-sm">Rank Progress</span>
          <span className="text-app-accent font-bold">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        {nextRank && (
          <p className="text-app-text-secondary text-xs text-center">
            Next: {nextRank.name}
          </p>
        )}
      </div>

      {/* Today's Stats */}
      <div className="glass-card border-app-border p-6 rounded-xl">
        <h2 className="text-app-text-primary font-semibold mb-4">Today</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-app-text-secondary text-sm">Daily Goal</span>
              <span className="text-app-accent font-bold">{todayTotal} / {settings.dailyGoal}</span>
            </div>
            <Progress value={Math.min(goalProgress, 100)} className="h-2" />
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="glass-card border-app-border p-6 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-app-text-secondary text-sm">Current Streak</div>
            <div className="text-3xl font-bold text-app-accent">{streakInfo.current} days</div>
          </div>
          <div className="text-right">
            <div className="text-app-text-secondary text-sm">Longest Streak</div>
            <div className="text-2xl font-bold text-app-text-primary">{streakInfo.longest} days</div>
          </div>
        </div>
      </div>
    </div>
  );
}
