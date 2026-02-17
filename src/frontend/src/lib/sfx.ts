export type SfxType = 
  | 'button-click'
  | 'wheel-tick'
  | 'save-chime'
  | 'rank-promotion'
  | 'streak-flame'
  | 'metal-touch'
  | 'pr-bass'
  | 'tick-soft'
  | 'session-quality-elite'
  | 'pressure-low-tone'
  | 'focus-ambient-pulse'
  | 'micro-progress-reinforce'
  | 'chest-common-open'
  | 'chest-rare-open'
  | 'chest-epic-open'
  | 'card-reveal'
  | 'card-reveal-high'
  | 'coin-award';

class SfxManager {
  private sounds: Map<SfxType, HTMLAudioElement> = new Map();
  private volume: number = 0.7;
  private loopingSounds: Set<SfxType> = new Set();

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    const sfxFiles: Record<SfxType, string> = {
      'button-click': '/assets/sfx/button-click.mp3',
      'wheel-tick': '/assets/sfx/wheel-tick.mp3',
      'save-chime': '/assets/sfx/save-chime.mp3',
      'rank-promotion': '/assets/sfx/rank-promotion-impact.mp3',
      'streak-flame': '/assets/sfx/streak-ignition-flame.mp3',
      'metal-touch': '/assets/sfx/metal-touch.mp3',
      'pr-bass': '/assets/sfx/pr-bass-pulse.mp3',
      'tick-soft': '/assets/sfx/tick_soft.wav',
      'session-quality-elite': '/assets/sfx/session-quality-elite.mp3',
      'pressure-low-tone': '/assets/sfx/pressure-low-tone.mp3',
      'focus-ambient-pulse': '/assets/sfx/focus-ambient-pulse.mp3',
      'micro-progress-reinforce': '/assets/sfx/micro-progress-reinforce.mp3',
      'chest-common-open': '/assets/sfx/chest-common-open.mp3',
      'chest-rare-open': '/assets/sfx/chest-rare-open.mp3',
      'chest-epic-open': '/assets/sfx/chest-epic-open.mp3',
      'card-reveal': '/assets/sfx/card-reveal.mp3',
      'card-reveal-high': '/assets/sfx/card-reveal-high.mp3',
      'coin-award': '/assets/sfx/coin-award.mp3',
    };

    Object.entries(sfxFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.volume = this.volume;
      if (key === 'focus-ambient-pulse') {
        audio.loop = true;
      }
      this.sounds.set(key as SfxType, audio);
    });
  }

  play(type: SfxType) {
    try {
      const sound = this.sounds.get(type);
      if (sound) {
        if (!sound.loop) {
          sound.currentTime = 0;
        }
        sound.volume = this.volume;
        sound.play().catch(() => {});
        if (sound.loop) {
          this.loopingSounds.add(type);
        }
      }
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }

  stop(type: SfxType) {
    try {
      const sound = this.sounds.get(type);
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
        this.loopingSounds.delete(type);
      }
    } catch (error) {
      console.warn('Failed to stop sound:', error);
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
  }

  getVolume(): number {
    return this.volume;
  }
}

export const sfxManager = new SfxManager();
