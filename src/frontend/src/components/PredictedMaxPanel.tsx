import { useMemo } from 'react';
import { calculateStrengthPrediction } from '../lib/intelligence/adaptiveStrength';
import { PullupSession } from '../lib/types';
import RollingCounter from './RollingCounter';
import { TrendingUp } from 'lucide-react';

interface PredictedMaxPanelProps {
  sessions: PullupSession[];
}

export default function PredictedMaxPanel({ sessions }: PredictedMaxPanelProps) {
  const prediction = useMemo(() => calculateStrengthPrediction(sessions), [sessions]);

  return (
    <div className="glass-card border-app-border p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-app-accent" />
        <h2 className="text-app-text-primary font-semibold">Strength Predictions</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-app-text-secondary text-xs mb-2">7 Days</div>
          <div className="text-3xl font-bold text-app-accent">
            <RollingCounter value={prediction.horizons.sevenDays.predictedMax} />
          </div>
          <div className="text-app-text-secondary text-xs mt-1">
            {prediction.horizons.sevenDays.confidence}% confidence
          </div>
        </div>

        <div className="text-center">
          <div className="text-app-text-secondary text-xs mb-2">30 Days</div>
          <div className="text-3xl font-bold text-app-accent">
            <RollingCounter value={prediction.horizons.thirtyDays.predictedMax} />
          </div>
          <div className="text-app-text-secondary text-xs mt-1">
            {prediction.horizons.thirtyDays.confidence}% confidence
          </div>
        </div>

        <div className="text-center">
          <div className="text-app-text-secondary text-xs mb-2">90 Days</div>
          <div className="text-3xl font-bold text-app-accent">
            <RollingCounter value={prediction.horizons.ninetyDays.predictedMax} />
          </div>
          <div className="text-app-text-secondary text-xs mt-1">
            {prediction.horizons.ninetyDays.confidence}% confidence
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="text-app-text-secondary text-sm">
          Trend: <span className={`font-semibold ${
            prediction.trend === 'improving' ? 'text-app-success' :
            prediction.trend === 'declining' ? 'text-app-destructive' :
            'text-app-text-primary'
          }`}>
            {prediction.trend}
          </span>
        </span>
      </div>
    </div>
  );
}
