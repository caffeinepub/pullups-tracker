import { useState } from 'react';
import { usePullupStore } from '../hooks/usePullupStore';
import { useRankProgress } from '../hooks/useRankProgress';
import { getLifetimeTotal, getPersonalRecords, getStreakInfo } from '../lib/stats';
import { calculateSessionQuality } from '../lib/intelligence/sessionQuality';
import { detectMilestones } from '../lib/intelligence/milestones';
import { detectMicroProgress } from '../lib/intelligence/microProgress';
import { calculateFatigueScore } from '../lib/analytics';
import { calculateReadiness } from '../lib/intelligence/readiness';
import { offlineDb } from '../lib/offlineDb';
import { checkAndUnlockAchievements, getAchievementById } from '../lib/achievements/service';
import { useAchievementUnlock } from '../components/achievements/AchievementUnlockProvider';
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
  const { play } = useSfx();
  const { showAchievement } = useAchievementUnlock();
  
  const [step, setStep] = useState<'builder' | 'tags'>('builder');
  const [sessionData, setSessionData] = useState<any>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [promotedRank, setPromotedRank] = useState<RankInfo | null>(null);
  const [showPRCelebration, setShowPRCelebration] = useState(false);
  const [sessionQuality, setSessionQuality] = useState<number | null>(null);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [microProgressMsg, setMicroProgressMsg] = useState<string | null>(null);

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
    };

    await addSession(newSession);

    const allSessions = await offlineDb.getAllSessions();
    const savedSession = allSessions[0];

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

    // Check achievements
    const streakInfo = getStreakInfo(allSessions);
    const newRecords = getPersonalRecords(allSessions);
    const qualityRecords = await offlineDb.getAllQualityRecords();
    const fatigue = calculateFatigueScore(allSessions);
    const readinessResult = calculateReadiness(allSessions);

    const achievementContext = {
      totalReps: getLifetimeTotal(allSessions),
      sessions: allSessions,
      currentStreak: streakInfo.current,
      longestStreak: streakInfo.longest,
      maxDailyTotal: newRecords.maxDailyTotal,
      maxSingleSession: newRecords.maxSingleSession,
      maxSingleSet: newRecords.maxSingleSet,
      qualityRecords,
      milestones: allMilestones,
      fatigue,
      readiness: readinessResult.score,
    };

    const newUnlocks = await checkAndUnlockAchievements(achievementContext);

    // Award coins
    const isPR = newRecords.maxDailyTotal > previousRecords.maxDailyTotal ||
                 newRecords.maxSingleSession > previousRecords.maxSingleSession ||
                 newRecords.maxSingleSet > previousRecords.maxSingleSet;

    await awardCoins({
      session: savedSession,
      qualityScore: qualityResult.score,
      newMilestones,
      newAchievements: newUnlocks,
      streakBonus: streakInfo.current,
      isPR,
    });

    await refreshCoins();

    play('save-chime');
    triggerHaptic('medium');

    const newTotal = previousTotal + sessionData.sets.reduce((sum: number, s: any) => sum + s.reps, 0);
    const promotion = checkForPromotion(previousTotal, newTotal);

    if (promotion) {
      setPromotedRank(promotion);
    }

    if (newRecords.maxDailyTotal > previousRecords.maxDailyTotal ||
        newRecords.maxSingleSession > previousRecords.maxSingleSession ||
        newRecords.maxSingleSet > previousRecords.maxSingleSet) {
      setShowPRCelebration(true);
    }

    if (qualityResult.score >= 80) {
      setSessionQuality(qualityResult.score);
    }

    if (newMilestones.length > 0) {
      setCurrentMilestone(newMilestones[0]);
    }

    if (microProgress.detected) {
      setMicroProgressMsg(microProgress.message);
    }

    for (const unlock of newUnlocks) {
      const achievement = getAchievementById(unlock.achievementId);
      if (achievement) {
        showAchievement(achievement);
      }
    }

    setStep('builder');
    setSessionData(null);
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen p-6">
      {step === 'builder' && (
        <SessionBuilder onComplete={handleSessionComplete} />
      )}

      {step === 'tags' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-app-text-primary">Add Tags (Optional)</h2>
          <TagMultiSelect
            selected={selectedTags}
            onChange={setSelectedTags}
          />
          <div className="flex gap-3">
            <Button
              onClick={() => setStep('builder')}
              variant="outline"
              className="flex-1"
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
