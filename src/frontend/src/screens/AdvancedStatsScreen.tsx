import { useMemo } from 'react';
import { usePullupStore } from '../hooks/usePullupStore';
import { calculateAdvancedStats } from '../lib/intelligence/advancedStats';
import { Activity, TrendingUp, Calendar, Target, Zap, BarChart3 } from 'lucide-react';

export default function AdvancedStatsScreen() {
  const { sessions } = usePullupStore();
  const stats = useMemo(() => calculateAdvancedStats(sessions), [sessions]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold text-app-text-primary">Advanced Statistics</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card border-app-border p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-app-accent" />
            <div className="text-app-text-secondary text-xs">Lifetime Reps</div>
          </div>
          <div className="text-3xl font-bold text-app-accent">{stats.lifetimeReps}</div>
        </div>

        <div className="glass-card border-app-border p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-app-accent" />
            <div className="text-app-text-secondary text-xs">Total Sessions</div>
          </div>
          <div className="text-3xl font-bold text-app-accent">{stats.totalSessions}</div>
        </div>

        <div className="glass-card border-app-border p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-app-accent" />
            <div className="text-app-text-secondary text-xs">Avg Per Session</div>
          </div>
          <div className="text-3xl font-bold text-app-accent">{stats.averageRepsPerSession}</div>
        </div>

        <div className="glass-card border-app-border p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-app-accent" />
            <div className="text-app-text-secondary text-xs">Strength Velocity</div>
          </div>
          <div className="text-3xl font-bold text-app-accent">
            {stats.strengthVelocity > 0 ? '+' : ''}{stats.strengthVelocity}
          </div>
        </div>
      </div>

      <div className="glass-card border-app-border p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-app-accent" />
          <h2 className="text-app-text-primary font-semibold">Most Productive Week</h2>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-app-text-secondary text-sm">Start Date</span>
            <span className="text-app-text-primary font-semibold">{stats.mostProductiveWeek.startDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-app-text-secondary text-sm">Total Reps</span>
            <span className="text-app-accent font-bold text-xl">{stats.mostProductiveWeek.totalReps}</span>
          </div>
        </div>
      </div>

      <div className="glass-card border-app-border p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-app-accent" />
          <h2 className="text-app-text-primary font-semibold">Fastest Improvement</h2>
        </div>
        <div className="space-y-2">
          <div className="text-app-text-secondary text-sm mb-1">Period</div>
          <div className="text-app-text-primary text-xs mb-3">{stats.fastestImprovement.period}</div>
          <div className="flex justify-between items-center">
            <span className="text-app-text-secondary text-sm">Improvement</span>
            <span className="text-app-success font-bold text-xl">+{stats.fastestImprovement.improvement}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
