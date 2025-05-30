import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const { isDarkMode } = useTheme();

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
      <Tabs.Screen
        name="resultados"
        options={{
          title: 'Resultados',
        }}
      />
      <Tabs.Screen
        name="pruebas"
        options={{
          title: 'Pruebas',
        }}
      />
    </Tabs>
  );
}
