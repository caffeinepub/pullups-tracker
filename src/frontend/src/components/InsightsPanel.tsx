import { useMemo } from 'react';
import { generateInsights } from '../lib/intelligence/insights';
import { PullupSession } from '../lib/types';
import { Lightbulb } from 'lucide-react';

interface InsightsPanelProps {
  sessions: PullupSession[];
}

export default function InsightsPanel({ sessions }: InsightsPanelProps) {
  const insights = useMemo(() => generateInsights(sessions), [sessions]);

  return (
    <div className="glass-card border-app-border p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-app-accent" />
        <h2 className="text-app-text-primary font-semibold">Performance Insights</h2>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className="glass-panel border-app-border p-4 rounded-lg"
          >
            <p className="text-app-text-primary text-sm">{insight.message}</p>
            {insight.confidence > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-app-bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-app-accent transition-all duration-500"
                    style={{ width: `${insight.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-app-text-secondary">{insight.confidence}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
