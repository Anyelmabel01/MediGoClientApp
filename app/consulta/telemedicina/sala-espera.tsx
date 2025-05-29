import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
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

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
};

type TechnicalCheck = {
  id: string;
  name: string;
  status: 'checking' | 'success' | 'error';
  icon: string;
};

export default function SalaEsperaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { consultationId, specialistId, appointmentTime, specialistName, specialty } = useLocalSearchParams();
  
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: '1',
      title: 'Documento de identidad listo',
      description: 'Ten tu cédula o pasaporte a la mano para verificación',
      completed: false,
      required: true
    },
    {
      id: '2',
      title: 'Lista de medicamentos actuales',
      description: 'Prepara una lista de medicamentos que estás tomando',
      completed: false,
      required: true
    },
    {
      id: '3',
      title: 'Síntomas o molestias a consultar',
      description: 'Ten claros los síntomas que quieres consultar',
      completed: false,
      required: true
    },
    {
      id: '4',
      title: 'Historial médico relevante',
      description: 'Información sobre cirugías, alergias o condiciones previas',
      completed: false,
      required: false
    },
    {
      id: '5',
      title: 'Ambiente tranquilo',
      description: 'Asegúrate de estar en un lugar privado y sin ruido',
      completed: false,
      required: true
    },
    {
      id: '6',
      title: 'Buena iluminación',
      description: 'Ubícate en un lugar con buena luz para que el doctor pueda verte',
      completed: false,
      required: false
    }
  ]);

  const [technicalChecks, setTechnicalChecks] = useState<TechnicalCheck[]>([
    { id: '1', name: 'Conexión a internet', status: 'checking', icon: 'wifi' },
    { id: '2', name: 'Cámara', status: 'checking', icon: 'camera' },
    { id: '3', name: 'Micrófono', status: 'checking', icon: 'mic' },
    { id: '4', name: 'Altavoces', status: 'checking', icon: 'volume-high' }
  ]);

  const [waitingTime, setWaitingTime] = useState(0);
  const [canJoinCall, setCanJoinCall] = useState(false);

  useEffect(() => {
    // Simulate technical checks - always successful
    const checkInterval = setInterval(() => {
      setTechnicalChecks(prev => prev.map(check => {
        if (check.status === 'checking') {
          // Always set to success - everything works properly
          return { ...check, status: 'success' };
        }
        return check;
      }));
    }, 1000);

    // Simulate waiting time countdown
    const waitInterval = setInterval(() => {
      setWaitingTime(prev => {
        if (prev <= 0) {
          setCanJoinCall(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Initialize waiting time (simulated)
    setWaitingTime(120); // 2 minutes

    return () => {
      clearInterval(checkInterval);
      clearInterval(waitInterval);
    };
  }, []);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const requiredItemsCompleted = checklist.filter(item => item.required && item.completed).length;
  const totalRequiredItems = checklist.filter(item => item.required).length;
  const allTechnicalChecksPass = technicalChecks.every(check => check.status === 'success');
  const readyToJoin = requiredItemsCompleted === totalRequiredItems && allTechnicalChecksPass && canJoinCall;

  const handleJoinCall = () => {
    if (!readyToJoin) {
      Alert.alert(
        'No estás listo aún',
        'Por favor completa todos los elementos requeridos y espera a que las pruebas técnicas terminen.'
      );
      return;
    }

    router.push({
      pathname: '/consulta/telemedicina/videollamada',
      params: { 
        consultationId, 
        specialistId, 
        appointmentTime,
        specialistName,
        specialty
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking':
        return 'time-outline';
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      default:
        return 'time-outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checking':
        return '#fbbf24';
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      default:
        return '#fbbf24';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Sala de Espera</ThemedText>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Waiting Status */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <View style={styles.waitingHeader}>
            <View style={[styles.waitingIcon, { backgroundColor: PRIMARY_COLOR + '20' }]}>
              <Ionicons name="medical" size={32} color={PRIMARY_COLOR} />
            </View>
            <View style={styles.waitingInfo}>
              <ThemedText style={styles.waitingTitle}>
                {specialistName ? `Consulta con ${specialistName}` : 'Tu consulta comenzará pronto'}
              </ThemedText>
              <ThemedText style={[styles.waitingSubtitle, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {specialty ? `${specialty} - ` : ''}Consulta virtual programada {appointmentTime ? `a las ${appointmentTime}` : ''}
              </ThemedText>
              {waitingTime > 0 ? (
                <ThemedText style={[styles.waitingTime, { color: PRIMARY_COLOR }]}>
                  Tiempo estimado: {formatTime(waitingTime)}
                </ThemedText>
              ) : (
                <ThemedText style={[styles.waitingTime, { color: '#10b981' }]}>
                  ¡Ya puedes ingresar a la consulta!
                </ThemedText>
              )}
            </View>
          </View>
        </View>

        {/* Technical Checks */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Verificación Técnica</ThemedText>
          <ThemedText style={[styles.sectionDescription, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            Verificando que tu dispositivo esté listo para la videollamada
          </ThemedText>
          
          <View style={styles.technicalChecks}>
            {technicalChecks.map((check) => (
              <View key={check.id} style={styles.technicalCheck}>
                <Ionicons 
                  name={check.icon as any} 
                  size={20} 
                  color={getStatusColor(check.status)} 
                />
                <ThemedText style={styles.technicalCheckName}>{check.name}</ThemedText>
                <Ionicons 
                  name={getStatusIcon(check.status) as any} 
                  size={20} 
                  color={getStatusColor(check.status)} 
                />
              </View>
            ))}
          </View>
        </View>

        {/* Pre-Consultation Checklist */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <View style={styles.checklistHeader}>
            <ThemedText style={styles.sectionTitle}>Lista de Verificación</ThemedText>
            <View style={[styles.progressBadge, { backgroundColor: PRIMARY_COLOR + '20' }]}>
              <ThemedText style={[styles.progressText, { color: PRIMARY_COLOR }]}>
                {requiredItemsCompleted}/{totalRequiredItems}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={[styles.sectionDescription, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            Prepara todo lo necesario para una consulta exitosa
          </ThemedText>

          <View style={styles.checklist}>
            {checklist.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.checklistItem, {
                  borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                }]}
                onPress={() => toggleChecklistItem(item.id)}
              >
                <View style={styles.checklistItemHeader}>
                  <Ionicons 
                    name={item.completed ? "checkbox" : "square-outline"} 
                    size={24} 
                    color={item.completed ? '#10b981' : Colors.light.textSecondary} 
                  />
                  <View style={styles.checklistItemInfo}>
                    <View style={styles.checklistItemTitleRow}>
                      <ThemedText style={[
                        styles.checklistItemTitle,
                        item.completed && styles.checklistItemTitleCompleted
                      ]}>
                        {item.title}
                      </ThemedText>
                      {item.required && (
                        <View style={[styles.requiredBadge, { backgroundColor: '#ef4444' }]}>
                          <ThemedText style={styles.requiredText}>Requerido</ThemedText>
                        </View>
                      )}
                    </View>
                    <ThemedText style={[
                      styles.checklistItemDescription,
                      {
                        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                      },
                      item.completed && styles.checklistItemDescriptionCompleted
                    ]}>
                      {item.description}
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Instrucciones Importantes</ThemedText>
          <View style={styles.instructions}>
            <View style={styles.instruction}>
              <Ionicons name="shield-checkmark" size={20} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.instructionText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                Tu consulta es privada y confidencial
              </ThemedText>
            </View>
            <View style={styles.instruction}>
              <Ionicons name="time" size={20} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.instructionText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                La consulta puede durar entre 15-30 minutos
              </ThemedText>
            </View>
            <View style={styles.instruction}>
              <Ionicons name="help-circle" size={20} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.instructionText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                Si tienes problemas técnicos, usa el chat de soporte
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Botón de entrada inmediata */}
        {technicalChecks.every(check => check.status === 'success') && waitingTime > 0 && (
          <View style={styles.quickJoinContainer}>
            <TouchableOpacity 
              style={styles.quickJoinButton}
              onPress={() => {
                setWaitingTime(0);
                setCanJoinCall(true);
              }}
            >
              <Ionicons name="flash" size={20} color="white" />
              <ThemedText style={styles.quickJoinText}>
                Entrar ahora (verificación completa)
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Join Call Button */}
      <View style={[styles.joinContainer, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderTopColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}>
        <TouchableOpacity 
          style={[
            styles.joinButton,
            { 
              backgroundColor: canJoinCall ? Colors.light.primary : Colors.light.textSecondary,
              opacity: canJoinCall ? 1 : 0.6
            }
          ]}
          onPress={handleJoinCall}
          disabled={!canJoinCall}
        >
          <Ionicons name="videocam" size={20} color="white" />
          <ThemedText style={styles.joinButtonText}>
            {canJoinCall ? 'Ingresar a la Consulta' : 'Completar preparación'}
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.supportButton}
          onPress={() => Alert.alert('Soporte', 'Función de soporte en desarrollo')}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={PRIMARY_COLOR} />
          <ThemedText style={[styles.supportButtonText, { color: PRIMARY_COLOR }]}>
            ¿Necesitas ayuda?
          </ThemedText>
        </TouchableOpacity>
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
  waitingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waitingIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  waitingInfo: {
    flex: 1,
  },
  waitingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  waitingSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  waitingTime: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  technicalChecks: {
    gap: 12,
  },
  technicalCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  technicalCheckName: {
    flex: 1,
    fontSize: 14,
  },
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  checklist: {
    gap: 12,
  },
  checklistItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  checklistItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checklistItemInfo: {
    flex: 1,
  },
  checklistItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  checklistItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  checklistItemTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  requiredBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  requiredText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  checklistItemDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  checklistItemDescriptionCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  instructions: {
    gap: 12,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructionText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
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
    fontSize: width < 400 ? 14 : 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    flexWrap: 'wrap',
  },
  supportButtonText: {
    fontSize: width < 400 ? 12 : 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  quickJoinContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  quickJoinButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickJoinText: {
    color: 'white',
    fontSize: width < 400 ? 14 : 16,
    fontWeight: 'bold',
  },
}); 