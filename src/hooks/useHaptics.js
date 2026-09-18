import { useCallback } from 'react';

/**
 * useHaptics
 * 
 * Provides subtle haptic feedback using navigator.vibrate.
 * Designed as progressive enhancement; fails silently if unsupported.
 */
export function useHaptics() {
  const trigger = useCallback((pattern = 10) => {
    // Only vibrate if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignore errors (e.g., if browser requires a prior user gesture)
      }
    }
  }, []);

  return {
    // Light feedback for simple actions (buttons, selection)
    light: () => trigger(10),
    
    // Medium feedback for secondary actions
    medium: () => trigger(25),
    
    // Heavy feedback for major events (Wickets, Over Complete)
    heavy: () => trigger(50),
    
    // Success pattern (e.g. selection complete)
    success: () => trigger([15, 50, 15]),
    
    // Error pattern
    error: () => trigger([20, 40, 20, 40, 20]),
    
    // Custom trigger
    vibrate: trigger
  };
}

export default useHaptics;
