import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth';
import { UserProvider } from '@/hooks/useUser';

function RootLayoutNav() {
  const { isDarkMode } = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ErrorBoundary>
      <NavigationThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Página no encontrada' }} />
          <Stack.Screen name="consulta" options={{ headerShown: false }} />
          <Stack.Screen name="emergencia" options={{ headerShown: false }} />
          <Stack.Screen name="laboratorio" options={{ headerShown: false }} />
          <Stack.Screen name="farmacia" options={{ headerShown: false }} />
          <Stack.Screen name="enfermeria" options={{ headerShown: false }} />
          <Stack.Screen name="expediente" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="configuracion" options={{ headerShown: false }} />
          <Stack.Screen name="perfil" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      </NavigationThemeProvider>
    </ErrorBoundary>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <UserProvider>
          <AuthProvider>
            <CartProvider>
              <RootLayoutNav />
            </CartProvider>
          </AuthProvider>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
