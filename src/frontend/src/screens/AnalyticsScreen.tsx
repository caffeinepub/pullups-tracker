import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { usePullupStore } from '../hooks/usePullupStore';
import { useRankProgress } from '../hooks/useRankProgress';
import { getLifetimeTotal, getStreakInfo, getDailyAverage, getPersonalRecords } from '../lib/stats';
import { calculateFatigueScore, calculateConsistencyScore, FATIGUE_FORMULA, CONSISTENCY_FORMULA } from '../lib/analytics';
import { calculateReadiness } from '../lib/intelligence/readiness';
import MetricCard from '../components/MetricCard';
import RankBadge from '../components/RankBadge';
import PredictedMaxPanel from '../components/PredictedMaxPanel';
import ReadinessMeter from '../components/ReadinessMeter';
import InsightsPanel from '../components/InsightsPanel';
import DisciplineScoreCard from '../components/DisciplineScoreCard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Calendar, Target, Activity, Award, Info, BarChart3 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function AnalyticsScreen() {
  const { sessions } = usePullupStore();
  const { currentRank, nextRank, progress, totalReps } = useRankProgress();
  const navigate = useNavigate();

  const streakInfo = useMemo(() => getStreakInfo(sessions), [sessions]);
  const dailyAvg = useMemo(() => getDailyAverage(sessions), [sessions]);
  const records = useMemo(() => getPersonalRecords(sessions), [sessions]);
  const fatigueScore = useMemo(() => calculateFatigueScore(sessions), [sessions]);
  const consistencyScore = useMemo(() => calculateConsistencyScore(sessions), [sessions]);
  const readiness = useMemo(() => calculateReadiness(sessions), [sessions]);

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold text-app-text-primary">Analytics</h1>

      <div
        className="glass-card border-app-border p-6 rounded-xl"
        style={{
          background: 'radial-gradient(circle, #0d1117 0%, #000000 100%)',
        }}
      >
        <h2 className="text-app-text-primary font-semibold mb-4">Current Rank</h2>
        <div className="flex items-center gap-6">
          <RankBadge rank={currentRank} size={200} />
          <div className="flex-1">
            <div className="text-app-text-secondary text-sm mb-2">
              {nextRank ? `Progress to ${nextRank.name}` : 'Max Rank Achieved'}
            </div>
            <Progress value={progress * 100} className="mb-2" />
            <div className="text-app-text-secondary text-xs">
              {totalReps} / {nextRank?.threshold || totalReps} total reps
            </div>
          </div>
        </div>
      </div>

      <PredictedMaxPanel sessions={sessions} />

      <ReadinessMeter readiness={readiness} />

      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Max Pull-ups"
          value={records.maxDailyTotal}
          icon={<Trophy className="w-4 h-4" />}
          subtitle="Daily record"
        />
        <MetricCard
          title="Current Streak"
          value={`${streakInfo.current} days`}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          title="Longest Streak"
          value={`${streakInfo.longest} days`}
          icon={<Calendar className="w-4 h-4" />}
        />
        <MetricCard
          title="Daily Average"
          value={Math.round(dailyAvg)}
          icon={<Target className="w-4 h-4" />}
        />
      </div>

      <div className="glass-card border-app-border p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-app-text-primary" />
          <h2 className="text-app-text-primary font-semibold">Fatigue Score</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-app-text-secondary" />
              </TooltipTrigger>
              <TooltipContent className="glass-panel border-app-border max-w-xs">
                <p className="text-xs">{FATIGUE_FORMULA}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-app-secondary-accent">{fatigueScore}</div>
          <Progress value={fatigueScore} className="flex-1" />
        </div>
      </div>

      <div className="glass-card border-app-border p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-app-text-primary" />
          <h2 className="text-app-text-primary font-semibold">Consistency Score</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-app-text-secondary" />
              </TooltipTrigger>
              <TooltipContent className="glass-panel border-app-border max-w-xs">
                <p className="text-xs">{CONSISTENCY_FORMULA}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-app-success">{consistencyScore}</div>
          <Progress value={consistencyScore} className="flex-1" />
        </div>
      </div>

      <DisciplineScoreCard sessions={sessions} />

      <InsightsPanel sessions={sessions} />

      <Button
        onClick={() => navigate({ to: '/achievements' })}
        className="w-full bg-gradient-to-r from-app-accent to-app-secondary-accent hover:opacity-90 text-white mb-4"
      >
        <Trophy className="w-4 h-4 mr-2" />
        View Achievements
      </Button>

      <Button
        onClick={() => navigate({ to: '/advanced-stats' })}
        className="w-full bg-app-accent hover:bg-app-accent/90 text-app-bg-primary"
      >
        <BarChart3 className="w-4 h-4 mr-2" />
        View Advanced Statistics
      </Button>
    </div>
  );
}
