import { useEffect, useState } from 'react';
import { useColorScheme as useThemeColorScheme } from './useTheme';

/**
 * Para soportar renderizado estático, este valor necesita ser recalculado 
 * en el lado del cliente para web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useThemeColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
