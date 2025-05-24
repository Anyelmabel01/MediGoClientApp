import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useEffect } from '@/hooks/react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, useRouter, useSegments } from 'expo-router';

function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';
    
    if (!isAuthenticated && inTabsGroup) {
      router.replace('/login');
    }
  }, [isAuthenticated, segments, router]);
}

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  
  useProtectedRoute(isAuthenticated);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[isDarkMode ? 'dark' : 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
        }}
      />
      <Tabs.Screen
        name="configuracion"
        options={{
          title: 'Configuración',
        }}
      />
    </Tabs>
  );
}
