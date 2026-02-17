export type HapticPattern = 'light' | 'medium' | 'strong' | 'special' | 'chest-open' | 'card-reveal-high';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  strong: 50,
  special: [30, 50, 30, 100],
  'chest-open': [40, 30, 60],
  'card-reveal-high': [20, 40, 20, 80],
};

export function triggerHaptic(pattern: HapticPattern): void {
  if (!navigator.vibrate) return;

  try {
    const vibration = PATTERNS[pattern];
    if (Array.isArray(vibration)) {
      navigator.vibrate(vibration);
    } else {
      navigator.vibrate(vibration);
    }
  } catch (error) {
    console.warn('Haptic feedback not supported:', error);
  }
}
