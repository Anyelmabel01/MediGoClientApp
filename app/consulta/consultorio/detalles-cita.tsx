import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

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

type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

type AppointmentDetail = {
  id: string;
  date: string;
  time: string;
  provider_name: string;
  provider_type: string;
  organization_name?: string;
  status: AppointmentStatus;
  address: string;
  full_address: string;
  consultation_fee: number;
  avatar_url?: string;
  reason: string;
  phone_number: string;
  email: string;
  license_number: string;
  instructions?: string;
  documents: string[];
  payment_method: string;
  payment_status: 'PENDING' | 'PAID' | 'REFUNDED';
};

// Mock data - en una implementación real esto vendría de una API
const mockAppointmentDetails: Record<string, AppointmentDetail> = {
  '1': {
    id: '1',
    date: '2024-12-28',
    time: '10:00 AM',
    provider_name: 'Dr. María González',
    provider_type: 'Cardiólogo',
    organization_name: 'Centro Médico Integral',
    status: 'CONFIRMED',
    address: 'Av. Reforma 123, Col. Roma Norte',
    full_address: 'Av. Reforma 123, Col. Roma Norte, Delegación Cuauhtémoc, 06700 Ciudad de México, CDMX',
    consultation_fee: 800,
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    reason: 'Revisión cardiológica de rutina',
    phone_number: '+52 55 1234 5678',
    email: 'consultas@centromedicointegral.com',
    license_number: 'CDL12345',
    instructions: 'Favor de llegar 15 minutos antes de la cita. Traer estudios previos si los tiene.',
    documents: ['Electrocardiograma previo', 'Análisis de sangre'],
    payment_method: 'Tarjeta de crédito',
    payment_status: 'PAID'
  },
  '2': {
    id: '2',
    date: '2024-12-30',
    time: '3:30 PM',
    provider_name: 'Dr. Carlos Ramírez',
    provider_type: 'Médico General',
    organization_name: 'Clínica San Miguel',
    status: 'PENDING',
    address: 'Calle Condesa 456, Col. Condesa',
    full_address: 'Calle Condesa 456, Col. Condesa, Delegación Cuauhtémoc, 06140 Ciudad de México, CDMX',
    consultation_fee: 600,
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    reason: 'Consulta general',
    phone_number: '+52 55 9876 5432',
    email: 'citas@clinicasanmiguel.com',
    license_number: 'GDL67890',
    instructions: 'Presentarse en ayunas para toma de muestras.',
    documents: [],
    payment_method: 'Efectivo',
    payment_status: 'PENDING'
  }
};

