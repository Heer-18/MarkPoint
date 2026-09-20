import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Perform subtle haptic impact feedback
 */
export async function triggerHapticImpact(style: 'light' | 'medium' | 'heavy' = 'light'): Promise<void> {
  try {
    const impactMap = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    };
    await Haptics.impact({ style: impactMap[style] });
  } catch (e) {
    // Fallback to web vibration if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const durationMap = { light: 15, medium: 30, heavy: 50 };
      navigator.vibrate(durationMap[style]);
    }
  }
}

/**
 * Perform notification style haptics (success, warning, error)
 */
export async function triggerHapticNotification(type: 'success' | 'warning' | 'error' = 'success'): Promise<void> {
  try {
    const notifMap = {
      success: NotificationType.Success,
      warning: NotificationType.Warning,
      error: NotificationType.Error,
    };
    await Haptics.notification({ type: notifMap[type] });
  } catch (e) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const patternMap = {
        success: [20, 50, 20],
        warning: [30, 70, 30],
        error: [50, 50, 50, 50, 50],
      };
      navigator.vibrate(patternMap[type]);
    }
  }
}

/**
 * Perform light selection feedback (tab switches, toggles, filter clicks)
 */
export async function triggerHapticSelection(): Promise<void> {
  try {
    await Haptics.selectionStart();
    await Haptics.selectionChanged();
    await Haptics.selectionEnd();
  } catch (e) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }
}
