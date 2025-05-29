import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Linking, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
  const { user, currentLocation } = useUser();
  const [currentStatus, setCurrentStatus] = useState<EmergencyStatus>('PAID');
  const [estimatedTime, setEstimatedTime] = useState(8);
  const [requestId] = useState('EMG-' + Date.now().toString().slice(-6));
  const [paramedicLocation, setParamedicLocation] = useState({ lat: 8.9800, lng: -79.5150 });
  const [patientLocation] = useState({ lat: 8.9824, lng: -79.5199 }); // Ubicación fija del paciente
  const [showMap, setShowMap] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 8.9812, lng: -79.5175 }); // Centro inicial
  
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
          // Calcular centro inicial del mapa
          const centerLat = (patientLocation.lat + 8.9800) / 2;
          const centerLng = (patientLocation.lng + -79.5150) / 2;
          setMapCenter({ lat: centerLat, lng: centerLng });
        } else if (statusProgression[currentIndex] === 'IN_PROGRESS') {
          setEstimatedTime(3);
        } else if (statusProgression[currentIndex] === 'ARRIVING') {
          setEstimatedTime(1);
        }
      } else if (currentIndex === statusProgression.length - 1) {
        // Después de ARRIVING, esperar un poco y completar
        setTimeout(() => {
          setCurrentStatus('COMPLETED');
          setEstimatedTime(0);
        }, 8000); // 8 segundos después de llegar
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
        
        // Mover de forma más suave y gradual - 2% más cerca en cada actualización
        const moveSpeed = 0.02;
        
        // Verificar si ya está muy cerca para evitar oscilaciones
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        if (distance < 0.0001) { // Si está muy cerca, no mover más
          return prevLocation;
        }
        
        const newLocation = {
          lat: prevLocation.lat + (latDiff * moveSpeed),
          lng: prevLocation.lng + (lngDiff * moveSpeed)
        };

        // Actualizar centro del mapa de forma suave cada cierto tiempo
        if (Math.random() < 0.1) { // Solo actualizar el centro ocasionalmente
          const newCenter = {
            lat: (newLocation.lat + patientLocation.lat) / 2,
            lng: (newLocation.lng + patientLocation.lng) / 2
          };
          setMapCenter(newCenter);
        }
        
        return newLocation;
      });
    };

    const interval = setInterval(moveTowardsPatient, 500); // Actualizar cada 500ms para movimiento más fluido
    return () => clearInterval(interval);
  }, [showMap, patientLocation]);

  const handleCallEmergency = () => {
    Alert.alert(
      '🚨 Llamada de Emergencia',
      '¿Deseas llamar a la línea de emergencias 911?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Llamar 911', 
          style: 'destructive',
          onPress: () => {
            Linking.openURL('tel:911').catch(() => {
              Alert.alert('Error', 'No se pudo realizar la llamada');
            });
          }
        }
      ]
    );
  };

  const handleCallParamedic = () => {
    const paramedicPhone = emergencyData.paramedicPhone;
    Alert.alert(
      '📞 Llamar Paramédico',
      `¿Deseas llamar a ${emergencyData.paramedicName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Llamar', 
          onPress: () => {
            Linking.openURL(`tel:${paramedicPhone}`).catch(() => {
              Alert.alert('Error', 'No se pudo realizar la llamada');
            });
          }
        }
      ]
    );
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
    patient: `${user.nombre} ${user.apellido}`,
    location: currentLocation.direccion,
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

  const handleGoHome = () => {
    Alert.alert(
      '🏠 Regresar al Inicio',
      '¿Deseas regresar a la pantalla principal?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Ir al Inicio', 
          onPress: () => router.replace('/')
        }
      ]
    );
  };

  const handleMapPress = () => {
    setIsMapFullscreen(true);
  };

  const handleCloseFullscreenMap = () => {
    setIsMapFullscreen(false);
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Seguimiento de Emergencia</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Estado Actual */}
        <View style={[styles.statusCard, { 
          backgroundColor: statusConfig.color + '20',
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
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.primary + '30'
          }]}>
            <ThemedText style={styles.cardTitle}>Ubicación en Tiempo Real</ThemedText>
            <TouchableOpacity style={styles.mapContainer} onPress={handleMapPress}>
              <MapboxMap
                latitude={mapCenter.lat}
                longitude={mapCenter.lng}
                zoom={14}
                markers={mapMarkers}
                showCurrentLocation={false}
                interactive={true}
                style={styles.map}
              />
              <View style={styles.mapClickOverlay}>
                <Ionicons name="expand" size={24} color="white" />
                <ThemedText style={styles.mapClickText}>Toca para ampliar</ThemedText>
              </View>
            </TouchableOpacity>
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
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.primary + '30'
        }]}>
          <ThemedText style={styles.cardTitle}>Detalles de la Solicitud</ThemedText>
          
          <View style={styles.infoRow}>
            <Ionicons name="medkit" size={20} color={Colors.light.primary} />
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
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.primary + '30'
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

        {/* Botón para regresar al inicio cuando se complete la emergencia */}
        {currentStatus === 'COMPLETED' && (
          <View style={[styles.completionSection, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          }]}>
            <View style={styles.completionHeader}>
              <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
              <ThemedText style={styles.completionTitle}>¡Emergencia Completada!</ThemedText>
              <ThemedText style={[styles.completionDescription, { 
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
              }]}>
                El servicio de emergencia ha finalizado exitosamente. Esperamos que te encuentres bien.
              </ThemedText>
            </View>
            
            <TouchableOpacity 
              style={styles.homeButton}
              onPress={handleGoHome}
            >
              <Ionicons name="home" size={24} color="white" />
              <ThemedText style={styles.homeButtonText}>Regresar al Inicio</ThemedText>
            </TouchableOpacity>

          <TouchableOpacity 
              style={[styles.secondaryButton, { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
                borderColor: Colors.light.primary
              }]}
              onPress={() => router.push('/emergencia/completado')}
            >
              <Ionicons name="document-text" size={20} color={Colors.light.primary} />
              <ThemedText style={[styles.secondaryButtonText, { color: Colors.light.primary }]}>
                Ver Resumen Completo
              </ThemedText>
          </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal de Mapa en Pantalla Completa */}
      <Modal
        visible={isMapFullscreen}
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.fullscreenMapContainer}>
          <View style={styles.fullscreenMapHeader}>
            <TouchableOpacity 
              style={styles.closeMapButton}
              onPress={handleCloseFullscreenMap}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            <ThemedText style={styles.fullscreenMapTitle}>Seguimiento en Tiempo Real</ThemedText>
            <View style={styles.fullscreenMapStatus}>
              <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
              <ThemedText style={styles.fullscreenStatusText}>{statusConfig.title}</ThemedText>
            </View>
          </View>
          
          <MapboxMap
            latitude={mapCenter.lat}
            longitude={mapCenter.lng}
            zoom={15}
            markers={mapMarkers}
            showCurrentLocation={false}
            interactive={true}
            style={styles.fullscreenMap}
          />
          
          <View style={styles.fullscreenMapFooter}>
            <View style={styles.fullscreenLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendMarker, { backgroundColor: '#FF0000' }]} />
                <ThemedText style={[styles.legendText, { color: 'white' }]}>Tu ubicación</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendMarker, { backgroundColor: '#00FF00' }]} />
                <ThemedText style={[styles.legendText, { color: 'white' }]}>Paramédico</ThemedText>
              </View>
            </View>
            {estimatedTime > 0 && (
              <View style={styles.fullscreenTimeInfo}>
                <Ionicons name="time" size={18} color="white" />
                <ThemedText style={styles.fullscreenTimeText}>
                  Tiempo estimado: {estimatedTime} min
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.white,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.light.primary,
  },
  mapContainer: {
    height: 350,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    flex: 1,
  },
  mapClickOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapClickText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginLeft: 4,
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
    color: Colors.light.primary,
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
    color: Colors.light.primary,
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
  completionSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completionHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4CAF50',
  },
  completionDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  fullscreenMapContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  fullscreenMapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    padding: 16,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  closeMapButton: {
    padding: 8,
    marginRight: 12,
  },
  fullscreenMapTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.white,
    flex: 1,
  },
  fullscreenMapStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: 'white',
  },
  fullscreenStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.white,
  },
  fullscreenMap: {
    flex: 1,
  },
  fullscreenMapFooter: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  fullscreenLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  fullscreenTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullscreenTimeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.white,
    marginLeft: 8,
  },
}); 