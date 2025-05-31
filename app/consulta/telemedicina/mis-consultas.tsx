import { Colors } from '@/constants/Colors';
import { useAppointments } from '@/context/AppointmentsContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';

// Login color palette
const PRIMARY_COLOR = '#00A0B0';
const PRIMARY_LIGHT = '#33b5c2';
const PRIMARY_DARK = '#006070';
const ACCENT_COLOR = '#70D0E0';

type ConsultationStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

type VirtualConsultation = {
  id: string;
  date: string;
  time: string;
  specialist_name: string;
  specialty: string;
  avatar_url?: string;
  status: ConsultationStatus;
  meeting_link?: string;
  can_join: boolean;
  prescription_count: number;
  notes?: string;
  consultation_fee: number;
};

export default function MisConsultasTelemedicina() {
  const router = useRouter();
  const { telemedicineAppointments } = useAppointments();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  // Estados para modales personalizados
  const [showJoinErrorModal, setShowJoinErrorModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<VirtualConsultation | null>(null);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'info' });

  // Convertir las citas del contexto al formato esperado por esta pantalla
  const allConsultations: VirtualConsultation[] = telemedicineAppointments.map(apt => ({
    id: apt.id,
    date: apt.date,
    time: apt.time,
    specialist_name: apt.specialist_name,
    specialty: apt.specialty,
    avatar_url: apt.avatar_url,
    status: apt.status,
    can_join: apt.can_join || false,
    prescription_count: apt.prescription_count || 0,
    notes: apt.notes,
    consultation_fee: apt.consultation_fee
  }));

  const upcomingConsultations = allConsultations.filter(
    c => c.status === 'PENDING' || c.status === 'CONFIRMED' || c.status === 'IN_PROGRESS'
  );
  
  const pastConsultations = allConsultations.filter(
    c => c.status === 'COMPLETED' || c.status === 'CANCELLED'
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleJoinConsultation = (consultation: VirtualConsultation) => {
    if (consultation.can_join) {
      router.push({
        pathname: '/consulta/telemedicina/sala-espera',
        params: { 
          consultationId: consultation.id,
          specialistId: consultation.specialist_name,
          appointmentTime: consultation.time,
          specialistName: consultation.specialist_name,
          specialty: consultation.specialty
        }
      });
    } else {
      setSelectedConsultation(consultation);
      setShowJoinErrorModal(true);
    }
  };

  const handleReschedule = (id: string) => {
    setSelectedConsultation({ id, date: '', time: '', specialist_name: '', specialty: '', status: 'PENDING', can_join: false, prescription_count: 0, consultation_fee: 0 });
    setShowRescheduleModal(true);
  };

  const handleCancel = (id: string) => {
    setSelectedConsultation({ id, date: '', time: '', specialist_name: '', specialty: '', status: 'PENDING', can_join: false, prescription_count: 0, consultation_fee: 0 });
    setShowCancelModal(true);
  };

  const getStatusColor = (status: ConsultationStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return '#10b981';
      case 'PENDING':
        return '#f59e0b';
      case 'IN_PROGRESS':
        return PRIMARY_COLOR;
      case 'COMPLETED':
        return '#6b7280';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return Colors.light.textSecondary;
    }
  };

  const getStatusLabel = (status: ConsultationStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'PENDING':
        return 'Pendiente';
      case 'IN_PROGRESS':
        return 'En progreso';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const renderConsultation = ({ item }: { item: VirtualConsultation }) => (
    <View style={[styles.consultationCard, {
      backgroundColor: Colors.light.background,
    }]}>
      <View style={styles.consultationHeader}>
        <Image source={{ uri: item.avatar_url }} style={styles.specialistAvatar} />
        <View style={styles.consultationInfo}>
          <ThemedText style={styles.specialistName}>{item.specialist_name}</ThemedText>
          <ThemedText style={[styles.specialty, {
            color: Colors.light.textSecondary
          }]}>
            {item.specialty}
          </ThemedText>
          <View style={styles.dateTimeContainer}>
            <Ionicons name="calendar-outline" size={14} color={PRIMARY_COLOR} />
            <ThemedText style={[styles.dateTime, {
              color: Colors.light.textSecondary
            }]}>
              {new Date(item.date).toLocaleDateString('es-ES')} - {item.time}
            </ThemedText>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <ThemedText style={styles.statusText}>{getStatusLabel(item.status)}</ThemedText>
          </View>
          <ThemedText style={[styles.fee, { color: PRIMARY_COLOR }]}>
            ${item.consultation_fee}
          </ThemedText>
        </View>
      </View>

      {item.notes && (
        <View style={styles.notesContainer}>
          <Ionicons name="document-text-outline" size={16} color={PRIMARY_COLOR} />
          <ThemedText style={[styles.notes, {
            color: Colors.light.textSecondary
          }]}>
            {item.notes}
          </ThemedText>
        </View>
      )}

      {item.prescription_count > 0 && (
        <View style={styles.prescriptionInfo}>
          <Ionicons name="medical-outline" size={16} color="#10b981" />
          <ThemedText style={[styles.prescriptionText, { color: '#10b981' }]}>
            {item.prescription_count} receta{item.prescription_count > 1 ? 's' : ''} generada{item.prescription_count > 1 ? 's' : ''}
          </ThemedText>
        </View>
      )}

      <View style={styles.consultationActions}>
        {activeTab === 'upcoming' ? (
          <>
            {item.can_join && (
              <TouchableOpacity 
                style={[styles.joinButton, { backgroundColor: PRIMARY_COLOR }]}
                onPress={() => handleJoinConsultation(item)}
              >
                <Ionicons name="videocam" size={16} color="white" />
                <ThemedText style={styles.joinButtonText}>Unirse</ThemedText>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.actionButton, { 
                borderColor: Colors.light.border 
              }]}
              onPress={() => handleReschedule(item.id)}
            >
              <Ionicons name="calendar" size={16} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.actionButtonText, { color: PRIMARY_COLOR }]}>
                Reprogramar
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: '#ef4444' }]}
              onPress={() => handleCancel(item.id)}
            >
              <Ionicons name="close" size={16} color="#ef4444" />
              <ThemedText style={[styles.actionButtonText, { color: '#ef4444' }]}>
                Cancelar
              </ThemedText>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, { 
                borderColor: Colors.light.border 
              }]}
              onPress={() => {
                setModalConfig({ 
                  title: 'Ver detalles', 
                  message: 'Función en desarrollo', 
                  type: 'info' 
                });
                setShowFeatureModal(true);
              }}
            >
              <Ionicons name="eye" size={16} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.actionButtonText, { color: PRIMARY_COLOR }]}>
                Ver detalles
              </ThemedText>
            </TouchableOpacity>
            {item.prescription_count > 0 && (
              <TouchableOpacity 
                style={[styles.actionButton, { 
                  borderColor: Colors.light.border 
                }]}
                onPress={() => {
                  setModalConfig({ 
                    title: 'Descargar recetas', 
                    message: 'Función en desarrollo', 
                    type: 'info' 
                  });
                  setShowFeatureModal(true);
                }}
              >
                <Ionicons name="download" size={16} color={PRIMARY_COLOR} />
                <ThemedText style={[styles.actionButtonText, { color: PRIMARY_COLOR }]}>
                  Recetas
                </ThemedText>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.actionButton, { 
                borderColor: Colors.light.border 
              }]}
              onPress={() => {
                setModalConfig({ 
                  title: 'Calificar', 
                  message: 'Función en desarrollo', 
                  type: 'info' 
                });
                setShowFeatureModal(true);
              }}
            >
              <Ionicons name="star" size={16} color="#f59e0b" />
              <ThemedText style={[styles.actionButtonText, { color: '#f59e0b' }]}>
                Calificar
              </ThemedText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header simplificado */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Mis Consultas</ThemedText>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <ThemedText style={styles.screenTitle}>Mis Consultas de Telemedicina</ThemedText>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'upcoming' && styles.activeTab
            ]}
            onPress={() => setActiveTab('upcoming')}
          >
            <ThemedText style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText
            ]}>
              Próximas
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'past' && styles.activeTab
            ]}
            onPress={() => setActiveTab('past')}
          >
            <ThemedText style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText
            ]}>
              Historial
            </ThemedText>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={activeTab === 'upcoming' ? upcomingConsultations : pastConsultations}
          renderItem={renderConsultation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.consultationsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.light.primary]}
              tintColor={Colors.light.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar" size={64} color={Colors.light.textSecondary} />
              <ThemedText style={styles.emptyStateTitle}>
                No hay consultas {activeTab === 'upcoming' ? 'programadas' : 'pasadas'}
              </ThemedText>
              <ThemedText style={styles.emptyStateText}>
                {activeTab === 'upcoming' 
                  ? 'Programa una consulta con un especialista'
                  : 'Tu historial de consultas aparecerá aquí'
                }
              </ThemedText>
            </View>
          }
        />
      </View>

      {/* Modal de Error de Conexión */}
      <Modal
        visible={showJoinErrorModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowJoinErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="alert-circle" size={48} color="#ef4444" />
            </View>
            <ThemedText style={styles.modalTitle}>No disponible</ThemedText>
            <ThemedText style={styles.modalMessage}>
              La consulta aún no está disponible para unirse. Por favor espera hasta 5 minutos antes de la hora programada.
            </ThemedText>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowJoinErrorModal(false)}
            >
              <ThemedText style={styles.modalButtonText}>Entendido</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Reprogramar */}
      <Modal
        visible={showRescheduleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRescheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="calendar" size={48} color={PRIMARY_COLOR} />
            </View>
            <ThemedText style={styles.modalTitle}>Reprogramar Consulta</ThemedText>
            <ThemedText style={styles.modalMessage}>
              ¿Estás seguro de que quieres reprogramar esta consulta? Te contactaremos para coordinar una nueva fecha y hora.
            </ThemedText>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowRescheduleModal(false)}
              >
                <ThemedText style={styles.modalCancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={() => {
                  setShowRescheduleModal(false);
                  setModalConfig({ 
                    title: 'Solicitud enviada', 
                    message: 'Tu solicitud de reprogramación ha sido enviada. Te contactaremos pronto para coordinar la nueva fecha.', 
                    type: 'success' 
                  });
                  setShowSuccessModal(true);
                }}
              >
                <Ionicons name="checkmark" size={20} color="white" />
                <ThemedText style={styles.modalConfirmButtonText}>Reprogramar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Cancelar */}
      <Modal
        visible={showCancelModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="close-circle" size={48} color="#ef4444" />
            </View>
            <ThemedText style={styles.modalTitle}>Cancelar Consulta</ThemedText>
            <ThemedText style={styles.modalMessage}>
              ¿Estás seguro de que quieres cancelar esta consulta? Esta acción no se puede deshacer y podrían aplicar cargos según nuestra política.
            </ThemedText>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowCancelModal(false)}
              >
                <ThemedText style={styles.modalCancelButtonText}>No, mantener</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalConfirmButton, { backgroundColor: '#ef4444' }]}
                onPress={() => {
                  setShowCancelModal(false);
                  setModalConfig({ 
                    title: 'Consulta cancelada', 
                    message: 'Tu consulta ha sido cancelada exitosamente. Si tienes dudas, contacta a soporte.', 
                    type: 'success' 
                  });
                  setShowSuccessModal(true);
                }}
              >
                <Ionicons name="close" size={20} color="white" />
                <ThemedText style={styles.modalConfirmButtonText}>Sí, cancelar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Éxito/Info */}
      <Modal
        visible={showSuccessModal || showFeatureModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setShowSuccessModal(false);
          setShowFeatureModal(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons 
                name={modalConfig.type === 'success' ? 'checkmark-circle' : 'information-circle'} 
                size={48} 
                color={modalConfig.type === 'success' ? '#10b981' : PRIMARY_COLOR} 
              />
            </View>
            <ThemedText style={styles.modalTitle}>{modalConfig.title}</ThemedText>
            <ThemedText style={styles.modalMessage}>{modalConfig.message}</ThemedText>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                setShowFeatureModal(false);
              }}
            >
              <ThemedText style={styles.modalButtonText}>Entendido</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingBottom: 80,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  activeTabText: {
    color: Colors.light.white,
  },
  consultationsList: {
    paddingBottom: 20,
  },
  consultationCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  consultationHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  specialistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  consultationInfo: {
    flex: 1,
  },
  specialistName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    marginBottom: 6,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateTime: {
    fontSize: 12,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  fee: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
    padding: 12,
    backgroundColor: PRIMARY_COLOR + '10',
    borderRadius: 8,
  },
  notes: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  prescriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  prescriptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  consultationActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 45,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.white,
    marginLeft: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.light.white,
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  modalCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  modalCancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  modalConfirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY_COLOR,
  },
  modalConfirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.white,
    textAlign: 'center',
  },
  modalButton: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY_COLOR,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.white,
    textAlign: 'center',
  },
}); 