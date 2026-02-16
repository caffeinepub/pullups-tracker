import { useMemo, useEffect, useState } from 'react';
import { usePullupStore } from '../hooks/usePullupStore';
import { useRankProgress } from '../hooks/useRankProgress';
import { getTodayTotal, getStreakInfo } from '../lib/stats';
import { calculateFatigueScore } from '../lib/analytics';
import RollingCounter from '../components/RollingCounter';
import RankBadge from '../components/RankBadge';
import StreakFlame from '../components/StreakFlame';
import FatigueRing from '../components/FatigueRing';
import EnergyOrb from '../components/EnergyOrb';
import { Progress } from '@/components/ui/progress';
import { useSfx } from '../hooks/useSfx';

export default function DashboardScreen() {
  const { sessions, settings } = usePullupStore();
  const { currentRank, nextRank, progress } = useRankProgress();
  const { play } = useSfx();
  const [hasPlayedStreak, setHasPlayedStreak] = useState(false);

  const todayTotal = useMemo(() => getTodayTotal(sessions), [sessions]);
  const streakInfo = useMemo(() => getStreakInfo(sessions), [sessions]);
  const fatigueScore = useMemo(() => calculateFatigueScore(sessions), [sessions]);
  const goalProgress = useMemo(() => {
    return Math.min(todayTotal / settings.dailyGoal, 1);
  }, [todayTotal, settings.dailyGoal]);

  useEffect(() => {
    if (streakInfo.current > 0 && !hasPlayedStreak) {
      play('streak-flame');
      setHasPlayedStreak(true);
    }
  }, [streakInfo.current, hasPlayedStreak, play]);

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-app-text-secondary text-sm uppercase tracking-wider">Today's Total</h1>
        <div className="text-7xl font-bold text-app-accent">
          <RollingCounter value={todayTotal} />
        </div>
        <p className="text-app-text-secondary">pull-ups</p>
      </div>

      <div className="flex justify-center items-center gap-8">
        <div className="text-center">
          <RankBadge rank={currentRank} size="lg" showParticles={progress > 0.9} />
          <div className="mt-4 space-y-2">
            <div className="text-app-text-secondary text-xs">Rank Progress</div>
            <Progress value={progress * 100} className="w-32" />
            {nextRank && (
              <div className="text-app-text-secondary text-xs">
                Next: {nextRank.name}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card border-app-border p-4 rounded-xl text-center">
          <div className="text-app-text-secondary text-xs mb-2">Streak</div>
          <div className="flex justify-center">
            <StreakFlame streak={streakInfo.current} size={50} />
          </div>
        </div>

        <div className="glass-card border-app-border p-4 rounded-xl text-center">
          <div className="text-app-text-secondary text-xs mb-2">Fatigue</div>
          <div className="flex justify-center">
            <FatigueRing score={fatigueScore} size={80} />
          </div>
        </div>

        <div className="glass-card border-app-border p-4 rounded-xl text-center">
          <div className="text-app-text-secondary text-xs mb-2">Goal</div>
          <div className="flex justify-center">
            <EnergyOrb progress={goalProgress} size={80} />
          </div>
        </div>
      </div>

      <div className="glass-card border-app-border p-6 rounded-xl">
        <div className="text-app-text-secondary text-sm mb-2">Daily Goal</div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-app-text-primary">{todayTotal}</span>
          <span className="text-app-text-secondary">/ {settings.dailyGoal}</span>
        </div>
        <Progress value={goalProgress * 100} className="mt-3" />
      </div>
    </div>
  );
}
