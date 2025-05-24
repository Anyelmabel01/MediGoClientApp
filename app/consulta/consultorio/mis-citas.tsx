import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Paleta de colores oficial MediGo
const COLORS = {
  primary: '#00A0B0',
  primaryLight: '#33b5c2',
  primaryDark: '#006070',
  accent: '#70D0E0',
  background: '#FFFFFF',
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  white: '#FFFFFF',
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  border: '#E9ECEF',
  cardBg: '#f8f9fa',
};

type AppointmentStatus = 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';

type Appointment = {
  id: string;
  date: string;
  time: string;
  provider_name: string;
  provider_type: string;
  organization_name?: string;
  status: AppointmentStatus;
  location: string;
  consultation_fee: number;
};

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: '2024-12-28',
    time: '10:00 AM',
    provider_name: 'Dr. María González',
    provider_type: 'Cardióloga',
    organization_name: 'Centro Médico Integral',
    status: 'CONFIRMED',
    location: 'Col. Roma Norte, CDMX',
    consultation_fee: 800,
  },
  {
    id: '2',
    date: '2024-12-30',
    time: '3:30 PM',
    provider_name: 'Dr. Carlos Ramírez',
    provider_type: 'Médico General',
    organization_name: 'Clínica San Miguel',
    status: 'PENDING',
    location: 'Col. Condesa, CDMX',
    consultation_fee: 600,
  },
  {
    id: '3',
    date: '2024-12-25',
    time: '2:00 PM',
    provider_name: 'Dra. Ana Martínez',
    provider_type: 'Dermatóloga',
    organization_name: 'Instituto Dermatológico',
    status: 'COMPLETED',
    location: 'Col. Polanco, CDMX',
    consultation_fee: 750,
  },
];

export default function MisCitasScreen() {
  const router = useRouter();

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return COLORS.success;
      case 'PENDING':
        return COLORS.warning;
      case 'COMPLETED':
        return COLORS.primary;
      case 'CANCELLED':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'PENDING':
        return 'Pendiente';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'checkmark-circle';
      case 'PENDING':
        return 'time';
      case 'COMPLETED':
        return 'checkmark-done-circle';
      case 'CANCELLED':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const handleViewAppointment = (appointment: Appointment) => {
    router.push({
      pathname: '/consulta/consultorio/detalles-cita',
      params: { 
        appointmentId: appointment.id,
        providerId: appointment.id
      }
    });
  };

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <TouchableOpacity 
      style={styles.appointmentCard}
      onPress={() => handleViewAppointment(item)}
    >
      <View style={styles.appointmentHeader}>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>
            {formatDate(item.date)}
          </Text>
          <Text style={styles.timeText}>
            {item.time}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons 
            name={getStatusIcon(item.status) as any} 
            size={14} 
            color="white" 
          />
          <Text style={styles.statusText}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.appointmentInfo}>
        <Text style={styles.providerName}>
          {item.provider_name}
        </Text>
        <Text style={styles.providerType}>
          {item.provider_type}
        </Text>
        {item.organization_name && (
          <Text style={styles.organizationName}>
            {item.organization_name}
          </Text>
        )}
      </View>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color={COLORS.primary} />
          <Text style={styles.detailText}>
            {item.location}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color={COLORS.primary} />
          <Text style={styles.detailText}>
            ${item.consultation_fee}
          </Text>
        </View>
      </View>
      
      <View style={styles.appointmentFooter}>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleViewAppointment(item)}
          >
            <Ionicons name="eye-outline" size={16} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>
              Ver detalles
            </Text>
          </TouchableOpacity>
          {item.status === 'COMPLETED' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.rateButton]}
              onPress={() => router.push({
                pathname: '/consulta/consultorio/calificar-cita',
                params: { 
                  appointmentId: item.id,
                  providerId: item.id
                }
              })}
            >
              <Ionicons name="star-outline" size={16} color={COLORS.warning} />
              <Text style={[styles.actionButtonText, { color: COLORS.warning }]}>
                Calificar
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Citas</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Stats Header */}
      <View style={styles.statsHeader}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {mockAppointments.length}
          </Text>
          <Text style={styles.statLabel}>
            Total de citas
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {mockAppointments.filter(apt => apt.status === 'PENDING' || apt.status === 'CONFIRMED').length}
          </Text>
          <Text style={styles.statLabel}>
            Próximas
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {mockAppointments.filter(apt => apt.status === 'COMPLETED').length}
          </Text>
          <Text style={styles.statLabel}>
            Completadas
          </Text>
        </View>
      </View>

      {/* Appointments List */}
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Historial de Citas
          </Text>
          <TouchableOpacity 
            style={styles.newAppointmentButton}
            onPress={() => router.push('/consulta/consultorio/buscar-proveedores')}
          >
            <Ionicons name="add" size={16} color="white" />
            <Text style={styles.newAppointmentButtonText}>
              Nueva cita
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={mockAppointments}
          renderItem={renderAppointment}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.appointmentsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>
                No tienes citas registradas
              </Text>
              <Text style={styles.emptyText}>
                Agenda tu primera cita médica para comenzar
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => router.push('/consulta/consultorio/buscar-proveedores')}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.emptyButtonText}>
                  Agendar primera cita
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: COLORS.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  statsHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
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
    color: COLORS.textPrimary,
  },
  newAppointmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  newAppointmentButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentsList: {
    gap: 12,
  },
  appointmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateTimeContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    color: COLORS.textPrimary,
    textTransform: 'capitalize',
  },
  timeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  appointmentInfo: {
    marginBottom: 12,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.textPrimary,
  },
  providerType: {
    fontSize: 14,
    marginBottom: 2,
    color: COLORS.textSecondary,
  },
  organizationName: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  appointmentDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  appointmentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rateButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.warning + '20',
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: COLORS.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 