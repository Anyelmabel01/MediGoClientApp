import { Colors } from '@/constants/Colors';
import { useEffect } from '@/hooks/react';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useTheme';
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
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();
  
  useProtectedRoute(isAuthenticated);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
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
