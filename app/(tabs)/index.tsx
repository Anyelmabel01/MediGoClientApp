import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { BottomNavbar } from '@/components/BottomNavbar';
import { LocationSelector } from '@/components/LocationSelector';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserProfile } from '@/components/UserProfile';
import { Colors } from '@/constants/Colors';
import { handleError } from '@/utils/errorHandler';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';

type ServiceItem = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  description: string;
};

const services: ServiceItem[] = [
  {
    id: '1',
    name: 'Consulta',
    icon: 'medkit',
    route: '/consulta',
    description: 'Agenda citas médicas presenciales o por telemedicina'
  },
  {
    id: '2',
    name: 'Farmacia',
    icon: 'medical',
    route: '/farmacia',
    description: 'Busca y compra medicamentos con entrega a domicilio'
  },
  {
    id: '3',
    name: 'Emergencia',
    icon: 'alert-circle',
    route: '/emergencia',
    description: 'Solicita atención médica de urgencia en tu ubicación'
  },
  {
    id: '4',
    name: 'Enfermería',
    icon: 'pulse',
    route: '/enfermeria',
    description: 'Servicios de cuidados y procedimientos a domicilio'
  },
  {
    id: '5',
    name: 'Expediente',
    icon: 'document-text',
    route: '/expediente',
    description: 'Accede a tu historial médico y resultados de pruebas'
  },
  {
    id: '6',
    name: 'Laboratorio',
    icon: 'flask',
    route: '/laboratorio',
    description: 'Programa toma de muestras y revisa resultados'
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { session, isLoading } = useAuth();
  const { user, currentLocation, setCurrentLocation } = useUser();
  const { isDarkMode } = useTheme();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  const handleLocationSelect = (location: any) => {
    setCurrentLocation(location);
  };

  const renderServiceItem = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity 
      style={styles.serviceItem}
      onPress={() => {
        try {
          router.push(item.route as any);
        } catch (e) {
          handleError(e);
        }
      }}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={32} color={Colors.light.primary} />
      </View>
      <View style={styles.serviceContent}>
        <ThemedText style={styles.serviceName}>{item.name}</ThemedText>
        <ThemedText style={styles.serviceDescription}>{item.description}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  // Show loading if still fetching user data
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={styles.loadingText}>Cargando tu perfil...</ThemedText>
      </ThemedView>
    );
  }

  // Show welcome message even if user profile is not fully loaded
  const userName = user?.nombre || session?.user?.user_metadata?.nombre || 'Usuario';
  const userEmail = user?.email || session?.user?.email || '';

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfoContainer}
          onPress={() => setShowUserProfile(true)}
          activeOpacity={0.8}
        >
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: Colors.light.white }]}>
              <ThemedText style={styles.avatarText}>
                {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}{user?.apellido?.charAt(0)?.toUpperCase() || 'S'}
              </ThemedText>
            </View>
            <View style={styles.editAvatarOverlay}>
              <Ionicons name="create-outline" size={12} color={Colors.light.white} />
            </View>
          </View>
          
          <View style={styles.greetingContainer}>
            <ThemedText style={styles.greeting}>
              ¡Hola, {user?.nombre || 'Anvill'}!
            </ThemedText>
            <ThemedText style={styles.subGreeting}>
              Tu ubicación principal
            </ThemedText>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.locationContainer}
          onPress={() => setShowLocationSelector(true)}
          activeOpacity={0.7}
        >
          <View style={styles.locationIcon}>
            <Ionicons name="location" size={16} color={Colors.light.white} />
          </View>
          <ThemedText style={styles.locationText} numberOfLines={1}>
            {currentLocation?.direccion || 'Seleccionar ubicación'}
          </ThemedText>
          <Ionicons name="chevron-down" size={14} color={Colors.light.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.servicesHeaderContainer}>
        <ThemedText style={styles.subtitle}>¿Qué servicio necesitas hoy?</ThemedText>
      </View>
      
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.servicesList}
        numColumns={2}
        columnWrapperStyle={styles.serviceRow}
      />
      
      <BottomNavbar />
      
      <UserProfile 
        isVisible={showUserProfile} 
        onClose={() => setShowUserProfile(false)}
      />
      
      <LocationSelector 
        isVisible={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onLocationSelect={handleLocationSelect}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingBottom: Platform.OS === 'ios' ? 80 : 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: Colors.light.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 6,
  },
  locationText: {
    flex: 1,
    color: Colors.light.white,
    fontSize: 13,
    marginRight: 4,
  },
  servicesHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  servicesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  serviceRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  serviceItem: {
    width: '48%',
    backgroundColor: Colors.light.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceContent: {
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    color: Colors.light.primary,
  },
  serviceDescription: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  editAvatarOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.white,
  },
});
