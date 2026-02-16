import { DailyStats } from '../lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface DayDetailsSheetProps {
  day: DailyStats | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DayDetailsSheet({ day, open, onOpenChange }: DayDetailsSheetProps) {
  if (!day) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="glass-panel border-app-border">
        <SheetHeader>
          <SheetTitle className="text-app-text-primary">
            {new Date(day.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="glass-card border-app-border p-4 rounded-lg">
            <div className="text-app-text-secondary text-sm">Total Reps</div>
            <div className="text-3xl font-bold text-app-accent">{day.totalReps}</div>
          </div>

          <div className="space-y-2">
            <div className="text-app-text-secondary text-sm font-medium">Sessions</div>
            {day.sessions.map((session, idx) => (
              <div key={session.id} className="glass-card border-app-border p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-app-text-primary font-medium">Session {idx + 1}</span>
                  <span className="text-app-accent font-bold">{session.totalReps} reps</span>
                </div>
                <div className="text-app-text-secondary text-sm">
                  {session.sets.length} sets
                  {session.duration && ` • ${session.duration} min`}
                  {session.sets[0]?.weight && ` • ${session.sets[0].weight} kg`}
                </div>
                {session.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {session.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 rounded bg-app-accent/20 text-app-accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
