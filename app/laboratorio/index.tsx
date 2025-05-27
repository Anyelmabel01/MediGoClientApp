import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Modal, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

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
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

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
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#00A0B0', '#0081B0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Laboratorio</ThemedText>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <Ionicons 
              name="notifications-outline" 
              size={24} 
              color="#fff" 
            />
            <View style={[styles.notificationBadge, { backgroundColor: '#ff6b6b' }]} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ThemedText style={styles.welcomeMessage}>
          Bienvenido/a, {user?.nombre || 'Usuario'}
        </ThemedText>
        
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
                  styles.tipIndicator, 
                  { backgroundColor: index === currentTipIndex ? '#fff' : 'rgba(255,255,255,0.4)' }
                ]} 
              />
            ))}
          </View>
        </View>
        
        {/* Servicios de Laboratorio */}
        <ThemedText style={styles.sectionTitle}>Servicios de Laboratorio</ThemedText>
        <View style={styles.quickGrid}>
          {labOptions.map((option) => (
            <TouchableOpacity 
              key={option.id}
              style={[styles.quickCard, { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
              }]}
              onPress={() => handleOptionPress(option.route)}
              activeOpacity={0.7}
            >
              <View style={styles.quickIconContainer}>
                <Ionicons 
                  name={option.icon} 
                  size={32} 
                  color={isDarkMode ? Colors.dark.primary : Colors.light.primary} 
                />
              </View>
              <ThemedText style={styles.quickLabel}>{option.name}</ThemedText>
              <ThemedText style={[styles.quickDescription, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>{option.description}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Seguir Entrega - Barra larga especial */}
        <TouchableOpacity 
          style={[styles.deliveryTrackingCard, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}
          onPress={() => setShowDeliveryModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.deliveryTrackingContent}>
            <View style={[styles.deliveryTrackingIcon, { backgroundColor: Colors.light.primary + '20' }]}>
              <Ionicons 
                name="bicycle-outline" 
                size={32} 
                color={Colors.light.primary} 
              />
            </View>
            <View style={styles.deliveryTrackingInfo}>
              <ThemedText style={styles.deliveryTrackingTitle}>Seguir Entrega</ThemedText>
              <ThemedText style={[styles.deliveryTrackingDescription, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>Rastrea tu resultado en tiempo real</ThemedText>
            </View>
            <View style={styles.deliveryTrackingIndicator}>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.primary} />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Seguimiento de Entrega */}
      <Modal
        visible={showDeliveryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDeliveryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.deliveryModalContent, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            {/* Header del modal */}
            <View style={styles.deliveryModalHeader}>
              <View style={[styles.deliveryIcon, { backgroundColor: Colors.light.primary }]}>
                <Ionicons name="bicycle" size={32} color="white" />
              </View>
              <ThemedText style={[styles.deliveryTitle, {
                color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
              }]}>
                Seguimiento de Entrega
              </ThemedText>
              <ThemedText style={[styles.deliveryDescription, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                Rastrea el estado de tus muestras y resultados en tiempo real
              </ThemedText>
            </View>

            {/* Información de entregas activas */}
            <View style={[styles.activeDeliveries, {
              backgroundColor: Colors.light.primary + '10',
              borderColor: Colors.light.primary + '30'
            }]}>
              <View style={styles.deliveryRow}>
                <Ionicons name="flask" size={20} color={Colors.light.primary} />
                <View style={styles.deliveryInfo}>
                  <ThemedText style={[styles.deliveryLabel, {
                    color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                  }]}>Análisis de Sangre Completo</ThemedText>
                  <ThemedText style={[styles.deliveryValue, {
                    color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
                  }]}>En tránsito - Llegada estimada: 15 min</ThemedText>
                </View>
              </View>

              <View style={styles.deliveryRow}>
                <Ionicons name="document-text" size={20} color={Colors.light.primary} />
                <View style={styles.deliveryInfo}>
                  <ThemedText style={[styles.deliveryLabel, {
                    color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                  }]}>Resultados disponibles:</ThemedText>
                  <ThemedText style={[styles.deliveryValue, {
                    color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
                  }]}>Química Sanguínea - Listo para descarga</ThemedText>
                </View>
              </View>

              <View style={styles.deliveryRow}>
                <Ionicons name="location" size={20} color={Colors.light.primary} />
                <View style={styles.deliveryInfo}>
                  <ThemedText style={[styles.deliveryLabel, {
                    color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                  }]}>Última ubicación:</ThemedText>
                  <ThemedText style={[styles.deliveryValue, {
                    color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
                  }]}>Av. Insurgentes Sur 1234, CDMX</ThemedText>
                </View>
              </View>
            </View>

            {/* Botones de acción - Barra larga en la parte inferior */}
            <View style={styles.deliveryActions}>
              <TouchableOpacity 
                style={[styles.deliveryActionButton, { backgroundColor: Colors.light.primary }]}
                onPress={handleGoToTracking}
              >
                <Ionicons name="navigate" size={20} color="white" />
                <ThemedText style={[styles.deliveryActionButtonText, { color: 'white' }]}>Ver Mapa en Vivo</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.deliveryActionButton, {
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                  borderColor: Colors.light.primary,
                  borderWidth: 1
                }]}
                onPress={handleViewOrders}
              >
                <Ionicons name="time-outline" size={20} color={Colors.light.primary} />
                <ThemedText style={[styles.deliveryActionButtonText, { color: Colors.light.primary }]}>
                  Ver Historial
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40, // Compensa el espacio del botón de notificaciones
    color: '#fff',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 20,
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
  tipIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
  },
  seeAllLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 130,
  },
  quickIconContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  deliveryModalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderWidth: 1,
    maxHeight: '80%',
  },
  deliveryModalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  deliveryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  deliveryDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  activeDeliveries: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deliveryInfo: {
    marginLeft: 12,
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  deliveryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  deliveryActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
  },
  deliveryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  deliveryActionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Delivery Tracking Card Styles
  deliveryTrackingCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deliveryTrackingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTrackingIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  deliveryTrackingInfo: {
    flex: 1,
  },
  deliveryTrackingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deliveryTrackingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  deliveryTrackingIndicator: {
    marginLeft: 12,
  },
}); 