import { usePullupStore } from '../hooks/usePullupStore';
import { useRankProgress } from '../hooks/useRankProgress';
import { getTodayTotal, getStreakInfo } from '../lib/stats';
import { calculateFatigueScore } from '../lib/analytics';
import { calculateReadiness } from '../lib/intelligence/readiness';
import RankBadge from '../components/RankBadge';
import RollingCounter from '../components/RollingCounter';
import CoinBalanceBadge from '../components/coins/CoinBalanceBadge';
import { Flame, Zap, Battery } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardScreen() {
  const { sessions, settings } = usePullupStore();
  const { currentRank } = useRankProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const todayTotal = getTodayTotal(sessions);
  const streakInfo = getStreakInfo(sessions);
  const fatigue = calculateFatigueScore(sessions);
  const readiness = calculateReadiness(sessions);

  const goalProgress = Math.min((todayTotal / settings.dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-radial from-app-bg-secondary/30 to-app-bg-primary"
        style={{ 
          background: 'radial-gradient(circle at 50% 30%, rgba(0, 240, 255, 0.08) 0%, rgba(11, 15, 20, 1) 70%)'
        }}
      />

      <CoinBalanceBadge />

      <div className="relative z-10 p-6 space-y-8">
        <div className={`
          flex flex-col items-center pt-12
          ${mounted ? 'animate-fade-in-up' : 'opacity-0'}
        `}>
          <RankBadge rank={currentRank} size={200} />
        </div>

        <div className={`
          text-center space-y-2
          ${mounted ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'}
        `}>
          <p className="text-app-text-secondary text-sm uppercase tracking-wider">
            Today's Total
          </p>
          <div className="text-6xl font-bold text-app-accent">
            <RollingCounter value={todayTotal} />
          </div>
          <div className="text-app-text-secondary">
            / {settings.dailyGoal} pull-ups
          </div>
          <div className="w-64 mx-auto h-2 bg-app-bg-secondary rounded-full overflow-hidden mt-4">
            <div 
              className="h-full bg-gradient-to-r from-app-accent to-app-secondary-accent transition-all duration-500"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </div>

        <div className={`
          grid grid-cols-3 gap-4 max-w-2xl mx-auto
          ${mounted ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'}
        `}>
          <div className="glass-card border-app-border p-4 rounded-xl text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-app-text-primary">
              {streakInfo.current}
            </div>
            <div className="text-xs text-app-text-secondary">Day Streak</div>
          </div>

          <div className="glass-card border-app-border p-4 rounded-xl text-center">
            <Battery className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-app-text-primary">
              {Math.round(fatigue)}%
            </div>
            <div className="text-xs text-app-text-secondary">Fatigue</div>
          </div>

          <div className="glass-card border-app-border p-4 rounded-xl text-center">
            <Zap className="w-8 h-8 text-app-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-app-text-primary">
              {Math.round(readiness.score)}%
            </div>
            <div className="text-xs text-app-text-secondary">Readiness</div>
          </div>
        </div>
      </div>
    </div>
  );
}
