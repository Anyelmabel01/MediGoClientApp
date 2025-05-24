import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type EmergencyStatus = 'PAID' | 'ACCEPTED' | 'IN_PROGRESS' | 'ARRIVING' | 'COMPLETED';

const STATUS_CONFIG = {
  PAID: {
    title: 'Pago Confirmado',
    description: 'Tu solicitud fue procesada. Buscando paramédico disponible...',
    color: '#FF9800',
    icon: 'card' as const,
  },
  ACCEPTED: {
    title: 'Paramédico Asignado',
    description: 'Un paramédico confirmó tu solicitud y se dirige hacia ti',
    color: '#2196F3',
    icon: 'checkmark-circle' as const,
  },
  IN_PROGRESS: {
    title: 'En Camino',
    description: 'El paramédico está en ruta hacia tu ubicación',
    color: '#FF9800',
    icon: 'car' as const,
  },
  ARRIVING: {
    title: 'Llegando',
    description: 'El paramédico está muy cerca (menos de 3 minutos)',
    color: '#4CAF50',
    icon: 'location' as const,
  },
  COMPLETED: {
    title: 'Servicio Completado',
    description: 'El servicio de emergencia ha finalizado',
    color: '#4CAF50',
    icon: 'checkmark-done' as const,
  },
};

export default function EmergenciaSeguimientoScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [currentStatus, setCurrentStatus] = useState<EmergencyStatus>('PAID');
  const [estimatedTime, setEstimatedTime] = useState(8);
  const [requestId] = useState('EMG-' + Date.now().toString().slice(-6));
  
  // Simular progreso de estados
  useEffect(() => {
    const statusProgression: EmergencyStatus[] = ['PAID', 'ACCEPTED', 'IN_PROGRESS', 'ARRIVING'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < statusProgression.length - 1) {
        currentIndex++;
        setCurrentStatus(statusProgression[currentIndex]);
        
        // Reducir tiempo estimado
        if (statusProgression[currentIndex] === 'ACCEPTED') {
          setEstimatedTime(6);
        } else if (statusProgression[currentIndex] === 'IN_PROGRESS') {
          setEstimatedTime(3);
        } else if (statusProgression[currentIndex] === 'ARRIVING') {
          setEstimatedTime(1);
        }
      }
    }, 5000); // Cambiar estado cada 5 segundos para demo
    
    return () => clearInterval(interval);
  }, []);

  const handleCallEmergency = () => {
    // Simular llamada de emergencia
    console.log('Llamando a línea de emergencia...');
  };

  const handleCallParamedic = () => {
    // Simular llamada al paramédico
    console.log('Llamando al paramédico...');
  };

  const handleCompleteService = () => {
    router.push('/emergencia/completado' as any);
  };

  const emergencyData = {
    type: 'Emergencia Médica',
    patient: 'Juan Pérez',
    location: 'Calle 50 #15-20, San Francisco',
    requestTime: new Date().toLocaleTimeString(),
    paramedicName: 'Dr. María González',
    paramedicPhone: '+507 6987-6543',
    paramedicDistance: '2.1 km',
  };

  const statusConfig = STATUS_CONFIG[currentStatus];

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <ThemedText style={styles.title}>Seguimiento de Emergencia</ThemedText>
        <ThemedText style={[styles.requestId, { 
          color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
        }]}>ID: {requestId}</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Estado Actual */}
        <View style={[styles.statusCard, { 
          backgroundColor: statusConfig.color + '20',
          borderColor: statusConfig.color
        }]}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIcon, { backgroundColor: statusConfig.color }]}>
              <Ionicons name={statusConfig.icon} size={32} color="white" />
            </View>
            <View style={styles.statusInfo}>
              <ThemedText style={[styles.statusTitle, { color: statusConfig.color }]}>
                {statusConfig.title}
              </ThemedText>
              <ThemedText style={styles.statusDescription}>
                {statusConfig.description}
              </ThemedText>
            </View>
          </View>
          
          {estimatedTime > 0 && (
            <View style={styles.timeContainer}>
              <Ionicons name="time" size={20} color={statusConfig.color} />
              <ThemedText style={[styles.estimatedTime, { color: statusConfig.color }]}>
                Tiempo estimado: {estimatedTime} minutos
              </ThemedText>
            </View>
          )}
        </View>

        {/* Información de la Solicitud */}
        <View style={[styles.infoCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
        }]}>
          <ThemedText style={styles.cardTitle}>Detalles de la Solicitud</ThemedText>
          
          <View style={styles.infoRow}>
            <Ionicons name="medkit" size={20} color="#F44336" />
            <ThemedText style={styles.infoLabel}>Tipo:</ThemedText>
            <ThemedText style={styles.infoValue}>{emergencyData.type}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={Colors.light.primary} />
            <ThemedText style={styles.infoLabel}>Paciente:</ThemedText>
            <ThemedText style={styles.infoValue}>{emergencyData.patient}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={Colors.light.primary} />
            <ThemedText style={styles.infoLabel}>Ubicación:</ThemedText>
            <ThemedText style={styles.infoValue}>{emergencyData.location}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={Colors.light.primary} />
            <ThemedText style={styles.infoLabel}>Hora:</ThemedText>
            <ThemedText style={styles.infoValue}>{emergencyData.requestTime}</ThemedText>
          </View>
        </View>

        {/* Información del Paramédico */}
        {(currentStatus === 'ACCEPTED' || currentStatus === 'IN_PROGRESS' || currentStatus === 'ARRIVING') && (
          <View style={[styles.infoCard, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            <ThemedText style={styles.cardTitle}>Información del Paramédico</ThemedText>
            
            <View style={styles.paramedicInfo}>
              <View style={styles.paramedicAvatar}>
                <Ionicons name="person" size={32} color={Colors.light.primary} />
              </View>
              <View style={styles.paramedicDetails}>
                <ThemedText style={styles.paramedicName}>{emergencyData.paramedicName}</ThemedText>
                <ThemedText style={[styles.paramedicDistance, { 
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
                }]}>
                  Distancia actual: {emergencyData.paramedicDistance}
                </ThemedText>
              </View>
              <TouchableOpacity 
                style={styles.callButton}
                onPress={handleCallParamedic}
              >
                <Ionicons name="call" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Seguimiento de Ubicación */}
        {(currentStatus === 'IN_PROGRESS' || currentStatus === 'ARRIVING') && (
          <View style={[styles.infoCard, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            <ThemedText style={styles.cardTitle}>Seguimiento en Tiempo Real</ThemedText>
            
            <View style={styles.trackingContainer}>
              <View style={styles.trackingItem}>
                <View style={[styles.trackingIcon, { backgroundColor: '#4CAF50' }]}>
                  <Ionicons name="location" size={20} color="white" />
                </View>
                <ThemedText style={styles.trackingText}>Tu ubicación</ThemedText>
              </View>
              
              <View style={styles.trackingLine} />
              
              <View style={styles.trackingItem}>
                <View style={[styles.trackingIcon, { backgroundColor: Colors.light.primary }]}>
                  <Ionicons name="medical" size={20} color="white" />
                </View>
                <ThemedText style={styles.trackingText}>Paramédico ({emergencyData.paramedicDistance})</ThemedText>
              </View>
            </View>
            
            <ThemedText style={[styles.trackingNote, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              La ubicación se actualiza cada 30 segundos
            </ThemedText>
          </View>
        )}

        {/* Contacto de Emergencia */}
        <View style={[styles.emergencyContactCard, { 
          backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE',
          borderColor: isDarkMode ? 'rgba(244, 67, 54, 0.2)' : '#FFCDD2'
        }]}>
          <ThemedText style={styles.emergencyContactTitle}>Contacto de Emergencia</ThemedText>
          <ThemedText style={[styles.emergencyContactText, { color: '#D32F2F' }]}>
            Si la situación se agrava, llama inmediatamente al 911
          </ThemedText>
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={handleCallEmergency}
          >
            <Ionicons name="call" size={20} color="white" />
            <ThemedText style={styles.emergencyButtonText}>Línea de Emergencia</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Botón para completar (solo para demo) */}
        {currentStatus === 'ARRIVING' && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleCompleteService}
          >
            <ThemedText style={styles.completeButtonText}>Simular Finalización del Servicio</ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  requestId: {
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  statusCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  estimatedTime: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
  },
  paramedicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paramedicAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paramedicDetails: {
    flex: 1,
  },
  paramedicName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paramedicDistance: {
    fontSize: 14,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  trackingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trackingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  trackingLine: {
    width: 2,
    height: 30,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
    marginLeft: 19,
  },
  trackingNote: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emergencyContactCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  emergencyContactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 8,
  },
  emergencyContactText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 