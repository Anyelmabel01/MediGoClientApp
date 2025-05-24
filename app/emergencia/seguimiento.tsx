import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapboxMap from '../../components/MapboxMap';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const { height } = Dimensions.get('window');

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
  const [paramedicLocation, setParamedicLocation] = useState({ lat: 8.9800, lng: -79.5150 });
  const [patientLocation] = useState({ lat: 8.9824, lng: -79.5199 }); // Ubicación fija del paciente
  const [showMap, setShowMap] = useState(false);
  
  // Simular progreso de estados y movimiento del paramédico
  useEffect(() => {
    const statusProgression: EmergencyStatus[] = ['PAID', 'ACCEPTED', 'IN_PROGRESS', 'ARRIVING'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < statusProgression.length - 1) {
        currentIndex++;
        setCurrentStatus(statusProgression[currentIndex]);
        
        // Reducir tiempo estimado y mostrar mapa cuando sea aceptado
        if (statusProgression[currentIndex] === 'ACCEPTED') {
          setEstimatedTime(6);
          setShowMap(true);
        } else if (statusProgression[currentIndex] === 'IN_PROGRESS') {
          setEstimatedTime(3);
        } else if (statusProgression[currentIndex] === 'ARRIVING') {
          setEstimatedTime(1);
        }
      }
    }, 5000); // Cambiar estado cada 5 segundos para demo
    
    return () => clearInterval(interval);
  }, []);

  // Simular movimiento del paramédico hacia el paciente
  useEffect(() => {
    if (!showMap) return;

    const moveTowardsPatient = () => {
      setParamedicLocation(prevLocation => {
        const latDiff = patientLocation.lat - prevLocation.lat;
        const lngDiff = patientLocation.lng - prevLocation.lng;
        
        // Mover 10% más cerca en cada actualización
        const moveSpeed = 0.1;
        
        return {
          lat: prevLocation.lat + (latDiff * moveSpeed),
          lng: prevLocation.lng + (lngDiff * moveSpeed)
        };
      });
    };

    const interval = setInterval(moveTowardsPatient, 3000); // Actualizar cada 3 segundos
    return () => clearInterval(interval);
  }, [showMap, patientLocation]);

  const handleCallEmergency = () => {
    console.log('Llamando a línea de emergencia...');
  };

  const handleCallParamedic = () => {
    console.log('Llamando al paramédico...');
  };

  const handleCompleteService = () => {
    router.push('/emergencia/completado' as any);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return (distance * 1000).toFixed(0); // Convertir a metros
  };

  const emergencyData = {
    type: 'Emergencia Médica',
    patient: 'Juan Pérez',
    location: 'Calle 50 #15-20, San Francisco',
    requestTime: new Date().toLocaleTimeString(),
    paramedicName: 'Dr. María González',
    paramedicPhone: '+507 6987-6543',
    paramedicDistance: calculateDistance(
      paramedicLocation.lat, 
      paramedicLocation.lng, 
      patientLocation.lat, 
      patientLocation.lng
    ),
  };

  const statusConfig = STATUS_CONFIG[currentStatus];

  const mapMarkers = [
    {
      id: 'patient',
      latitude: patientLocation.lat,
      longitude: patientLocation.lng,
      color: '#FF0000',
      title: 'Ubicación del Paciente'
    },
    {
      id: 'paramedic',
      latitude: paramedicLocation.lat,
      longitude: paramedicLocation.lng,
      color: '#00FF00',
      title: 'Paramédico en Camino'
    }
  ];

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

        {/* Mapa de Tracking en Tiempo Real */}
        {showMap && (
          <View style={[styles.infoCard, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            <ThemedText style={styles.cardTitle}>Ubicación en Tiempo Real</ThemedText>
            <View style={styles.mapContainer}>
              <MapboxMap
                latitude={(patientLocation.lat + paramedicLocation.lat) / 2}
                longitude={(patientLocation.lng + paramedicLocation.lng) / 2}
                zoom={14}
                markers={mapMarkers}
                showCurrentLocation={false}
                interactive={true}
                style={styles.map}
              />
            </View>
            <View style={styles.mapLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendMarker, { backgroundColor: '#FF0000' }]} />
                <ThemedText style={styles.legendText}>Tu ubicación</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendMarker, { backgroundColor: '#00FF00' }]} />
                <ThemedText style={styles.legendText}>Paramédico</ThemedText>
              </View>
            </View>
          </View>
        )}

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
                  Distancia actual: {emergencyData.paramedicDistance}m
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

        {/* Contacto de Emergencia */}
        <View style={[styles.infoCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
        }]}>
          <ThemedText style={styles.cardTitle}>Contacto de Emergencia</ThemedText>
          
          <TouchableOpacity 
            style={styles.emergencyCallButton}
            onPress={handleCallEmergency}
          >
            <Ionicons name="call" size={24} color="white" />
            <ThemedText style={styles.emergencyCallText}>Llamar línea de emergencia</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Botón de Completar Servicio (solo para demo) */}
        {currentStatus === 'ARRIVING' && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleCompleteService}
          >
            <ThemedText style={styles.completeButtonText}>Completar Servicio (Demo)</ThemedText>
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
    marginBottom: 20,
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
    borderRadius: 12,
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
    width: 64,
    height: 64,
    borderRadius: 32,
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
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
  },
  estimatedTime: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
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
  mapContainer: {
    height: height * 0.3,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    flex: 1,
  },
  mapLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    flex: 2,
  },
  paramedicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paramedicAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary + '20',
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
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyCallButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyCallText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 