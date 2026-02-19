import { useState, useEffect } from 'react';
import { usePullupStore } from '../hooks/usePullupStore';
import { useRankProgress } from '../hooks/useRankProgress';
import { usePSTSync } from '../hooks/usePSTSync';
import { formatPSTDateForDisplay } from '../lib/pstDate';
import { getLifetimeTotal, getPersonalRecords, getStreakInfo } from '../lib/stats';
import { calculateSessionQuality } from '../lib/intelligence/sessionQuality';
import { detectMilestones } from '../lib/intelligence/milestones';
import { detectMicroProgress } from '../lib/intelligence/microProgress';
import { offlineDb } from '../lib/offlineDb';
import { awardCoins } from '../lib/economy/economyService';
import SessionBuilder from '../components/SessionBuilder';
import TagMultiSelect from '../components/TagMultiSelect';
import RankPromotionOverlay from '../components/RankPromotionOverlay';
import RecordCelebration from '../components/RecordCelebration';
import SessionQualityOverlay from '../components/SessionQualityOverlay';
import MilestoneCelebrationOverlay from '../components/MilestoneCelebrationOverlay';
import MicroProgressCelebration from '../components/MicroProgressCelebration';
import { Button } from '@/components/ui/button';
import { useSfx } from '../hooks/useSfx';
import { triggerHaptic } from '../lib/haptics';
import { RankInfo } from '../lib/types';
import { Milestone } from '../lib/intelligence/milestones';

export default function LogScreen() {
  const { sessions, addSession, refreshCoins } = usePullupStore();
  const { checkForPromotion } = useRankProgress();
  const { currentPSTDate, onDateChange } = usePSTSync();
  const { play } = useSfx();
  
  const [step, setStep] = useState<'builder' | 'tags'>('builder');
  const [sessionData, setSessionData] = useState<any>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [promotedRank, setPromotedRank] = useState<RankInfo | null>(null);
  const [showPRCelebration, setShowPRCelebration] = useState(false);
  const [sessionQuality, setSessionQuality] = useState<number | null>(null);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [microProgressMsg, setMicroProgressMsg] = useState<string | null>(null);
  const [displayDate, setDisplayDate] = useState(formatPSTDateForDisplay(currentPSTDate));
  const [dateKey, setDateKey] = useState(currentPSTDate);

  // Update display date when PST date changes
  useEffect(() => {
    setDisplayDate(formatPSTDateForDisplay(currentPSTDate));
    setDateKey(currentPSTDate);
  }, [currentPSTDate]);

  // Listen for midnight transitions
  useEffect(() => {
    const cleanup = onDateChange((newDate) => {
      // Play soft transition sound
      play('date-transition');
      setDisplayDate(formatPSTDateForDisplay(newDate));
      setDateKey(newDate);
      
      // Refresh sessions to show new day
      window.location.reload();
    });

    return cleanup;
  }, [onDateChange, play]);

  const handleSessionComplete = (sets: any[], duration?: number) => {
    setSessionData({ sets, duration });
    setStep('tags');
  };

  const handleSave = async () => {
    if (!sessionData) return;

    const previousTotal = getLifetimeTotal(sessions);
    const previousRecords = getPersonalRecords(sessions);

    const newSession = {
      sets: sessionData.sets,
      duration: sessionData.duration,
      tags: selectedTags,
      pstDate: currentPSTDate, // Save with current PST date
    };

    await addSession(newSession);

    const allSessions = await offlineDb.getAllSessions();
    const savedSession = allSessions[allSessions.length - 1];

    const qualityResult = calculateSessionQuality(savedSession, sessions);
    await offlineDb.addSessionQuality({
      sessionId: savedSession.id,
      score: qualityResult.score,
      timestamp: savedSession.timestamp,
    });

    const allMilestones = await offlineDb.getAllMilestones();
    const newMilestones = detectMilestones(allSessions, allMilestones);
    for (const milestone of newMilestones) {
      await offlineDb.addMilestone(milestone);
    }

    const microProgress = detectMicroProgress(savedSession, sessions);

    // Check for personal records
    const streakInfo = getStreakInfo(allSessions);
    const newRecords = getPersonalRecords(allSessions);
    const isPR = 
      newRecords.maxDailyTotal > previousRecords.maxDailyTotal ||
      newRecords.maxSingleSession > previousRecords.maxSingleSession ||
      newRecords.maxSingleSet > previousRecords.maxSingleSet;

    // Award coins
    const coinsAwarded = await awardCoins({
      session: savedSession,
      qualityScore: qualityResult.score,
      newMilestones,
      streakBonus: streakInfo.current,
      isPR,
    });

    await refreshCoins();

    // Check for rank promotion
    const newTotal = getLifetimeTotal(allSessions);
    const promotion = checkForPromotion(previousTotal, newTotal);
    if (promotion) {
      setPromotedRank(promotion);
    }

    // Show celebrations
    if (isPR) {
      setShowPRCelebration(true);
    }

    if (qualityResult.score >= 80) {
      setSessionQuality(qualityResult.score);
    }

    if (newMilestones.length > 0) {
      setCurrentMilestone(newMilestones[0]);
    }

    if (microProgress) {
      setMicroProgressMsg(microProgress.message);
    }

    // Reset form
    setStep('builder');
    setSessionData(null);
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Date Display with CSS Animation */}
      <div className="flex justify-center mb-4">
        <div
          key={dateKey}
          className="text-2xl font-bold text-app-accent tracking-wide animate-in fade-in duration-500"
        >
          {displayDate}
        </div>
      </div>

      <h1 className="text-3xl font-bold text-app-text-primary">Log Workout</h1>

      {step === 'builder' && (
        <SessionBuilder onComplete={handleSessionComplete} />
      )}

      {step === 'tags' && (
        <div className="space-y-6">
          <TagMultiSelect
            selected={selectedTags}
            onChange={setSelectedTags}
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setStep('builder');
                setSessionData(null);
                play('button-click');
                triggerHaptic('light');
              }}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={() => {
                handleSave();
                play('button-click');
                triggerHaptic('medium');
              }}
              className="flex-1"
            >
              Save Session
            </Button>
          </div>
        </div>
      )}

      {/* Celebration Overlays */}
      {promotedRank && (
        <RankPromotionOverlay
          rank={promotedRank}
          onComplete={() => setPromotedRank(null)}
        />
      )}

      {showPRCelebration && (
        <RecordCelebration onComplete={() => setShowPRCelebration(false)} />
      )}

      {sessionQuality !== null && (
        <SessionQualityOverlay
          score={sessionQuality}
          onComplete={() => setSessionQuality(null)}
        />
      )}

      {currentMilestone && (
        <MilestoneCelebrationOverlay
          milestone={currentMilestone}
          onComplete={() => setCurrentMilestone(null)}
        />
      )}

      {microProgressMsg && (
        <MicroProgressCelebration
          message={microProgressMsg}
          onComplete={() => setMicroProgressMsg(null)}
        />
      )}
    </div>
  );
}
