import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';

/**
 * Para soportar renderizado estático, este valor necesita ser recalculado 
 * en el lado del cliente para web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (hasHydrated) {
    return isDarkMode ? 'dark' : 'light';
  }

  return 'light';
}
