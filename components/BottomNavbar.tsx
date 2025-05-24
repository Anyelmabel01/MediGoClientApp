import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface NavItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  route: string;
}

export function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    {
      name: 'Inicio',
      icon: 'home-outline',
      activeIcon: 'home',
      route: '/(tabs)',
    },
    {
      name: 'Configuración',
      icon: 'settings-outline',
      activeIcon: 'settings',
      route: '/configuracion',
    },
    {
      name: 'Perfil',
      icon: 'person-outline',
      activeIcon: 'person',
      route: '/perfil',
    },
  ];

  const isActive = (route: string) => {
    // Verificar si la ruta actual coincide con alguna de las del menú
    if (route === '/(tabs)' && (pathname === '/(tabs)' || pathname === '/')) {
      return true;
    }
    return pathname.startsWith(route);
  };

  const handleNavigation = (route: string) => {
    // Utilizamos any para evitar el error de tipado con las rutas
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.navItem}
          onPress={() => handleNavigation(item.route)}
        >
          <Ionicons
            name={isActive(item.route) ? item.activeIcon : item.icon}
            size={24}
            color="white"
          />
          <ThemedText
            style={[
              styles.navText,
              isActive(item.route) && styles.activeNavText,
            ]}
          >
            {item.name}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 0,
    backgroundColor: Colors.light.primary,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  activeNavText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 