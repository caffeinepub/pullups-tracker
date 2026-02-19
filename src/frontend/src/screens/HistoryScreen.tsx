import { useMemo, useState } from 'react';
import { usePullupStore } from '../hooks/usePullupStore';
import { getDailyStats, getWeeklyAverage, getMonthlyTotal, getPersonalRecords } from '../lib/stats';
import { getPastPSTDates, formatPSTDateForDisplay } from '../lib/pstDate';
import HistoryGraph365 from '../components/HistoryGraph365';
import HistoryGraphLifetime from '../components/HistoryGraphLifetime';
import DayDetailsSheet from '../components/DayDetailsSheet';
import { DailyStats } from '../lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function HistoryScreen() {
  const { sessions } = usePullupStore();
  const [selectedDay, setSelectedDay] = useState<DailyStats | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const dailyStats = useMemo(() => {
    const stats = getDailyStats(sessions);
    return stats.slice(-365);
  }, [sessions]);

  const past365Dates = useMemo(() => getPastPSTDates(365), []);

  const weeklyAvg = useMemo(() => getWeeklyAverage(sessions), [sessions]);
  const monthlyTotal = useMemo(() => getMonthlyTotal(sessions), [sessions]);
  const records = useMemo(() => getPersonalRecords(sessions), [sessions]);

  const handleDayClick = (day: DailyStats) => {
    setSelectedDay(day);
    setSheetOpen(true);
  };

  const handleDateSelect = (pstDate: string) => {
    const dayData = dailyStats.find(d => d.date === pstDate);
    if (dayData) {
      setSelectedDay(dayData);
      setSheetOpen(true);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold text-app-text-primary">History</h1>

      {/* Date Timeline */}
      <div className="glass-card border-app-border p-6 rounded-xl">
        <h2 className="text-app-text-secondary text-sm mb-4">Past 365 Days</h2>
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {past365Dates.map(pstDate => {
              const dayData = dailyStats.find(d => d.date === pstDate);
              const hasData = !!dayData;
              const reps = dayData?.totalReps || 0;

              return (
                <button
                  key={pstDate}
                  onClick={() => hasData && handleDateSelect(pstDate)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    hasData
                      ? 'glass-card border-app-border hover:border-app-accent cursor-pointer'
                      : 'bg-app-bg-secondary/20 border border-transparent cursor-default'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={hasData ? 'text-app-text-primary' : 'text-app-text-secondary/50'}>
                      {formatPSTDateForDisplay(pstDate)}
                    </span>
                    {hasData && (
                      <span className="text-app-accent font-bold">{reps} reps</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="glass-card border-app-border p-6 rounded-xl">
        <h2 className="text-app-text-secondary text-sm mb-4">Last 365 Days Graph</h2>
        <HistoryGraph365 data={dailyStats} onDayClick={handleDayClick} />
      </div>

      <div className="glass-card border-app-border p-6 rounded-xl">
        <h2 className="text-app-text-secondary text-sm mb-4">Lifetime Strength Curve</h2>
        <HistoryGraphLifetime sessions={sessions} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card border-app-border p-4 rounded-xl">
          <div className="text-app-text-secondary text-xs mb-1">Weekly Average</div>
          <div className="text-2xl font-bold text-app-accent">{Math.round(weeklyAvg)}</div>
        </div>

        <div className="glass-card border-app-border p-4 rounded-xl">
          <div className="text-app-text-secondary text-xs mb-1">Monthly Total</div>
          <div className="text-2xl font-bold text-app-accent">{monthlyTotal}</div>
        </div>
      </div>

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

      <DayDetailsSheet day={selectedDay} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
