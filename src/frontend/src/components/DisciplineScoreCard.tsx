import { useMemo } from 'react';
import { calculateDisciplineScore } from '../lib/intelligence/discipline';
import { PullupSession } from '../lib/types';
import RollingCounter from './RollingCounter';
import { Award } from 'lucide-react';

interface DisciplineScoreCardProps {
  sessions: PullupSession[];
}

export default function DisciplineScoreCard({ sessions }: DisciplineScoreCardProps) {
  const discipline = useMemo(() => calculateDisciplineScore(sessions), [sessions]);

  return (
    <div className="glass-card border-app-border p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-app-accent" />
        <h2 className="text-app-text-primary font-semibold">Discipline Score</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-5xl font-bold text-app-accent">
          <RollingCounter value={discipline.percentage} duration={1000} />
          <span className="text-3xl">%</span>
        </div>
        <p className="flex-1 text-app-text-secondary text-sm">
          {discipline.explanation}
        </p>
      </div>
    </div>
  );
}
