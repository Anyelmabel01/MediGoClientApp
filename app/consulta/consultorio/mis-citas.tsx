import { BottomNavbar } from '@/components/BottomNavbar';
import { LocationSelector } from '@/components/LocationSelector';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserProfile } from '@/components/UserProfile';
import { Colors } from '@/constants/Colors';
import { UserLocation } from '@/constants/UserModel';
import { useAppointments } from '@/context/AppointmentsContext';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

export default function MisCitasScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user, currentLocation, setCurrentLocation } = useUser();
  const { consultorioAppointments } = useAppointments();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  // Convertir las citas del contexto al formato esperado por esta pantalla
  const mockAppointments: Appointment[] = consultorioAppointments.map(apt => ({
    id: apt.id,
    date: apt.date,
    time: apt.time,
    provider_name: apt.provider_name,
    provider_type: apt.provider_type,
    organization_name: apt.organization_name,
    status: apt.status,
    location: apt.location,
    consultation_fee: apt.consultation_fee,
  }));

  const handleLocationSelect = (location: UserLocation) => {
    setCurrentLocation(location);
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return '#4CAF50';
      case 'PENDING':
        return '#FF9800';
      case 'COMPLETED':
        return Colors.light.primary;
      case 'CANCELLED':
        return '#F44336';
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
            size={12} 
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
          <Ionicons name="location-outline" size={14} color={Colors.light.primary} />
          <Text style={styles.detailText}>
            {item.location}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={14} color={Colors.light.primary} />
          <Text style={styles.detailText}>
            Bs. {item.consultation_fee}
          </Text>
        </View>
      </View>
      
      <View style={styles.appointmentFooter}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleViewAppointment(item)}
        >
          <Ionicons name="eye-outline" size={14} color={Colors.light.primary} />
          <Text style={styles.actionButtonText}>
            Ver detalles
          </Text>
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={18} color={Colors.light.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Citas</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Header */}
        <View style={styles.statsHeader}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="calendar" size={18} color={Colors.light.primary} />
            </View>
            <ThemedText style={styles.statNumber}>
              {mockAppointments.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>
              Total
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={18} color={Colors.light.primary} />
            </View>
            <ThemedText style={styles.statNumber}>
              {mockAppointments.filter(apt => apt.status === 'PENDING' || apt.status === 'CONFIRMED').length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>
              Próximas
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-done" size={18} color={Colors.light.primary} />
            </View>
            <ThemedText style={styles.statNumber}>
              {mockAppointments.filter(apt => apt.status === 'COMPLETED').length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>
              Completadas
            </ThemedText>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>
            Historial de Citas
          </ThemedText>
          <TouchableOpacity 
            style={styles.newAppointmentButton}
            onPress={() => router.push('/consulta/consultorio/buscar-proveedores')}
          >
            <Ionicons name="add" size={14} color="white" />
            <ThemedText style={styles.newAppointmentButtonText}>
              Nueva cita
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Appointments List */}
        <FlatList
          data={mockAppointments}
          renderItem={renderAppointment}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="calendar-outline" size={48} color={Colors.light.textSecondary} />
              </View>
              <ThemedText style={styles.emptyTitle}>
                No tienes citas registradas
              </ThemedText>
              <ThemedText style={styles.emptyText}>
                Agenda tu primera cita médica para comenzar
              </ThemedText>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => router.push('/consulta/consultorio/buscar-proveedores')}
              >
                <Ionicons name="add" size={18} color="white" />
                <ThemedText style={styles.emptyButtonText}>
                  Agendar primera cita
                </ThemedText>
              </TouchableOpacity>
            </View>
          }
        />
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
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 58,
    left: 24,
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  statItem: {
    flex: 1,
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    color: Colors.light.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  newAppointmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  newAppointmentButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    height: 10,
  },
  appointmentCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateTimeContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
    color: Colors.light.primary,
    textTransform: 'capitalize',
  },
  timeText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  appointmentInfo: {
    marginBottom: 10,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
    color: Colors.light.textPrimary,
  },
  providerType: {
    fontSize: 13,
    marginBottom: 2,
    color: Colors.light.textSecondary,
  },
  organizationName: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  appointmentDetails: {
    gap: 6,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  appointmentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.primary + '20',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    color: Colors.light.textPrimary,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 6,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 