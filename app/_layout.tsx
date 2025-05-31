// Import global polyfills for React Native compatibility
import '../global';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AppointmentsProvider } from '../context/AppointmentsContext';
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
        
        {/* Farmacia */}
        <Stack.Screen name="farmacia" options={{ headerShown: false }} />
        <Stack.Screen name="farmacia/producto/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="farmacia/categoria/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="farmacia/carrito" options={{ headerShown: false }} />
        
        {/* Consulta - Consultorio */}
        <Stack.Screen name="consulta" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio/buscar-proveedores" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio/mis-citas" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio/detalles-cita" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio/perfil-proveedor" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio/agendar-cita" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/consultorio/calificar-cita" options={{ headerShown: false }} />
        
        {/* Consulta - Telemedicina */}
        <Stack.Screen name="consulta/telemedicina" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/telemedicina/buscar-especialistas" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/telemedicina/mis-consultas" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/telemedicina/sala-espera" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/telemedicina/perfil-especialista" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/telemedicina/videollamada" options={{ headerShown: false }} />
        <Stack.Screen name="consulta/telemedicina/calificar-consulta" options={{ headerShown: false }} />
        
        {/* Enfermería */}
        <Stack.Screen name="enfermeria" options={{ headerShown: false }} />
        <Stack.Screen name="enfermeria/mis-servicios" options={{ headerShown: false }} />
        <Stack.Screen name="enfermeria/buscar-enfermera" options={{ headerShown: false }} />
        <Stack.Screen name="enfermeria/agendar-servicio" options={{ headerShown: false }} />
        <Stack.Screen name="enfermeria/perfil-enfermera/[id]" options={{ headerShown: false }} />
        
        {/* Laboratorio */}
        <Stack.Screen name="laboratorio/index" options={{ headerShown: false }} />
        <Stack.Screen name="laboratorio/detallesLaboratorio" options={{ headerShown: false }} />
        <Stack.Screen name="laboratorio/resultados" options={{ headerShown: false }} />
        <Stack.Screen name="laboratorio/historial" options={{ headerShown: false }} />
        <Stack.Screen name="laboratorio/encontrarLaboratorio" options={{ headerShown: false }} />
        <Stack.Screen name="laboratorio/solicitar" options={{ headerShown: false }} />
        
        {/* Emergencia */}
        <Stack.Screen name="emergencia" options={{ headerShown: false }} />
        <Stack.Screen name="emergencia/medica" options={{ headerShown: false }} />
        <Stack.Screen name="emergencia/accidente" options={{ headerShown: false }} />
        <Stack.Screen name="emergencia/traslado" options={{ headerShown: false }} />
        <Stack.Screen name="emergencia/seguimiento" options={{ headerShown: false }} />
        <Stack.Screen name="emergencia/ubicacion" options={{ headerShown: false }} />
        <Stack.Screen name="emergencia/paciente" options={{ headerShown: false }} />
        <Stack.Screen name="emergencia/historial" options={{ headerShown: false }} />
        <Stack.Screen name="emergencia/contacto" options={{ headerShown: false }} />
        <Stack.Screen name="emergencia/confirmacion" options={{ headerShown: false }} />
        <Stack.Screen name="emergencia/completado" options={{ headerShown: false }} />
        
        {/* Expediente y Perfil */}
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
            <AppointmentsProvider>
              <RootLayoutNav />
            </AppointmentsProvider>
          </CartProvider>
        </UserProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
}
