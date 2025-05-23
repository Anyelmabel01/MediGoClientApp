import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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

// Datos más realistas para las citas próximas
const upcomingAppointments = [
  { 
    id: '1', 
    testName: 'Perfil Lipídico Completo', 
    labName: 'Laboratorio Central Plaza', 
    date: '2024-12-28',
    time: '10:00 AM', 
    status: 'Confirmada',
    type: 'laboratory',
    preparationRequired: true
  },
  { 
    id: '2', 
    testName: 'Hemograma Completo + VSG', 
    labName: 'Clínica Norte Especializada', 
    date: '2024-12-30',
    time: '08:30 AM', 
    status: 'Pendiente',
    type: 'home',
    preparationRequired: false
  },
  { 
    id: '3', 
    testName: 'Glucosa en Ayunas', 
    labName: 'Centro Médico Sur', 
    date: '2025-01-02',
    time: '07:45 AM', 
    status: 'Confirmada',
    type: 'laboratory',
    preparationRequired: true
  },
];

const recentResults = [
  { 
    id: '1', 
    testName: 'Examen General de Orina', 
    date: '2024-12-20', 
    status: 'Normal',
    labName: 'Laboratorio Central Plaza',
    downloadable: true
  },
  { 
    id: '2', 
    testName: 'Química Sanguínea 6 elementos', 
    date: '2024-12-18', 
    status: 'Revisión Necesaria',
    labName: 'Clínica Norte Especializada',
    downloadable: true
  },
  { 
    id: '3', 
    testName: 'Biometría Hemática Completa', 
    date: '2024-12-15', 
    status: 'Normal',
    labName: 'Centro Médico Sur',
    downloadable: true
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

  const handleAppointmentPress = (appointmentId: string) => {
    // Navegar a detalles de la cita
    Alert.alert(
      'Detalle de Cita',
      'Funcionalidad de detalle de cita en desarrollo',
      [{ text: 'OK' }]
    );
  };

  const handleResultPress = (resultId: string) => {
    router.push('/laboratorio/detallesResultado');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    const colors = isDarkMode ? Colors.dark : Colors.light;
    switch (status) {
      case 'Confirmada':
      case 'Normal':
        return colors.success;
      case 'Pendiente':
        return colors.accent;
      case 'Anormal':
      case 'Revisión Necesaria':
        return colors.error;
      default:
        return colors.border;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-MX', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const currentTip = healthTips[currentTipIndex];

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={[styles.header, { 
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background 
      }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDarkMode ? Colors.dark.text : Colors.light.text} 
          />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Laboratorio</ThemedText>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push('/laboratorio/centroNotificaciones')}
        >
          <Ionicons 
            name="notifications-outline" 
            size={24} 
            color={isDarkMode ? Colors.dark.text : Colors.light.text} 
          />
          <View style={[styles.notificationBadge, { backgroundColor: Colors.light.error }]} />
        </TouchableOpacity>
      </View>
      
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
        
        {/* Acciones Rápidas */}
        <ThemedText style={styles.sectionTitle}>Acciones Rápidas</ThemedText>
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
        
        {/* Próximas Citas */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Próximas Citas</ThemedText>
          <TouchableOpacity onPress={() => router.push('/laboratorio/catalogo')}>
            <ThemedText style={[styles.seeAllLink, { 
              color: isDarkMode ? Colors.dark.primary : Colors.light.primary 
            }]}>
              Agendar nueva
            </ThemedText>
          </TouchableOpacity>
        </View>
        
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(appointment => (
            <TouchableOpacity 
              key={appointment.id} 
              style={[styles.listItemCard, { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background, 
                borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
              }]}
              onPress={() => handleAppointmentPress(appointment.id)}
            >
              <View style={styles.appointmentIcon}>
                <Ionicons 
                  name={appointment.type === 'home' ? 'home-outline' : 'business-outline'} 
                  size={24} 
                  color={isDarkMode ? Colors.dark.primary : Colors.light.primary} 
                />
              </View>
              <View style={styles.listItemContent}>
                <ThemedText style={styles.listItemTitle}>{appointment.testName}</ThemedText>
                <ThemedText style={styles.listItemSubtitle}>
                  {appointment.labName}
                </ThemedText>
                <ThemedText style={styles.appointmentTime}>
                  {formatDate(appointment.date)} - {appointment.time}
                </ThemedText>
                {appointment.preparationRequired && (
                  <View style={styles.preparationWarning}>
                    <Ionicons name="alert-circle-outline" size={14} color={Colors.light.error} />
                    <ThemedText style={[styles.preparationText, { color: Colors.light.error }]}>
                      Requiere preparación
                    </ThemedText>
                  </View>
                )}
              </View>
              <View style={styles.appointmentActions}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                  <ThemedText style={styles.statusText}>{appointment.status}</ThemedText>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
                />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={[styles.emptyState, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            <Ionicons 
              name="calendar-outline" 
              size={48} 
              color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
            />
            <ThemedText style={[styles.emptyStateText, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              No tienes citas programadas
            </ThemedText>
            <TouchableOpacity 
              style={[styles.emptyStateButton, { 
                backgroundColor: isDarkMode ? Colors.dark.primary : Colors.light.primary 
              }]}
              onPress={() => router.push('/laboratorio/catalogo')}
            >
              <ThemedText style={styles.emptyStateButtonText}>Agendar primera cita</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* Resultados Recientes */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Resultados Recientes</ThemedText>
          <TouchableOpacity onPress={() => router.push('/laboratorio/resultados')}>
            <ThemedText style={[styles.seeAllLink, { 
              color: isDarkMode ? Colors.dark.primary : Colors.light.primary 
            }]}>
              Ver todos
            </ThemedText>
          </TouchableOpacity>
        </View>
        
        {recentResults.length > 0 ? (
          recentResults.map(result => (
            <TouchableOpacity 
              key={result.id} 
              style={[styles.listItemCard, { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background, 
                borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
              }]}
              onPress={() => handleResultPress(result.id)}
            >
              <View style={styles.resultIcon}>
                <Ionicons 
                  name="document-text-outline" 
                  size={24} 
                  color={isDarkMode ? Colors.dark.primary : Colors.light.primary} 
                />
              </View>
              <View style={styles.listItemContent}>
                <ThemedText style={styles.listItemTitle}>{result.testName}</ThemedText>
                <ThemedText style={styles.listItemSubtitle}>{result.labName}</ThemedText>
                <ThemedText style={styles.resultDate}>
                  {new Date(result.date).toLocaleDateString('es-MX')}
                </ThemedText>
              </View>
              <View style={styles.resultActions}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(result.status) }]}>
                  <ThemedText style={styles.statusText}>{result.status}</ThemedText>
                </View>
                {result.downloadable && (
                  <TouchableOpacity style={styles.downloadButton}>
                    <Ionicons name="download-outline" size={18} color={isDarkMode ? Colors.dark.primary : Colors.light.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={[styles.emptyState, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            <Ionicons 
              name="document-outline" 
              size={48} 
              color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
            />
            <ThemedText style={[styles.emptyStateText, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              No hay resultados disponibles
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
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
  },
  seeAllLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
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
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  listItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  appointmentIcon: {
    marginRight: 12,
  },
  resultIcon: {
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  resultDate: {
    fontSize: 13,
    opacity: 0.6,
  },
  preparationWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  preparationText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  appointmentActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  resultActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  downloadButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyStateButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 