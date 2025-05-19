import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useTheme';
import { ThemeProvider } from '@/hooks/useTheme';
import { UserProvider } from '@/hooks/useUser';
import { AuthProvider } from '@/hooks/useAuth';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider>
      <UserProvider>
        <AuthProvider>
          <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </NavigationThemeProvider>
        </AuthProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
