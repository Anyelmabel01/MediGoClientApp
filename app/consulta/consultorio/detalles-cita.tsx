import { BottomNavbar } from '@/components/BottomNavbar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    Image,
    Linking,
    Platform,
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
    payment_method: 'Débito o Crédito',
    payment_status: 'PENDING'
  }
};

export default function DetallesCitaScreen() {
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const appointment = mockAppointmentDetails[appointmentId as string];

  if (!appointment) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style="auto" />
        
        {/* Simplified Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <ThemedText style={styles.headerTitle}>Detalles de Cita</ThemedText>
          </View>
          
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
      </ThemedView>
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
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Simplified Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <ThemedText style={styles.headerTitle}>Detalles de Cita</ThemedText>
        </View>
        
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status and Date Card */}
        <View style={styles.mainCard}>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
              <Ionicons 
                name={getStatusIcon(appointment.status) as any} 
                size={14} 
                color="white" 
              />
              <Text style={styles.statusText}>
                {getStatusLabel(appointment.status)}
              </Text>
            </View>
          </View>
          
          <View style={styles.dateTimeContainer}>
            <Text style={styles.appointmentDate}>
              {formatDate(appointment.date)}
            </Text>
            <Text style={styles.appointmentTime}>
              {appointment.time}
            </Text>
          </View>
        </View>

        {/* Provider Card */}
        <View style={styles.providerCard}>
          <View style={styles.providerHeader}>
            <Text style={styles.sectionTitle}>Información del Proveedor</Text>
          </View>
          
          <View style={styles.providerContent}>
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

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Detalles de la Consulta</Text>
          
          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={18} color={Colors.light.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Fecha y hora</Text>
                <Text style={styles.detailValue}>
                  {formatDate(appointment.date)} • {appointment.time}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="location-outline" size={18} color={Colors.light.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Dirección</Text>
                <Text style={styles.detailValue}>
                  {appointment.address}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="medical-outline" size={18} color={Colors.light.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Motivo de consulta</Text>
                <Text style={styles.detailValue}>
                  {appointment.reason}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="cash-outline" size={18} color={Colors.light.primary} />
              </View>
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
        <View style={styles.paymentCard}>
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
          <View style={styles.instructionsCard}>
            <Text style={styles.sectionTitle}>Instrucciones</Text>
            <View style={styles.instructionsContainer}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.light.primary} />
              <Text style={styles.instructionsText}>
                {appointment.instructions}
              </Text>
            </View>
          </View>
        )}

        {/* Documents */}
        {appointment.documents.length > 0 && (
          <View style={styles.documentsCard}>
            <Text style={styles.sectionTitle}>Documentos</Text>
            <View style={styles.documentsContainer}>
              {appointment.documents.map((document, index) => (
                <View key={index} style={styles.documentItem}>
                  <Ionicons name="document-outline" size={20} color={Colors.light.primary} />
                  <Text style={styles.documentText}>
                    {document}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact Actions */}
        <View style={styles.contactCard}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          
          <View style={styles.contactActions}>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleCallProvider}
            >
              <Ionicons name="call" size={20} color={Colors.light.white} />
              <Text style={styles.contactButtonText}>Llamar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleGetDirections}
            >
              <Ionicons name="navigate" size={20} color={Colors.light.white} />
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

      <BottomNavbar />
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
    paddingTop: 45,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 100,
  },
  mainCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  dateTimeContainer: {
    alignItems: 'center',
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    color: Colors.light.text,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  appointmentTime: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  providerCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 12,
  },
  providerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    color: Colors.light.text,
  },
  providerType: {
    fontSize: 14,
    marginBottom: 2,
    color: Colors.light.textSecondary,
  },
  organizationName: {
    fontSize: 12,
    marginBottom: 2,
    color: Colors.light.textSecondary,
  },
  licenseNumber: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  detailsCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  detailsList: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
    color: Colors.light.text,
  },
  detailValue: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  paymentCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  paymentContainer: {
    gap: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  paymentValue: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  paymentStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  paymentStatusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  instructionsCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 10,
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 6,
  },
  instructionsText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.light.textSecondary,
  },
  documentsCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  documentsContainer: {
    gap: 8,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 6,
    marginBottom: 4,
  },
  documentText: {
    flex: 1,
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: '500',
  },
  contactCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.white,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
    flex: 1,
  },
  rateButton: {
    backgroundColor: COLORS.warning,
  },
  rescheduleButton: {
    backgroundColor: Colors.light.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
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