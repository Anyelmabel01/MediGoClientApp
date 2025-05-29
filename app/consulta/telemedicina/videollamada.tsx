import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';

const { width, height } = Dimensions.get('window');

// Login color palette
const PRIMARY_COLOR = '#00A0B0';
const PRIMARY_LIGHT = '#33b5c2';
const PRIMARY_DARK = '#006070';
const ACCENT_COLOR = '#70D0E0';

type CallStatus = 'connecting' | 'connected' | 'ended';
type ChatMessage = {
  id: string;
  sender: 'patient' | 'doctor';
  message: string;
  timestamp: string;
};

type Prescription = {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
};

export default function VideollamadaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { consultationId, specialistId, appointmentTime, specialistName, specialty } = useLocalSearchParams();
  const cameraRef = useRef<CameraView>(null);
  
  // Camera permissions
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  
  const [callStatus, setCallStatus] = useState<CallStatus>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'doctor',
      message: '¡Hola! Me alegra verte. ¿Cómo te sientes hoy?',
      timestamp: '14:30'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  // Doctor data from params
  const doctorInfo = {
    name: specialistName || 'Especialista',
    initials: specialistName && typeof specialistName === 'string' ? 
      specialistName.split(' ')
        .map((word: string) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() 
      : 'ES'
  };

  useEffect(() => {
    // Request camera permissions on component mount
    if (!permission?.granted) {
      requestPermission();
    }

    // Simulate connection
    const connectionTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 500); // Súper rápido - medio segundo

    // Call duration timer
    const durationTimer = setInterval(() => {
      if (callStatus === 'connected') {
        setCallDuration(prev => prev + 1);
      }
    }, 1000);

    return () => {
      clearTimeout(connectionTimer);
      clearInterval(durationTimer);
    };
  }, [callStatus, permission]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    console.log('End call button pressed');
    Alert.alert(
      'Finalizar Consulta',
      '¿Qué te gustaría hacer ahora?',
      [
        { text: 'Continuar llamada', style: 'cancel' },
        { 
          text: 'Calificar consulta', 
          onPress: () => {
            console.log('Going to rate consultation');
            setCallStatus('ended');
            router.push({
              pathname: '/consulta/telemedicina/calificar-consulta',
              params: { specialistId }
            });
          }
        },
        { 
          text: 'Ir al inicio', 
          onPress: () => {
            console.log('Going directly to home');
            setCallStatus('ended');
            router.replace('/');
          }
        }
      ]
    );
  };

  const toggleCamera = () => {
    console.log('Toggle camera pressed');
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleVideo = () => {
    console.log('Toggle video pressed, current state:', isVideoOff);
    setIsVideoOff(!isVideoOff);
  };

  const toggleMute = () => {
    console.log('Toggle mute pressed, current state:', isMuted);
    setIsMuted(!isMuted);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'patient',
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simulate doctor response
      setTimeout(() => {
        const doctorResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'doctor',
          message: 'Entiendo. Te enviaré algunas recomendaciones.',
          timestamp: new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
        setChatMessages(prev => [...prev, doctorResponse]);
      }, 2000);
    }
  };

  const addPrescription = () => {
    const newPrescription: Prescription = {
      id: Date.now().toString(),
      medication: 'Acetaminofén',
      dosage: '500mg',
      frequency: 'Cada 8 horas',
      duration: '5 días',
      instructions: 'Tomar con alimentos. No exceder la dosis recomendada.'
    };
    setPrescriptions(prev => [...prev, newPrescription]);
  };

  // Handle permission request
  if (!permission) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera" size={64} color={PRIMARY_COLOR} />
          <ThemedText style={styles.permissionTitle}>Solicitando permisos...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="videocam-off" size={64} color={PRIMARY_COLOR} />
          <ThemedText style={styles.permissionTitle}>Permisos necesarios</ThemedText>
          <ThemedText style={[styles.permissionText, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            Necesitamos acceso a tu cámara y micrófono para la videollamada médica.
          </ThemedText>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <ThemedText style={styles.permissionButtonText}>Otorgar permisos</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  if (callStatus === 'connecting') {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <View style={styles.connectingContainer}>
          <Ionicons name="videocam" size={40} color={PRIMARY_COLOR} />
          <ThemedText style={styles.connectingTitle}>Conectando con {doctorInfo.name}</ThemedText>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Main video area - Doctor's feed (simulated) */}
      <View style={styles.videoContainer}>
        {/* Doctor's video placeholder with initials */}
        <View style={styles.doctorVideoPlaceholder}>
          <ThemedText style={styles.doctorInitials}>{doctorInfo.initials}</ThemedText>
        </View>
        
        {/* Connection status */}
        <View style={styles.statusBar}>
          <View style={styles.connectionStatus}>
            <View style={styles.connectionDot} />
            <ThemedText style={styles.connectionText}>
              Conectado {formatDuration(callDuration)}
            </ThemedText>
          </View>
          <View style={styles.qualityIndicator}>
            <ThemedText style={styles.qualityText}>HD</ThemedText>
          </View>
        </View>

        {/* Patient's camera preview */}
        <View style={styles.patientVideoContainer}>
          {isVideoOff ? (
            <View style={styles.videoOffContainer}>
              <Ionicons name="videocam-off" size={32} color="white" />
              <ThemedText style={styles.videoOffText}>TU</ThemedText>
            </View>
          ) : (
            <CameraView
              ref={cameraRef}
              style={styles.patientVideo}
              facing={facing}
            />
          )}
        </View>
      </View>

      {/* Control buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={toggleMute}
        >
          <Ionicons 
            name={isMuted ? "mic-off" : "mic"} 
            size={24} 
            color={isMuted ? PRIMARY_COLOR : "white"} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
          onPress={toggleVideo}
        >
          <Ionicons 
            name={isVideoOff ? "videocam-off" : "videocam"} 
            size={24} 
            color={isVideoOff ? PRIMARY_COLOR : "white"} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={toggleCamera}
        >
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => setIsChatOpen(true)}
        >
          <Ionicons name="chatbubble" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => setIsPrescriptionOpen(true)}
        >
          <Ionicons name="document-text" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.endCallButton}
          onPress={handleEndCall}
        >
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Doctor info */}
      <View style={styles.doctorInfo}>
        <ThemedText style={styles.doctorName}>{doctorInfo.name}</ThemedText>
      </View>

      {/* Chat Modal */}
      <Modal 
        visible={isChatOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <ThemedText style={styles.chatTitle}>Chat con {doctorInfo.name}</ThemedText>
            <TouchableOpacity onPress={() => setIsChatOpen(false)}>
              <Ionicons name="close" size={24} color={PRIMARY_COLOR} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.messagesContainer}
            contentContainerStyle={styles.messages}
            showsVerticalScrollIndicator={false}
          >
            {chatMessages.map((message) => (
              <View 
                key={message.id}
                style={[
                  styles.messageRow,
                  message.sender === 'patient' && styles.messageRowPatient
                ]}
              >
                <View style={[
                  styles.messageBubble,
                  {
                    backgroundColor: message.sender === 'patient' 
                      ? PRIMARY_COLOR 
                      : (isDarkMode ? Colors.dark.border : Colors.light.border)
                  }
                ]}>
                  <ThemedText style={[
                    styles.messageText,
                    { color: message.sender === 'patient' ? 'white' : 
                      (isDarkMode ? Colors.dark.text : Colors.light.text) }
                  ]}>
                    {message.message}
                  </ThemedText>
                  <ThemedText style={[
                    styles.messageTime,
                    { color: message.sender === 'patient' ? 'rgba(255,255,255,0.7)' : 
                      (isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary) }
                  ]}>
                    {message.timestamp}
                  </ThemedText>
                </View>
              </View>
            ))}
          </ScrollView>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.chatInputContainer}
          >
            <View style={[styles.chatInput, {
              backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
              borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
            }]}>
              <TextInput
                style={[styles.chatInputText, {
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}
                placeholder="Escribe un mensaje..."
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[styles.sendButton, { 
                  backgroundColor: newMessage.trim() ? PRIMARY_COLOR : Colors.light.textSecondary 
                }]}
                onPress={sendMessage}
                disabled={!newMessage.trim()}
              >
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ThemedView>
      </Modal>

      {/* Prescription Modal */}
      <Modal 
        visible={isPrescriptionOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={styles.prescriptionContainer}>
          <View style={styles.prescriptionHeader}>
            <ThemedText style={styles.prescriptionTitle}>Recetas Médicas</ThemedText>
            <TouchableOpacity onPress={() => setIsPrescriptionOpen(false)}>
              <Ionicons name="close" size={24} color={PRIMARY_COLOR} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.prescriptionContent} showsVerticalScrollIndicator={false}>
            {prescriptions.length === 0 ? (
              <View style={styles.noPrescriptions}>
                <Ionicons name="document-text-outline" size={64} color={Colors.light.textSecondary} />
                <ThemedText style={[styles.noPrescriptionsTitle, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  No hay recetas aún
                </ThemedText>
                <ThemedText style={[styles.noPrescriptionsText, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  El doctor puede agregarte recetas durante la consulta
                </ThemedText>
              </View>
            ) : (
              <View style={styles.prescriptionsList}>
                {prescriptions.map((prescription) => (
                  <View 
                    key={prescription.id}
                    style={[styles.prescriptionItem, {
                      backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                      borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                    }]}
                  >
                    <View style={styles.prescriptionItemHeader}>
                      <ThemedText style={styles.medicationName}>
                        {prescription.medication}
                      </ThemedText>
                      <ThemedText style={[styles.dosage, { color: PRIMARY_COLOR }]}>
                        {prescription.dosage}
                      </ThemedText>
                    </View>
                    <View style={styles.prescriptionDetails}>
                      <ThemedText style={[styles.prescriptionDetailText, {
                        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                      }]}>
                        Frecuencia: {prescription.frequency}
                      </ThemedText>
                      <ThemedText style={[styles.prescriptionDetailText, {
                        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                      }]}>
                        Duración: {prescription.duration}
                      </ThemedText>
                      <ThemedText style={[styles.prescriptionDetailText, {
                        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                      }]}>
                        Instrucciones: {prescription.instructions}
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Demo button for adding prescription */}
          <TouchableOpacity 
            style={[styles.addPrescriptionButton, { backgroundColor: PRIMARY_COLOR }]}
            onPress={addPrescription}
          >
            <Ionicons name="add" size={20} color="white" />
            <ThemedText style={styles.addPrescriptionText}>
              Agregar Receta (Demo)
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  connectingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  connectingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  connectingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  connectingSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  connectingSteps: {
    gap: 8,
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  doctorVideoPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorInitials: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  patientVideoContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
  },
  patientVideo: {
    width: '100%',
    height: '100%',
  },
  videoOffContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  videoOffText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 40,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  connectionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  qualityIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  qualityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 32,
    paddingBottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  controlButtonActive: {
    backgroundColor: 'white',
  },
  endCallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  doctorInfo: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  doctorName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    paddingTop: 50,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
  },
  messages: {
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
  },
  messageRowPatient: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  chatInputContainer: {
    padding: 16,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chatInputText: {
    flex: 1,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prescriptionContainer: {
    flex: 1,
    paddingTop: 50,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  prescriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  prescriptionContent: {
    flex: 1,
  },
  noPrescriptions: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  noPrescriptionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noPrescriptionsText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  prescriptionsList: {
    padding: 16,
    gap: 16,
  },
  prescriptionItem: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  prescriptionItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  dosage: {
    fontSize: 16,
    fontWeight: '600',
  },
  prescriptionDetails: {
    gap: 4,
  },
  prescriptionDetailText: {
    fontSize: 14,
    lineHeight: 20,
  },
  addPrescriptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addPrescriptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: PRIMARY_COLOR,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 