import { useState } from 'react';
import { usePullupStore } from '../hooks/usePullupStore';
import { useRankProgress } from '../hooks/useRankProgress';
import { getLifetimeTotal, getPersonalRecords } from '../lib/stats';
import SessionBuilder from '../components/SessionBuilder';
import TagMultiSelect from '../components/TagMultiSelect';
import RankPromotionOverlay from '../components/RankPromotionOverlay';
import RecordCelebration from '../components/RecordCelebration';
import { Button } from '@/components/ui/button';
import { useSfx } from '../hooks/useSfx';
import { triggerHaptic } from '../lib/haptics';
import { toast } from 'sonner';
import { RankInfo } from '../lib/types';

export default function LogScreen() {
  const { sessions, addSession } = usePullupStore();
  const { checkForPromotion } = useRankProgress();
  const { play } = useSfx();
  
  const [step, setStep] = useState<'builder' | 'tags'>('builder');
  const [sessionData, setSessionData] = useState<any>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [promotedRank, setPromotedRank] = useState<RankInfo | null>(null);
  const [showPRCelebration, setShowPRCelebration] = useState(false);

  const handleSessionComplete = (sets: any[], duration?: number) => {
    setSessionData({ sets, duration });
    setStep('tags');
  };

  const handleSave = async () => {
    if (!sessionData) return;

    const previousTotal = getLifetimeTotal(sessions);
    const previousRecords = getPersonalRecords(sessions);

    await addSession({
      sets: sessionData.sets,
      duration: sessionData.duration,
      tags: selectedTags,
    });

    play('save-chime');
    triggerHaptic('medium');

    const newTotal = previousTotal + sessionData.sets.reduce((sum: number, s: any) => sum + s.reps, 0);
    const promotion = checkForPromotion(previousTotal, newTotal);

    if (promotion) {
      setPromotedRank(promotion);
    }

    const newRecords = getPersonalRecords([...sessions, {
      id: 'temp',
      timestamp: Date.now(),
      sets: sessionData.sets,
      duration: sessionData.duration,
      tags: selectedTags,
      totalReps: sessionData.sets.reduce((sum: number, s: any) => sum + s.reps, 0),
    }]);

    if (newRecords.maxDailyTotal > previousRecords.maxDailyTotal ||
        newRecords.maxSingleSession > previousRecords.maxSingleSession ||
        newRecords.maxSingleSet > previousRecords.maxSingleSet) {
      setShowPRCelebration(true);
    }

    toast.success('Session logged successfully!');
    
    setStep('builder');
    setSessionData(null);
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-app-text-primary mb-8">Log Workout</h1>

      {step === 'builder' && (
        <SessionBuilder onComplete={handleSessionComplete} />
      )}

      {step === 'tags' && (
        <div className="space-y-6">
          <div className="glass-card border-app-border p-6 rounded-xl">
            <h2 className="text-app-text-primary font-semibold mb-4">Add Tags (Optional)</h2>
            <TagMultiSelect selected={selectedTags} onChange={setSelectedTags} />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setStep('builder')}
              variant="outline"
              className="flex-1 border-app-border"
            >
              Back
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-app-accent hover:bg-app-accent/90 text-app-bg-primary"
            >
              Save Session
            </Button>
          </div>
        </div>
      )}

      {promotedRank && (
        <RankPromotionOverlay
          rank={promotedRank}
          onComplete={() => setPromotedRank(null)}
        />
      )}

      {showPRCelebration && (
        <RecordCelebration onComplete={() => setShowPRCelebration(false)} />
      )}
    </div>
  );
}
