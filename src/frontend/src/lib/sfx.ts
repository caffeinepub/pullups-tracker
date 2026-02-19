type SfxType =
  | 'button-click'
  | 'nav-transition'
  | 'chest-open-common'
  | 'chest-open-rare'
  | 'chest-open-epic'
  | 'chest-common-open'
  | 'chest-rare-open'
  | 'chest-epic-open'
  | 'card-reveal'
  | 'card-reveal-high'
  | 'celebration'
  | 'rank-promotion'
  | 'record-break'
  | 'micro-progress-reinforce'
  | 'bonus-unlock'
  | 'tick-soft'
  | 'wheel-tick'
  | 'focus-ambient-pulse'
  | 'session-quality-elite'
  | 'pr-bass'
  | 'date-transition'
  | 'save-chime'
  | 'coin-award';

class SfxManager {
  private sounds: Map<SfxType, HTMLAudioElement> = new Map();
  private volume: number = 0.5;

  constructor() {
    this.initSounds();
  }

  private initSounds() {
    const soundFiles: Record<SfxType, string> = {
      'button-click': '/sfx/button-click.mp3',
      'nav-transition': '/sfx/nav-transition.mp3',
      'chest-open-common': '/sfx/chest-open-common.mp3',
      'chest-open-rare': '/sfx/chest-open-rare.mp3',
      'chest-open-epic': '/sfx/chest-open-epic.mp3',
      'chest-common-open': '/sfx/chest-open-common.mp3',
      'chest-rare-open': '/sfx/chest-open-rare.mp3',
      'chest-epic-open': '/sfx/chest-open-epic.mp3',
      'card-reveal': '/sfx/card-reveal.mp3',
      'card-reveal-high': '/sfx/card-reveal.mp3',
      'celebration': '/sfx/celebration.mp3',
      'rank-promotion': '/sfx/rank-promotion.mp3',
      'record-break': '/sfx/record-break.mp3',
      'micro-progress-reinforce': '/sfx/micro-progress-reinforce.mp3',
      'bonus-unlock': '/sfx/bonus-unlock.mp3',
      'tick-soft': '/sfx/tick-soft.mp3',
      'wheel-tick': '/sfx/tick-soft.mp3',
      'focus-ambient-pulse': '/sfx/focus-ambient-pulse.mp3',
      'session-quality-elite': '/sfx/session-quality-elite.mp3',
      'pr-bass': '/sfx/pr-bass.mp3',
      'date-transition': '/sfx/date-transition.mp3',
      'save-chime': '/sfx/celebration.mp3',
      'coin-award': '/sfx/bonus-unlock.mp3',
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.volume = this.volume;
      this.sounds.set(key as SfxType, audio);
    });
  }

  play(type: SfxType) {
    const sound = this.sounds.get(type);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }

  stop(type: SfxType) {
    const sound = this.sounds.get(type);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
  }

  getVolume(): number {
    return this.volume;
  }
}

export const sfxManager = new SfxManager();
export type { SfxType };
