import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { sfxManager, SfxType } from '../lib/sfx';
import { offlineDb } from '../lib/offlineDb';

interface SfxContextType {
  play: (type: SfxType) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

const SfxContext = createContext<SfxContextType | undefined>(undefined);

export function SfxProvider({ children }: { children: ReactNode }) {
  const [volume, setVolumeState] = useState(0.7);

  useEffect(() => {
    offlineDb.getSettings().then(settings => {
      setVolumeState(settings.volume);
      sfxManager.setVolume(settings.volume);
    });
  }, []);

  const setVolume = async (vol: number) => {
    setVolumeState(vol);
    sfxManager.setVolume(vol);
    
    const settings = await offlineDb.getSettings();
    await offlineDb.saveSettings({ ...settings, volume: vol });
  };

  const play = (type: SfxType) => {
    sfxManager.play(type);
  };

  return (
    <SfxContext.Provider value={{ play, volume, setVolume }}>
      {children}
    </SfxContext.Provider>
  );
}

export function useSfx() {
  const context = useContext(SfxContext);
  if (!context) {
    throw new Error('useSfx must be used within SfxProvider');
  }
  return context;
}
