import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { PullupSession, UserSettings } from '../lib/types';
import { offlineDb } from '../lib/offlineDb';

interface PullupStoreContextType {
  sessions: PullupSession[];
  settings: UserSettings;
  coins: number;
  addSession: (session: Omit<PullupSession, 'id' | 'timestamp' | 'totalReps'>) => Promise<void>;
  refreshSessions: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  refreshCoins: () => Promise<void>;
}

const PullupStoreContext = createContext<PullupStoreContextType | undefined>(undefined);

export function PullupStoreProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<PullupSession[]>([]);
  const [settings, setSettings] = useState<UserSettings>({ volume: 0.7, dailyGoal: 50 });
  const [coins, setCoins] = useState<number>(0);
  const [initialized, setInitialized] = useState(false);

  const refreshSessions = useCallback(async () => {
    const allSessions = await offlineDb.getAllSessions();
    setSessions(allSessions.sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  const refreshCoins = useCallback(async () => {
    const currentCoins = await offlineDb.getCoins();
    setCoins(currentCoins);
  }, []);

  useEffect(() => {
    const init = async () => {
      await offlineDb.init();
      await refreshSessions();
      const loadedSettings = await offlineDb.getSettings();
      setSettings(loadedSettings);
      await refreshCoins();
      setInitialized(true);
    };
    init();
  }, [refreshSessions, refreshCoins]);

  const addSession = async (sessionData: Omit<PullupSession, 'id' | 'timestamp' | 'totalReps'>) => {
    const totalReps = sessionData.sets.reduce((sum, set) => sum + set.reps, 0);
    const session: PullupSession = {
      ...sessionData,
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      totalReps,
    };

    await offlineDb.addSession(session);
    await refreshSessions();
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    await offlineDb.saveSettings(updated);
    setSettings(updated);
  };

  if (!initialized) {
    return null;
  }

  return (
    <PullupStoreContext.Provider value={{ sessions, settings, coins, addSession, refreshSessions, updateSettings, refreshCoins }}>
      {children}
    </PullupStoreContext.Provider>
  );
}

export function usePullupStore() {
  const context = useContext(PullupStoreContext);
  if (!context) {
    throw new Error('usePullupStore must be used within PullupStoreProvider');
  }
  return context;
}
