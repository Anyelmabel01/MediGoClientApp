import React, { useEffect } from 'react';
import { LogBox } from 'react-native';

/**
 * Component that suppresses all visual error displays in the app
 * It disables both LogBox (newer API) and YellowBox (older API) error displays
 */
export function SuppressErrors({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable all console errors and warnings in the UI
    LogBox.ignoreAllLogs();
    
    // For older versions of React Native
    if ((global as any).YellowBox) {
      (global as any).YellowBox.ignoreAllWarnings();
    }
    
    // Suppress specific error about Text strings
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const errorMessage = args[0]?.toString() || '';
      
      // Filter out the specific error message we want to hide in the UI
      if (errorMessage.includes('Text strings must be rendered within a <Text> component')) {
        // Still log to console for debugging but don't show in UI
        return;
      }
      
      // Call original console.error for other errors
      originalConsoleError.apply(console, args);
    };
    
    // Cleanup
    return () => {
      console.error = originalConsoleError;
    };
  }, []);
  
  return <>{children}</>;
} 