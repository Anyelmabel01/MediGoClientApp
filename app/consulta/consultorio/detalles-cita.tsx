import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
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
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';

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
  const { isDarkMode } = useTheme();
  const { appointmentId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const appointment = mockAppointmentDetails[appointmentId as string];

  if (!appointment) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Detalles de Cita</ThemedText>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.light.error} />
          <ThemedText style={[styles.emptyTitle, { color: Colors.light.error }]}>
            Cita no encontrada
          </ThemedText>
          <ThemedText style={[styles.emptyText, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            La cita que buscas no existe o ha sido eliminada
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

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
              Alert.alert('Éxito', 'Cita reprogramada exitosamente');
            }, 1500);
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
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          style: 'destructive',
          onPress: () => {
            setLoading(true);
            // Simular API call
            setTimeout(() => {
              setLoading(false);
              Alert.alert('Éxito', 'Cita cancelada exitosamente');
              router.back();
            }, 1500);
          }
        }
      ]
    );
  };

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
        <ThemedText style={styles.title}>Detalles de Cita</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
            <ThemedText style={styles.statusText}>{getStatusLabel(appointment.status)}</ThemedText>
          </View>
        </View>

        {/* Provider Info */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <View style={styles.providerHeader}>
            <Image 
              source={{ uri: appointment.avatar_url || 'https://via.placeholder.com/80' }}
              style={styles.providerAvatar}
            />
            <View style={styles.providerInfo}>
              <ThemedText style={styles.providerName}>{appointment.provider_name}</ThemedText>
              <ThemedText style={[styles.providerType, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {appointment.provider_type}
              </ThemedText>
              {appointment.organization_name && (
                <ThemedText style={[styles.organizationName, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  {appointment.organization_name}
                </ThemedText>
              )}
              <ThemedText style={[styles.licenseNumber, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                Lic. {appointment.license_number}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Información de la Cita</ThemedText>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.light.primary} />
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Fecha y Hora</ThemedText>
              <ThemedText style={styles.detailValue}>
                {formatDate(appointment.date)} a las {appointment.time}
              </ThemedText>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color={Colors.light.primary} />
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Dirección</ThemedText>
              <ThemedText style={styles.detailValue}>{appointment.full_address}</ThemedText>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={20} color={Colors.light.primary} />
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Motivo de la Consulta</ThemedText>
              <ThemedText style={styles.detailValue}>{appointment.reason}</ThemedText>
            </View>
          </View>

          {appointment.instructions && (
            <View style={styles.detailRow}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.light.primary} />
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Instrucciones</ThemedText>
                <ThemedText style={styles.detailValue}>{appointment.instructions}</ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Payment Information */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Información de Pago</ThemedText>
          
          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={20} color={Colors.light.primary} />
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Costo de Consulta</ThemedText>
              <ThemedText style={[styles.priceText, { color: Colors.light.primary }]}>
                ${appointment.consultation_fee}
              </ThemedText>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="wallet-outline" size={20} color={Colors.light.primary} />
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Método de Pago</ThemedText>
              <ThemedText style={styles.detailValue}>{appointment.payment_method}</ThemedText>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="checkmark-circle-outline" size={20} color={Colors.light.primary} />
            <View style={styles.detailContent}>
              <ThemedText style={styles.detailLabel}>Estado del Pago</ThemedText>
              <ThemedText style={[styles.detailValue, {
                color: appointment.payment_status === 'PAID' ? Colors.light.success : '#f59e0b'
              }]}>
                {appointment.payment_status === 'PAID' ? 'Pagado' : 'Pendiente'}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Documents */}
        {appointment.documents.length > 0 && (
          <View style={[styles.section, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          }]}>
            <ThemedText style={styles.sectionTitle}>Documentos Adjuntos</ThemedText>
            {appointment.documents.map((doc, index) => (
              <View key={index} style={styles.documentItem}>
                <Ionicons name="document-outline" size={20} color={Colors.light.primary} />
                <ThemedText style={styles.documentName}>{doc}</ThemedText>
              </View>
            ))}
          </View>
        )}

        {/* Contact Information */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Contacto</ThemedText>
          
          <TouchableOpacity style={styles.contactButton} onPress={handleCallProvider}>
            <Ionicons name="call-outline" size={20} color={Colors.light.primary} />
            <ThemedText style={[styles.contactText, { color: Colors.light.primary }]}>
              {appointment.phone_number}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.detailRow}>
            <Ionicons name="mail-outline" size={20} color={Colors.light.primary} />
            <ThemedText style={[styles.detailValue, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              {appointment.email}
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionsContainer, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderTopColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.directionsButton]}
          onPress={handleGetDirections}
        >
          <Ionicons name="navigate-outline" size={20} color="white" />
          <ThemedText style={styles.actionButtonText}>Direcciones</ThemedText>
        </TouchableOpacity>

        {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rescheduleButton]}
              onPress={handleReschedule}
              disabled={loading}
            >
              <Ionicons name="calendar-outline" size={20} color="white" />
              <ThemedText style={styles.actionButtonText}>
                {loading ? 'Procesando...' : 'Reprogramar'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Ionicons name="close-outline" size={20} color="white" />
              <ThemedText style={styles.actionButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>
          </>
        )}
      </View>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
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
  providerHeader: {
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
  },
  providerType: {
    fontSize: 16,
    marginBottom: 2,
  },
  organizationName: {
    fontSize: 14,
    marginBottom: 2,
  },
  licenseNumber: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  documentName: {
    fontSize: 14,
    flex: 1,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  directionsButton: {
    backgroundColor: Colors.light.primary,
  },
  rescheduleButton: {
    backgroundColor: '#f59e0b',
  },
  cancelButton: {
    backgroundColor: Colors.light.error,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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