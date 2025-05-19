import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from '@/hooks/react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';
    
    if (!isAuthenticated && inTabsGroup) {
      // Redirigir al login
      router.replace('/login');
    }
  }, [isAuthenticated, segments, router]);
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // Obtener el estado de autenticación del hook useAuth
  const { isAuthenticated } = useAuth();
  
  useProtectedRoute(isAuthenticated);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
        tabBarShowLabel: false, // Ocultar etiquetas para que solo se muestre el navbar personalizado
        tabBarButton: () => null, // Deshabilitar los botones predeterminados del tabBar
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
    </Tabs>
  );
}
