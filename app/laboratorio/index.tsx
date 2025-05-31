import { BottomNavbar } from '@/components/BottomNavbar';
import { LocationSelector } from '@/components/LocationSelector';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserProfile } from '@/components/UserProfile';
import { Colors } from '@/constants/Colors';
import { UserLocation } from '@/constants/UserModel';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

type LabOption = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  route: string;
};

const labOptions: LabOption[] = [
  {
    id: '1',
    name: 'Agendar Prueba',
    icon: 'flask-outline',
    description: 'Programa una visita o toma de muestras a domicilio',
    route: '/laboratorio/catalogo',
  },
  {
    id: '2',
    name: 'Mis Resultados',
    icon: 'document-text-outline',
    description: 'Consulta los resultados de tus pruebas',
    route: '/laboratorio/resultados',
  },
  {
    id: '3',
    name: 'Historial de Pruebas',
    icon: 'time-outline',
    description: 'Revisa el historial de todas tus pruebas',
    route: '/laboratorio/historial',
  },
  {
    id: '4',
    name: 'Catálogo de Pruebas',
    icon: 'list-outline',
    description: 'Explora las pruebas de laboratorio disponibles',
    route: '/laboratorio/catalogo',
  },
  {
    id: '5',
    name: 'Encontrar Laboratorio',
    icon: 'location-outline',
    description: 'Busca laboratorios cercanos y afiliados',
    route: '/laboratorio/encontrarLaboratorio',
  },
  {
    id: '6',
    name: 'Notificaciones',
    icon: 'notifications-outline',
    description: 'Centro de notificaciones y recordatorios',
    route: '/laboratorio/centroNotificaciones',
  },
];

// Consejos de salud rotativos
const healthTips = [
  {
    id: 1,
    title: 'Preparación para Ayuno',
    description: 'Para pruebas que requieren ayuno, no consumas alimentos 8-12 horas antes. Puedes beber agua.',
    icon: 'time-outline'
  },
  {
    id: 2,
    title: 'Hidratación Importante',
    description: 'Mantente bien hidratado antes de tu prueba de sangre para facilitar la extracción.',
    icon: 'water-outline'
  },
  {
    id: 3,
    title: 'Medicamentos',
    description: 'Informa al laboratorio sobre todos los medicamentos que tomas actualmente.',
    icon: 'medical-outline'
  },
  {
    id: 4,
    title: 'Ejercicio',
    description: 'Evita ejercicio intenso 24 horas antes de pruebas como CPK o enzimas musculares.',
    icon: 'fitness-outline'
  }
];

export default function LaboratorioScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user, currentLocation, setCurrentLocation } = useUser();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const handleLocationSelect = (location: UserLocation) => {
    setCurrentLocation(location);
  };

  // Rotar consejos de salud cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOptionPress = (route: string) => {
    router.push(route as any);
  };

  const handleGoToTracking = () => {
    setShowDeliveryModal(false);
    router.push('/laboratorio/seguimiento' as any);
  };

  const handleViewOrders = () => {
    setShowDeliveryModal(false);
    router.push('/laboratorio/historial' as any);
  };

  const handleNotificationPress = () => {
    router.push('/laboratorio/centroNotificaciones');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const currentTip = healthTips[currentTipIndex];

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
          </TouchableOpacity>
          
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {user?.nombre?.charAt(0) || 'U'}{user?.apellido?.charAt(0) || 'S'}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.greetingContainer}>
              <ThemedText style={styles.greeting}>
                Laboratorio
              </ThemedText>
              <View style={styles.editProfileIndicator}>
                <Ionicons name="flask" size={14} color={Colors.light.primary} />
              </View>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.servicesHeaderContainer}>
        <ThemedText style={styles.subtitle}>Servicios de laboratorio y análisis</ThemedText>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Consejo de salud rotativo */}
        <View style={[styles.healthTipCard, { 
          backgroundColor: isDarkMode ? Colors.dark.primary : Colors.light.primary 
        }]}>
          <View style={styles.healthTipContent}>
            <Ionicons name={currentTip.icon as any} size={24} color="#fff" />
            <View style={styles.healthTipText}>
              <ThemedText style={styles.healthTipTitle}>{currentTip.title}</ThemedText>
              <ThemedText style={styles.healthTipDescription}>{currentTip.description}</ThemedText>
            </View>
          </View>
          <View style={styles.tipIndicators}>
            {healthTips.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.indicator, 
                  { backgroundColor: currentTipIndex === index ? '#fff' : 'rgba(255, 255, 255, 0.3)' }
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Opciones de laboratorio */}
        <View style={styles.optionsGrid}>
          {labOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleOptionPress(option.route)}
            >
              <View style={styles.optionIcon}>
                <Ionicons name={option.icon} size={32} color={Colors.light.primary} />
              </View>
              <ThemedText style={styles.optionName}>{option.name}</ThemedText>
              <ThemedText style={styles.optionDescription}>{option.description}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
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
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40, 
    height: 40,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: Colors.light.primary,
    fontSize: 17,
    fontWeight: 'bold',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  editProfileIndicator: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 4,
    marginLeft: 8,
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
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  healthTipCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  healthTipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  healthTipText: {
    flex: 1,
    marginLeft: 12,
  },
  healthTipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  healthTipDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  tipIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.white,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 130,
  },
  optionIcon: {
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    padding: 12,
    borderRadius: 12,
    alignSelf: 'center',
  },
  optionName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    color: Colors.light.text,
  },
  optionDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    color: Colors.light.textSecondary,
  },
}); 