import { Colors } from '@/constants/Colors';
import { useAppointments } from '@/context/AppointmentsContext';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';

const { width } = Dimensions.get('window');

// Login color palette
const PRIMARY_COLOR = '#00A0B0';
const PRIMARY_LIGHT = '#33b5c2';
const PRIMARY_DARK = '#006070';
const ACCENT_COLOR = '#70D0E0';

export default function SalaEsperaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { appointments } = useAppointments();
  const { consultationId, specialistId, appointmentTime, specialistName, specialty } = useLocalSearchParams();
  
  const [appointment, setAppointment] = useState<any>(null);
  const [zoomUrl, setZoomUrl] = useState<string>('');
  const [isReady, setIsReady] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  useEffect(() => {
    // Buscar la cita para obtener información de Zoom
    const findAppointment = appointments.find(apt => 
      apt.type === 'telemedicine' && 
      (apt.id === consultationId || apt.specialist_id === specialistId)
    );

    if (findAppointment && findAppointment.type === 'telemedicine') {
      setAppointment(findAppointment);
      
      if (findAppointment.zoom_join_url) {
        setZoomUrl(findAppointment.zoom_join_url);
        console.log('URL de Zoom encontrada:', findAppointment.zoom_join_url);
      }
    }

    // Auto-habilitar después de 3 segundos
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [consultationId, specialistId, appointments]);

  const handleJoinCall = async () => {
    if (!zoomUrl) {
      Alert.alert(
        'Error',
        'No se encontró el enlace de la reunión de Zoom para esta consulta.',
        [
          { text: 'Volver', onPress: () => router.back() }
        ]
      );
      return;
    }

    try {
      // Verificar si es una URL de prueba (desarrollo)
      if (zoomUrl.includes('zoom.us/test')) {
        setShowModal(true);
        return;
      }

      // Intentar abrir directamente en la app de Zoom (para reuniones reales)
      const canOpen = await Linking.canOpenURL(zoomUrl);
      
      if (canOpen) {
        setShowModal(true);
      } else {
        setShowDownloadModal(true);
      }
    } catch (error) {
      console.error('Error verificando Zoom:', error);
      Alert.alert('Error', 'Hubo un problema al intentar conectar con Zoom');
    }
  };

  const handleInstallZoom = () => {
    setShowDownloadModal(true);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleModalContinue = async () => {
    setShowModal(false);
    try {
      await Linking.openURL(zoomUrl);
      // Volver a la pantalla principal después de abrir Zoom
      setTimeout(() => {
        router.push('/consulta/telemedicina');
      }, 2000);
    } catch (error) {
      console.error('Error abriendo Zoom:', error);
      Alert.alert('Error', 'No se pudo abrir la aplicación de Zoom');
    }
  };

  const handleDownloadModalCancel = () => {
    setShowDownloadModal(false);
  };

  const handleDownloadModalContinue = () => {
    setShowDownloadModal(false);
    Linking.openURL('https://zoom.us/download');
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Videoconsulta</ThemedText>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Información de la Consulta */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <View style={styles.consultationHeader}>
            <View style={[styles.doctorIcon, { backgroundColor: PRIMARY_COLOR + '20' }]}>
              <Ionicons name="person" size={32} color={PRIMARY_COLOR} />
            </View>
            <View style={styles.consultationInfo}>
              <ThemedText style={styles.doctorName}>
                {specialistName ? `Dr. ${specialistName}` : 'Consulta Médica'}
              </ThemedText>
              <ThemedText style={[styles.specialty, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {specialty || 'Consulta Virtual'}
              </ThemedText>
              <ThemedText style={[styles.appointmentTime, { color: PRIMARY_COLOR }]}>
                {appointmentTime ? `Programada: ${appointmentTime}` : 'Disponible ahora'}
              </ThemedText>
            </View>
          </View>

          {/* Código de Zoom */}
          {appointment?.zoom_password && (
            <View style={[styles.zoomCodeContainer, { backgroundColor: PRIMARY_COLOR + '10' }]}>
              <Ionicons name="key" size={20} color={PRIMARY_COLOR} />
              <View style={styles.zoomCodeInfo}>
                <ThemedText style={[styles.zoomCodeLabel, { color: PRIMARY_COLOR }]}>
                  Código de reunión
                </ThemedText>
                <ThemedText style={styles.zoomCode}>
                  {appointment.zoom_password}
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Instrucciones Rápidas */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Antes de unirte</ThemedText>
          
          <View style={styles.quickTips}>
            <View style={styles.tip}>
              <Ionicons name="document-text" size={18} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.tipText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                Ten a mano tu documento de identidad
              </ThemedText>
            </View>
            
            <View style={styles.tip}>
              <Ionicons name="medical" size={18} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.tipText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                Lista de medicamentos que tomas
              </ThemedText>
            </View>
            
            <View style={styles.tip}>
              <Ionicons name="bulb" size={18} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.tipText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                Busca un lugar tranquilo y bien iluminado
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Información de Zoom */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <View style={styles.zoomInfo}>
            <Ionicons name="videocam" size={24} color={PRIMARY_COLOR} />
            <View style={styles.zoomInfoText}>
              <ThemedText style={styles.zoomInfoTitle}>Videollamada con Zoom</ThemedText>
              <ThemedText style={[styles.zoomInfoDescription, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                Se abrirá automáticamente la aplicación de Zoom
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Estado de preparación */}
        {!isReady && (
          <View style={[styles.section, {
            backgroundColor: '#fbbf24' + '20',
            borderColor: '#fbbf24',
          }]}>
            <View style={styles.preparingContainer}>
              <Ionicons name="hourglass" size={20} color="#fbbf24" />
              <ThemedText style={[styles.preparingText, { color: '#d97706' }]}>
                Preparando consulta...
              </ThemedText>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botón principal */}
      <View style={[styles.joinContainer, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderTopColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}>
        <TouchableOpacity 
          style={[
            styles.joinButton,
            { 
              backgroundColor: isReady ? PRIMARY_COLOR : Colors.light.textSecondary,
              opacity: isReady ? 1 : 0.7
            }
          ]}
          onPress={handleJoinCall}
          disabled={!isReady}
        >
          <Ionicons name="videocam" size={20} color="white" />
          <ThemedText style={styles.joinButtonText}>
            {isReady ? 'Iniciar Videoconsulta' : 'Preparando...'}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.supportButton}
          onPress={handleInstallZoom}
        >
          <Ionicons name="download-outline" size={16} color={PRIMARY_COLOR} />
          <ThemedText style={[styles.supportButtonText, { color: PRIMARY_COLOR }]}>
            ¿No tienes Zoom? Descárgalo aquí
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Modal personalizado para confirmación */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={handleModalCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <Ionicons name="videocam" size={32} color={PRIMARY_COLOR} />
              </View>
              <ThemedText style={styles.modalTitle}>Videoconsulta</ThemedText>
            </View>

            {/* Contenido del modal */}
            <View style={styles.modalContent}>
              <ThemedText style={styles.modalMessage}>
                Se abrirá la aplicación de Zoom para iniciar tu consulta médica con{' '}
                {specialistName ? `Dr. ${specialistName}` : 'el especialista'}.
              </ThemedText>

              {appointment?.zoom_password && (
                <View style={styles.modalCodeContainer}>
                  <Ionicons name="key" size={16} color={PRIMARY_COLOR} />
                  <ThemedText style={styles.modalCodeText}>
                    Código: {appointment.zoom_password}
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Botones del modal */}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonCancel}
                onPress={handleModalCancel}
              >
                <ThemedText style={styles.modalButtonCancelText}>
                  Cancelar
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalButtonContinue}
                onPress={handleModalContinue}
              >
                <ThemedText style={styles.modalButtonContinueText}>
                  Iniciar Consulta
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal personalizado para descarga de Zoom */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDownloadModal}
        onRequestClose={handleDownloadModalCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <View style={styles.modalIconDownload}>
                <Ionicons name="download" size={32} color="#f59e0b" />
              </View>
              <ThemedText style={styles.modalTitleDownload}>Descargar Zoom</ThemedText>
            </View>

            {/* Contenido del modal */}
            <View style={styles.modalContent}>
              <ThemedText style={styles.modalMessage}>
                Zoom es necesario para las videoconsultas médicas. Es una aplicación gratuita y segura.
              </ThemedText>

              <View style={styles.downloadFeatures}>
                <View style={styles.downloadFeature}>
                  <Ionicons name="shield-checkmark" size={16} color="#10b981" />
                  <ThemedText style={styles.featureText}>Videollamadas de alta calidad</ThemedText>
                </View>
                
                <View style={styles.downloadFeature}>
                  <Ionicons name="lock-closed" size={16} color="#10b981" />
                  <ThemedText style={styles.featureText}>Conexión segura y privada</ThemedText>
                </View>
                
                <View style={styles.downloadFeature}>
                  <Ionicons name="download" size={16} color="#10b981" />
                  <ThemedText style={styles.featureText}>Descarga gratuita</ThemedText>
                </View>
              </View>
            </View>

            {/* Botones del modal */}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonCancel}
                onPress={handleDownloadModalCancel}
              >
                <ThemedText style={styles.modalButtonCancelText}>
                  Cancelar
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalButtonDownload}
                onPress={handleDownloadModalContinue}
              >
                <Ionicons name="download" size={16} color="white" />
                <ThemedText style={styles.modalButtonDownloadText}>
                  Ir a Descargar
                </ThemedText>
              </TouchableOpacity>
            </View>
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
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
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
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.white,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
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
  consultationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  doctorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  consultationInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  zoomCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  zoomCodeInfo: {
    flex: 1,
  },
  zoomCodeLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  zoomCode: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quickTips: {
    gap: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
  zoomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  zoomInfoText: {
    flex: 1,
  },
  zoomInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  zoomInfoDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  preparingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  preparingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  joinContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
    minHeight: 50,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.light.background,
    padding: 24,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 25,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: PRIMARY_COLOR + '20',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 24,
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
    color: Colors.light.textSecondary,
  },
  modalCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    backgroundColor: PRIMARY_COLOR + '10',
  },
  modalCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: PRIMARY_COLOR,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Colors.light.border,
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  modalButtonContinue: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    backgroundColor: PRIMARY_COLOR,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalButtonContinueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalIconDownload: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#f59e0b' + '20',
  },
  modalTitleDownload: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f59e0b',
    textAlign: 'center',
  },
  downloadFeatures: {
    gap: 12,
  },
  downloadFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
  modalButtonDownload: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    backgroundColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalButtonDownloadText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 