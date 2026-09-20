import { Haptics, ImpactStyle } from '@capacitor/haptics';

let lastHapticTime = 0;
const HAPTIC_DEBOUNCE_MS = 60; // Prevent jitter / vibration pile-up on rapid taps

/**
 * Perform smooth, gentle micro-haptic impact feedback
 */
export async function triggerHapticImpact(style: 'light' | 'medium' | 'heavy' = 'light'): Promise<void> {
  const now = Date.now();
  if (now - lastHapticTime < HAPTIC_DEBOUNCE_MS) return;
  lastHapticTime = now;

  try {
    // Keep it light and smooth
    await Haptics.impact({ style: style === 'heavy' ? ImpactStyle.Medium : ImpactStyle.Light });
  } catch (e) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(8);
    }
  }
}

/**
 * Perform smooth notification style haptics (gentle pulse, no harsh vibrations)
 */
export async function triggerHapticNotification(_type: 'success' | 'warning' | 'error' = 'success'): Promise<void> {
  const now = Date.now();
  if (now - lastHapticTime < HAPTIC_DEBOUNCE_MS) return;
  lastHapticTime = now;

  try {
    // Use crisp light impact instead of harsh system notification vibration patterns
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (e) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }
}

/**
 * Perform subtle selection tick (for tab switching, chips, buttons)
 */
export async function triggerHapticSelection(): Promise<void> {
  const now = Date.now();
  if (now - lastHapticTime < HAPTIC_DEBOUNCE_MS) return;
  lastHapticTime = now;

  try {
    await Haptics.selectionChanged();
  } catch (e) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(6);
    }
  }
}
