export type SfxType = 
  | 'button-click'
  | 'wheel-tick'
  | 'save-chime'
  | 'rank-promotion'
  | 'streak-flame'
  | 'metal-touch'
  | 'pr-bass';

class SfxManager {
  private sounds: Map<SfxType, HTMLAudioElement> = new Map();
  private volume: number = 0.7;

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
    };

    Object.entries(sfxFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.volume = this.volume;
      this.sounds.set(key as SfxType, audio);
    });
  }

  play(type: SfxType) {
    try {
      const sound = this.sounds.get(type);
      if (sound) {
        sound.currentTime = 0;
        sound.volume = this.volume;
        sound.play().catch(() => {});
      }
    } catch (error) {
      console.warn('Failed to play sound:', error);
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
