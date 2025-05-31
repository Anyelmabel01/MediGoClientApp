// Import global polyfills for React Native compatibility
import '../global';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { CartProvider } from '../context/CartContext';
import { ThemeProvider as CustomThemeProvider } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { useColorScheme } from '../hooks/useColorScheme';
import { UserProvider } from '../hooks/useUser';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to resolve

    const currentRoute = segments.join('/');
    const inAuthGroup = currentRoute.includes('login') || currentRoute.includes('register');
    const inTabsGroup = segments[0] === '(tabs)';

    console.log('Navigation check:', { 
      currentRoute, 
      inAuthGroup, 
      inTabsGroup, 
      hasSession: !!session?.user,
      isLoading 
    });

    // If user has a session (is authenticated)
    if (session?.user) {
      if (inAuthGroup) {
        // User is authenticated but in auth screens, redirect to main app
        console.log('User authenticated, redirecting to main app');
        router.replace('/(tabs)');
      }
      // If user is authenticated and already in tabs, do nothing
    } else {
      // User is not authenticated
      if (inTabsGroup || (!inAuthGroup && currentRoute !== '')) {
        // User is not authenticated and trying to access protected routes, redirect to login
        console.log('User not authenticated, redirecting to login');
        router.replace('/login');
      }
    }
  }, [session?.user, segments, isLoading]); // Only depend on session.user, not the entire session object

  if (isLoading) {
    // Show splash screen while loading auth state
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="farmacia" options={{ headerShown: false }} />
        <Stack.Screen name="consulta" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/telemedicina" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio/buscar-proveedores" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio/mis-citas" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio/detalles-cita" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio/perfil-proveedor" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio/agendar-cita" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio/calificar-cita" options={{ headerShown: false }} />
        <Stack.Screen name="emergencia" options={{ headerShown: false }} />
        <Stack.Screen name="enfermeria" options={{ headerShown: false }} />
        <Stack.Screen name="expediente" options={{ headerShown: false }} />
        <Stack.Screen name="perfil" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <CustomThemeProvider>
      <AuthProvider>
        <UserProvider>
          <CartProvider>
            <RootLayoutNav />
          </CartProvider>
        </UserProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
}
