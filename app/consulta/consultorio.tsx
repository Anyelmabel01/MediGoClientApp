import { Colors } from '@/constants/Colors';
import { useAppointments } from '@/context/AppointmentsContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Appointment = {
  id: string;
  fecha: string;
  hora: string;
  nombreProveedor: string;
  tipoProveedor: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
};

export default function ConsultorioScreen() {
  const router = useRouter();
  const { consultorioAppointments } = useAppointments();

  // Convertir las citas del contexto al formato esperado por esta pantalla
  const proximasCitas: Appointment[] = consultorioAppointments
    .filter(apt => {
      const today = new Date();
      const appointmentDate = new Date(apt.date);
      return appointmentDate >= today && (apt.status === 'CONFIRMED' || apt.status === 'PENDING');
    })
    .map(apt => ({
      id: apt.id,
      fecha: new Date(apt.date).toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }),
      hora: apt.time,
      nombreProveedor: apt.provider_name,
      tipoProveedor: apt.provider_type,
      estado: apt.status.toLowerCase() as 'pendiente' | 'confirmada' | 'cancelada' | 'completada',
    }));

  const handleNuevaCita = () => {
    router.push('/consulta/consultorio/buscar-proveedores');
  };

  const handleMisCitas = () => {
    router.push('/consulta/consultorio/mis-citas');
  };

  const handleDetallesCita = (appointment: Appointment) => {
    router.push({
      pathname: '/consulta/consultorio/detalles-cita',
      params: { 
        appointmentId: appointment.id,
        providerId: appointment.id // Using same ID for demo
      }
    });
  };

  const getColorEstado = (estado: Appointment['estado']) => {
    switch (estado) {
      case 'confirmada':
        return '#4CAF50';
      case 'pendiente':
        return '#FF9800';
      case 'cancelada':
        return '#F44336';
      case 'completada':
        return Colors.light.primary;
      default:
        return Colors.light.textSecondary;
    }
  };

  const getTextoEstado = (estado: Appointment['estado']) => {
    switch (estado) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelada':
        return 'Cancelada';
      case 'completada':
        return 'Completada';
      default:
        return 'Desconocido';
    }
  };

  const getIconEstado = (estado: Appointment['estado']) => {
    switch (estado) {
      case 'confirmada':
        return 'checkmark-circle';
      case 'pendiente':
        return 'time';
      case 'cancelada':
        return 'close-circle';
      case 'completada':
        return 'checkmark-done-circle';
      default:
        return 'help-circle';
    }
  };

  const renderItemCita = ({ item }: { item: Appointment }) => (
    <TouchableOpacity 
      style={styles.itemCita}
      onPress={() => handleDetallesCita(item)}
    >
      <View style={styles.citaHeader}>
        <View style={styles.fechaCita}>
          <Text style={styles.diaFecha}>{item.fecha}</Text>
          <Text style={styles.horaCita}>{item.hora}</Text>
        </View>
        <View style={[styles.badgeEstado, { backgroundColor: getColorEstado(item.estado) }]}>
          <Ionicons 
            name={getIconEstado(item.estado) as any} 
            size={12} 
            color="white" 
          />
          <Text style={styles.textoEstado}>{getTextoEstado(item.estado)}</Text>
        </View>
      </View>
      
      <View style={styles.infoCita}>
        <Text style={styles.nombreDoctor}>{item.nombreProveedor}</Text>
        <Text style={styles.especialidadDoctor}>{item.tipoProveedor}</Text>
      </View>
      
      <View style={styles.citaFooter}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDetallesCita(item)}
        >
          <Ionicons name="eye-outline" size={16} color={Colors.light.primary} />
          <Text style={styles.actionButtonText}>Ver detalles</Text>
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={18} color={Colors.light.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.contenedor}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Consultorio</Text>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.primaryActionButton}
          onPress={handleNuevaCita}
        >
          <View style={styles.actionIconContainer}>
            <Ionicons name="add-circle" size={28} color={Colors.light.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Nueva Cita</Text>
            <Text style={styles.actionSubtitle}>Buscar proveedores</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryActionButton}
          onPress={handleMisCitas}
        >
          <View style={styles.actionIconContainer}>
            <Ionicons name="calendar" size={28} color={Colors.light.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Mis Citas</Text>
            <Text style={styles.actionSubtitle}>Ver programadas</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="calendar-outline" size={20} color={Colors.light.primary} />
          </View>
          <Text style={styles.statNumber}>{consultorioAppointments.length}</Text>
          <Text style={styles.statLabel}>Próximas</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="people-outline" size={20} color={Colors.light.primary} />
          </View>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="star-outline" size={20} color={Colors.light.primary} />
          </View>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
      
      {/* Upcoming Appointments */}
      <View style={styles.appointmentsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximas Citas</Text>
          {consultorioAppointments.length > 0 && (
            <TouchableOpacity onPress={handleMisCitas}>
              <Text style={styles.viewAllText}>Ver todas</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {proximasCitas.length > 0 ? (
          <FlatList
            data={proximasCitas}
            renderItem={renderItemCita}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.appointmentsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="calendar-outline" size={48} color={Colors.light.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No tienes citas programadas</Text>
            <Text style={styles.emptySubtitle}>
              Agenda tu primera cita médica hoy mismo
            </Text>
            <TouchableOpacity 
              style={styles.scheduleButton}
              onPress={handleNuevaCita}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text style={styles.scheduleButtonText}>Agendar ahora</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.white,
    flex: 1,
  },
  actionButtonsContainer: {
    padding: 16,
    gap: 10,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  statCard: {
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
    width: 36,
    height: 36,
    borderRadius: 18,
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
  appointmentsSection: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
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
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  appointmentsList: {
    gap: 10,
  },
  itemCita: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  fechaCita: {
    flex: 1,
  },
  diaFecha: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: Colors.light.primary,
  },
  horaCita: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  badgeEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  textoEstado: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  infoCita: {
    marginBottom: 10,
  },
  nombreDoctor: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 3,
    color: Colors.light.textPrimary,
  },
  especialidadDoctor: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  citaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.primary + '20',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 6,
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 