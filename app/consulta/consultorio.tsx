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

type Appointment = {
  id: string;
  fecha: string;
  hora: string;
  nombreProveedor: string;
  tipoProveedor: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
};

// Datos de ejemplo
const proximasCitas: Appointment[] = [
  {
    id: '1',
    fecha: '28 Dic 2024',
    hora: '10:00 AM',
    nombreProveedor: 'Dr. María González',
    tipoProveedor: 'Cardióloga',
    estado: 'confirmada',
  },
  {
    id: '2',
    fecha: '30 Dic 2024',
    hora: '3:30 PM',
    nombreProveedor: 'Dr. Carlos Ramírez',
    tipoProveedor: 'Médico General',
    estado: 'pendiente',
  },
];

export default function ConsultorioScreen() {
  const router = useRouter();

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
        return COLORS.success;
      case 'pendiente':
        return COLORS.warning;
      case 'cancelada':
        return COLORS.error;
      case 'completada':
        return COLORS.primary;
      default:
        return COLORS.textSecondary;
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
            size={14} 
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
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDetallesCita(item)}
          >
            <Ionicons name="eye-outline" size={16} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Ver detalles</Text>
          </TouchableOpacity>
          {item.estado === 'completada' && (
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
    <View style={styles.contenedor}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.cabecera}>
        <TouchableOpacity 
          style={styles.botonRegresar}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.titulo}>Consultorio</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeContent}>
          <View style={styles.welcomeInfo}>
            <Text style={styles.welcomeTitle}>¡Bienvenido al Consultorio!</Text>
            <Text style={styles.welcomeSubtitle}>
              Agenda citas con los mejores médicos cerca de ti
            </Text>
          </View>
          <View style={styles.welcomeIcon}>
            <View style={styles.iconContainer}>
              <Ionicons name="medical" size={32} color={COLORS.primary} />
            </View>
          </View>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.contenedorBotones}>
        <TouchableOpacity 
          style={[styles.botonAccion, styles.botonPrimario]}
          onPress={handleNuevaCita}
        >
          <View style={styles.botonContent}>
            <View style={styles.botonIconContainer}>
              <Ionicons name="add-circle" size={24} color="white" />
            </View>
            <View style={styles.botonTextContainer}>
              <Text style={styles.botonTitulo}>Nueva Cita</Text>
              <Text style={styles.botonSubtitulo}>Buscar proveedores</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.botonAccion, styles.botonSecundario]}
          onPress={handleMisCitas}
        >
          <View style={styles.botonContent}>
            <View style={styles.botonIconContainer}>
              <Ionicons name="calendar" size={24} color="white" />
            </View>
            <View style={styles.botonTextContainer}>
              <Text style={styles.botonTitulo}>Mis Citas</Text>
              <Text style={styles.botonSubtitulo}>Ver programadas</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="calendar-outline" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>{proximasCitas.length}</Text>
          <Text style={styles.statLabel}>Próximas citas</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="people-outline" size={24} color={COLORS.success} />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Doctores favoritos</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="star-outline" size={24} color={COLORS.warning} />
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Calificación promedio</Text>
        </View>
      </View>
      
      {/* Upcoming Appointments */}
      <View style={styles.seccionProximas}>
        <View style={styles.seccionHeader}>
          <Text style={styles.tituloSeccion}>Próximas Citas</Text>
          {proximasCitas.length > 0 && (
            <TouchableOpacity onPress={handleMisCitas}>
              <Text style={styles.verTodas}>Ver todas</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {proximasCitas.length > 0 ? (
          <FlatList
            data={proximasCitas}
            renderItem={renderItemCita}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listaCitas}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.estadoVacio}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="calendar-outline" size={64} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.textoVacio}>No tienes citas programadas</Text>
            <Text style={styles.subtextoVacio}>
              Agenda tu primera cita médica hoy mismo
            </Text>
            <TouchableOpacity 
              style={styles.botonAgendar}
              onPress={handleNuevaCita}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.botonAgendarText}>Agendar ahora</Text>
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
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  botonRegresar: {
    padding: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: COLORS.textPrimary,
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  welcomeCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeInfo: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.textPrimary,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  welcomeIcon: {
    marginLeft: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenedorBotones: {
    padding: 16,
    gap: 12,
  },
  botonAccion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  botonPrimario: {
    backgroundColor: COLORS.primary,
  },
  botonSecundario: {
    backgroundColor: COLORS.primaryDark,
  },
  botonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  botonIconContainer: {
    marginRight: 16,
  },
  botonTextContainer: {
    flex: 1,
  },
  botonTitulo: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  botonSubtitulo: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
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
    marginTop: 8,
    marginBottom: 4,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  seccionProximas: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  seccionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tituloSeccion: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  verTodas: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  listaCitas: {
    gap: 12,
  },
  itemCita: {
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
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fechaCita: {
    flex: 1,
  },
  diaFecha: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: COLORS.textPrimary,
  },
  horaCita: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  badgeEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  textoEstado: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoCita: {
    marginBottom: 12,
  },
  nombreDoctor: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: COLORS.textPrimary,
  },
  especialidadDoctor: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  citaFooter: {
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
  estadoVacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  textoVacio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtextoVacio: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  botonAgendar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  botonAgendarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 