export default function DetallesCitaScreen() {
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const appointment = mockAppointmentDetails[appointmentId as string];

  if (!appointment) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Detalles de Cita</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={[styles.emptyTitle, { color: COLORS.error }]}>
            Cita no encontrada
          </Text>
          <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>
            La cita que buscas no existe o ha sido eliminada
          </Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return COLORS.success;
      case 'PENDING':
        return COLORS.warning;
      case 'CANCELLED':
        return COLORS.error;
      case 'COMPLETED':
        return COLORS.primary;
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
      case 'CANCELLED':
        return 'Cancelada';
      case 'COMPLETED':
        return 'Completada';
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
      case 'CANCELLED':
        return 'close-circle';
      case 'COMPLETED':
        return 'checkmark-done-circle';
      default:
        return 'help-circle';
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

  const handleCallProvider = () => {
    const phoneUrl = `tel:${appointment.phone_number}`;
    Linking.canOpenURL(phoneUrl).then(supported => {
      if (supported) {
        Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'No se puede realizar la llamada desde este dispositivo');
      }
    });
  };

  const handleGetDirections = () => {
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(appointment.full_address)}`;
    Linking.canOpenURL(mapsUrl).then(supported => {
      if (supported) {
        Linking.openURL(mapsUrl);
      } else {
        Alert.alert('Error', 'No se puede abrir el mapa desde este dispositivo');
      }
    });
  };

  const handleReschedule = () => {
    Alert.alert(
      'Reprogramar Cita',
      '¿Estás seguro de que quieres reprogramar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Reprogramar', 
          onPress: () => {
            setLoading(true);
            // Simular API call
            setTimeout(() => {
              setLoading(false);
              Alert.alert('Éxito', 'Tu solicitud de reprogramación ha sido enviada');
            }, 2000);
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Cita',
      '¿Estás seguro de que quieres cancelar esta cita? Esta acción no se puede deshacer.',
      [
        { text: 'No cancelar', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          style: 'destructive',
          onPress: () => {
            setLoading(true);
            // Simular API call
            setTimeout(() => {
              setLoading(false);
              Alert.alert('Cita cancelada', 'Tu cita ha sido cancelada exitosamente');
              router.back();
            }, 2000);
          }
        }
      ]
    );
  };

  const handleRate = () => {
    router.push({
      pathname: '/consulta/consultorio/calificar-cita',
      params: { 
        appointmentId: appointment.id,
        providerId: appointment.id
      }
    });
  };

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
        <Text style={styles.title}>Detalles de Cita</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
              <Ionicons 
                name={getStatusIcon(appointment.status) as any} 
                size={16} 
                color="white" 
              />
              <Text style={styles.statusText}>
                {getStatusLabel(appointment.status)}
              </Text>
            </View>
          </View>
          
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentDate}>
              {formatDate(appointment.date)}
            </Text>
            <Text style={styles.appointmentTime}>
              {appointment.time}
            </Text>
          </View>
        </View>

        {/* Provider Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Proveedor</Text>
          
          <View style={styles.providerCard}>
            <Image 
              source={{ uri: appointment.avatar_url || 'https://via.placeholder.com/80' }}
              style={styles.providerAvatar}
            />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>
                {appointment.provider_name}
              </Text>
              <Text style={styles.providerType}>
                {appointment.provider_type}
              </Text>
              {appointment.organization_name && (
                <Text style={styles.organizationName}>
                  {appointment.organization_name}
                </Text>
              )}
              <Text style={styles.licenseNumber}>
                Cédula: {appointment.license_number}
              </Text>
            </View>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles de la Consulta</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Fecha y hora</Text>
                <Text style={styles.detailValue}>
                  {formatDate(appointment.date)} • {appointment.time}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Dirección</Text>
                <Text style={styles.detailValue}>
                  {appointment.address}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="medical-outline" size={20} color={COLORS.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Motivo de consulta</Text>
                <Text style={styles.detailValue}>
                  {appointment.reason}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Costo de consulta</Text>
                <Text style={styles.detailValue}>
                  ${appointment.consultation_fee}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Pago</Text>
          
          <View style={styles.paymentContainer}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Método de pago:</Text>
              <Text style={styles.paymentValue}>
                {appointment.payment_method}
              </Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Estado del pago:</Text>
              <View style={[
                styles.paymentStatusBadge,
                { backgroundColor: appointment.payment_status === 'PAID' ? COLORS.success : COLORS.warning }
              ]}>
                <Text style={styles.paymentStatusText}>
                  {appointment.payment_status === 'PAID' ? 'Pagado' : 'Pendiente'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Instructions */}
        {appointment.instructions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instrucciones</Text>
            <View style={styles.instructionsContainer}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.instructionsText}>
                {appointment.instructions}
              </Text>
            </View>
          </View>
        )}

        {/* Documents */}
        {appointment.documents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documentos</Text>
            {appointment.documents.map((document, index) => (
              <View key={index} style={styles.documentItem}>
                <Ionicons name="document-outline" size={20} color={COLORS.primary} />
                <Text style={styles.documentText}>
                  {document}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Contact Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          
          <View style={styles.contactActions}>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleCallProvider}
            >
              <Ionicons name="call" size={20} color={COLORS.primary} />
              <Text style={styles.contactButtonText}>Llamar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleGetDirections}
            >
              <Ionicons name="navigate" size={20} color={COLORS.primary} />
              <Text style={styles.contactButtonText}>Cómo llegar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        {appointment.status === 'COMPLETED' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.rateButton]}
            onPress={handleRate}
          >
            <Ionicons name="star" size={20} color="white" />
            <Text style={styles.actionButtonText}>Calificar consulta</Text>
          </TouchableOpacity>
        )}
        
        {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
          <View style={styles.appointmentActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rescheduleButton]}
              onPress={handleReschedule}
              disabled={loading}
            >
              <Ionicons name="calendar" size={20} color="white" />
              <Text style={styles.actionButtonText}>
                {loading ? 'Procesando...' : 'Reprogramar'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Ionicons name="close" size={20} color="white" />
              <Text style={styles.actionButtonText}>
                Cancelar cita
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  appointmentInfo: {
    alignItems: 'center',
  },
  appointmentDate: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.textPrimary,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  appointmentTime: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.textPrimary,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.textPrimary,
  },
  providerType: {
    fontSize: 16,
    marginBottom: 4,
    color: COLORS.textSecondary,
  },
  organizationName: {
    fontSize: 14,
    marginBottom: 4,
    color: COLORS.textSecondary,
  },
  licenseNumber: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: COLORS.textPrimary,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  paymentContainer: {
    gap: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  paymentValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  paymentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 8,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  documentText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    flex: 1,
  },
  rateButton: {
    backgroundColor: COLORS.warning,
  },
  rescheduleButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 