import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';

type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

type Appointment = {
  id: string;
  date: string;
  time: string;
  provider_name: string;
  provider_type: string;
  organization_name?: string;
  status: AppointmentStatus;
  address: string;
  consultation_fee: number;
  avatar_url?: string;
  reason?: string;
};

const upcomingAppointments: Appointment[] = [
  {
    id: '1',
    date: '2024-12-28',
    time: '10:00 AM',
    provider_name: 'Dr. María González',
    provider_type: 'Cardiólogo',
    organization_name: 'Centro Médico Integral',
    status: 'CONFIRMED',
    address: 'Av. Reforma 123, Col. Roma Norte',
    consultation_fee: 800,
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    reason: 'Revisión cardiológica de rutina'
  },
  {
    id: '2',
    date: '2024-12-30',
    time: '3:30 PM',
    provider_name: 'Dr. Carlos Ramírez',
    provider_type: 'Médico General',
    organization_name: 'Clínica San Miguel',
    status: 'PENDING',
    address: 'Calle Condesa 456, Col. Condesa',
    consultation_fee: 600,
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    reason: 'Consulta general'
  }
];

const pastAppointments: Appointment[] = [
  {
    id: '3',
    date: '2024-12-15',
    time: '11:00 AM',
    provider_name: 'Dra. Ana Martínez',
    provider_type: 'Dermatólogo',
    organization_name: 'Instituto Dermatológico',
    status: 'COMPLETED',
    address: 'Av. Polanco 789, Col. Polanco',
    consultation_fee: 750,
    avatar_url: 'https://images.unsplash.com/photo-1594824047323-65b2b4e20c9e?w=150&h=150&fit=crop&crop=face',
    reason: 'Revisión de lunares'
  },
  {
    id: '4',
    date: '2024-12-10',
    time: '2:00 PM',
    provider_name: 'Dr. Roberto Silva',
    provider_type: 'Pediatra',
    organization_name: 'Hospital Infantil',
    status: 'CANCELLED',
    address: 'Calle Del Valle 321, Col. Del Valle',
    consultation_fee: 650,
    avatar_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    reason: 'Consulta pediátrica'
  }
];

export default function MisCitasScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simular carga de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return Colors.light.success;
      case 'PENDING':
        return '#f59e0b';
      case 'CANCELLED':
        return Colors.light.error;
      case 'COMPLETED':
        return Colors.light.primary;
      default:
        return Colors.light.textSecondary;
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'PENDING':
        return 'Pendiente';
      case 'CANCELLED':
        return 'Cancelada';
      case 'COMPLETED':
        return 'Completada';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAppointmentPress = (appointment: Appointment) => {
    router.push({
      pathname: '/consulta/consultorio/detalles-cita',
      params: { appointmentId: appointment.id }
    });
  };

  const handleReschedule = (appointmentId: string) => {
    Alert.alert(
      'Reprogramar Cita',
      '¿Estás seguro de que quieres reprogramar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Reprogramar', 
          onPress: () => {
            // TODO: Implementar lógica de reprogramación
            Alert.alert('Éxito', 'Cita reprogramada exitosamente');
          }
        }
      ]
    );
  };

  const handleCancel = (appointmentId: string) => {
    Alert.alert(
      'Cancelar Cita',
      '¿Estás seguro de que quieres cancelar esta cita?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implementar lógica de cancelación
            Alert.alert('Éxito', 'Cita cancelada exitosamente');
          }
        }
      ]
    );
  };

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <TouchableOpacity 
      style={[styles.appointmentCard, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}
      onPress={() => handleAppointmentPress(item)}
    >
      <View style={styles.appointmentHeader}>
        <View style={styles.dateTimeContainer}>
          <ThemedText style={styles.dateText}>{formatDate(item.date)}</ThemedText>
          <ThemedText style={[styles.timeText, { color: Colors.light.primary }]}>
            {item.time}
          </ThemedText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <ThemedText style={styles.statusText}>{getStatusLabel(item.status)}</ThemedText>
        </View>
      </View>

      <View style={styles.providerInfo}>
        <ThemedText style={styles.providerName}>{item.provider_name}</ThemedText>
        <ThemedText style={[styles.providerType, {
          color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
        }]}>
          {item.provider_type}
        </ThemedText>
        {item.organization_name && (
          <ThemedText style={[styles.organizationName, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            {item.organization_name}
          </ThemedText>
        )}
      </View>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={Colors.light.primary} />
          <ThemedText style={[styles.detailText, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            {item.address}
          </ThemedText>
        </View>
        
        {item.reason && (
          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={16} color={Colors.light.primary} />
            <ThemedText style={[styles.detailText, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              {item.reason}
            </ThemedText>
          </View>
        )}

        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={16} color={Colors.light.primary} />
          <ThemedText style={[styles.priceText, { color: Colors.light.primary }]}>
            ${item.consultation_fee}
          </ThemedText>
        </View>
      </View>

      {/* Actions for upcoming appointments */}
      {activeTab === 'upcoming' && item.status !== 'CANCELLED' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.rescheduleButton]}
            onPress={() => handleReschedule(item.id)}
          >
            <Ionicons name="calendar-outline" size={16} color={Colors.light.primary} />
            <ThemedText style={[styles.actionButtonText, { color: Colors.light.primary }]}>
              Reprogramar
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancel(item.id)}
          >
            <Ionicons name="close-outline" size={16} color={Colors.light.error} />
            <ThemedText style={[styles.actionButtonText, { color: Colors.light.error }]}>
              Cancelar
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const currentData = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Mis Citas</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && styles.activeTab,
            { backgroundColor: activeTab === 'upcoming' ? Colors.light.primary : 'transparent' }
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <ThemedText style={[
            styles.tabText,
            { color: activeTab === 'upcoming' ? 'white' : Colors.light.primary }
          ]}>
            Próximas ({upcomingAppointments.length})
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'past' && styles.activeTab,
            { backgroundColor: activeTab === 'past' ? Colors.light.primary : 'transparent' }
          ]}
          onPress={() => setActiveTab('past')}
        >
          <ThemedText style={[
            styles.tabText,
            { color: activeTab === 'past' ? 'white' : Colors.light.primary }
          ]}>
            Pasadas ({pastAppointments.length})
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      <FlatList
        data={currentData}
        renderItem={renderAppointment}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.appointmentsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.light.primary]}
            tintColor={Colors.light.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons 
              name={activeTab === 'upcoming' ? 'calendar-outline' : 'time-outline'} 
              size={64} 
              color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
            />
            <ThemedText style={[styles.emptyTitle, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              {activeTab === 'upcoming' ? 'No tienes citas próximas' : 'No tienes citas pasadas'}
            </ThemedText>
            <ThemedText style={[styles.emptyText, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              {activeTab === 'upcoming' 
                ? 'Agenda tu primera cita médica' 
                : 'Tus citas completadas aparecerán aquí'
              }
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    // Styles applied via backgroundColor
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  appointmentsList: {
    padding: 16,
    paddingTop: 0,
  },
  appointmentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dateTimeContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  providerInfo: {
    marginBottom: 12,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  providerType: {
    fontSize: 14,
    marginBottom: 2,
  },
  organizationName: {
    fontSize: 13,
  },
  appointmentDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    flex: 1,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  rescheduleButton: {
    borderColor: Colors.light.primary,
  },
  cancelButton: {
    borderColor: Colors.light.error,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 