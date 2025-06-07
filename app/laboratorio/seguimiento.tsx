import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MapboxMap } from '../../components/MapboxMap';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { RouteInfo } from '../../utils/mapboxDirections';

const { height } = Dimensions.get('window');

type DeliveryStatus = 'PROCESSING' | 'PREPARED' | 'COLLECTED' | 'IN_TRANSIT' | 'DELIVERED';

const STATUS_CONFIG = {
  PROCESSING: {
    title: 'Procesando Muestra',
    description: 'Tu muestra está siendo procesada en el laboratorio',
    color: Colors.light.primary,
    icon: 'flask' as const,
  },
  PREPARED: {
    title: 'Resultado Listo',
    description: 'Tu resultado está listo y será enviado pronto',
    color: '#FF9800',
    icon: 'checkmark-circle' as const,
  },
  COLLECTED: {
    title: 'Resultado Recolectado',
    description: 'Nuestro repartidor ha recolectado tu resultado del laboratorio',
    color: '#2196F3',
    icon: 'briefcase' as const,
  },
  IN_TRANSIT: {
    title: 'En Camino',
    description: 'Tu resultado está siendo entregado a tu ubicación',
    color: '#FF9800',
    icon: 'bicycle' as const,
  },
  DELIVERED: {
    title: 'Entregado',
    description: 'Tu resultado ha sido entregado exitosamente',
    color: Colors.light.success,
    icon: 'checkmark-done' as const,
  },
};

export default function LaboratorioSeguimientoScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [currentStatus, setCurrentStatus] = useState<DeliveryStatus>('PROCESSING');
  const [estimatedTime, setEstimatedTime] = useState(45);
  const [orderId] = useState('LAB-' + Date.now().toString().slice(-6));
  const [deliveryLocation, setDeliveryLocation] = useState({ lat: 8.9831, lng: -79.5175 }); // Laboratorio en tierra
  const [userLocation] = useState({ lat: 8.9824, lng: -79.5199 }); // Ubicación del usuario
  const [route, setRoute] = useState<RouteInfo | null>(null);
  
  // Simular progreso de estados y movimiento del repartidor
  useEffect(() => {
    const statusProgression: DeliveryStatus[] = ['PROCESSING', 'PREPARED', 'COLLECTED', 'IN_TRANSIT'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < statusProgression.length - 1) {
        currentIndex++;
        setCurrentStatus(statusProgression[currentIndex]);
        
        // Actualizar tiempo estimado
        if (statusProgression[currentIndex] === 'PREPARED') {
          setEstimatedTime(30);
        } else if (statusProgression[currentIndex] === 'COLLECTED') {
          setEstimatedTime(15);
        } else if (statusProgression[currentIndex] === 'IN_TRANSIT') {
          setEstimatedTime(10);
        }
      }
    }, 8000); // Cambiar estado cada 8 segundos para demo
    
    return () => clearInterval(interval);
  }, []);

  // Simular movimiento del repartidor hacia el usuario
  useEffect(() => {
    const moveTowardsUser = () => {
      setDeliveryLocation(prevLocation => {
        const latDiff = userLocation.lat - prevLocation.lat;
        const lngDiff = userLocation.lng - prevLocation.lng;
        
        // Mover 8% más cerca en cada actualización
        const moveSpeed = 0.08;
        
        const newLocation = {
          lat: prevLocation.lat + (latDiff * moveSpeed),
          lng: prevLocation.lng + (lngDiff * moveSpeed)
        };

        // Verificar si llegó al destino
        const distance = Math.sqrt(
          Math.pow(newLocation.lat - userLocation.lat, 2) + 
          Math.pow(newLocation.lng - userLocation.lng, 2)
        );

        if (distance < 0.001) { // Muy cerca del destino
          setCurrentStatus('DELIVERED');
          setEstimatedTime(0);
        }
        
        return newLocation;
      });
    };

    const interval = setInterval(moveTowardsUser, 2000); // Actualizar cada 2 segundos
    return () => clearInterval(interval);
  }, [userLocation]);

  const handleCallDelivery = () => {
    console.log('Llamando al repartidor...');
  };

  const handleCallLab = () => {
    console.log('Llamando al laboratorio...');
  };

  const handleViewResult = () => {
    router.push('/laboratorio/resultados' as any);
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

  const testData = {
    testName: 'Hemograma Completo',
    laboratory: 'Laboratorio Central Plaza',
    patientName: 'Juan Pérez',
    testDate: new Date().toLocaleDateString(),
    deliveryPersonName: 'Carlos Mendoza',
    deliveryPersonPhone: '+507 6789-0123',
    deliveryDistance: calculateDistance(
      deliveryLocation.lat, 
      deliveryLocation.lng, 
      userLocation.lat, 
      userLocation.lng
    ),
  };

  const statusConfig = STATUS_CONFIG[currentStatus];

  const mapMarkers = [
    {
      id: 'user',
      latitude: userLocation.lat,
      longitude: userLocation.lng,
      color: '#FF4444', // Rojo vibrante
      title: '📍 Tu Ubicación'
    },
    {
      id: 'delivery',
      latitude: deliveryLocation.lat,
      longitude: deliveryLocation.lng,
      color: '#00DD00', // Verde vibrante
      title: `🚴‍♂️ Repartidor (${estimatedTime}min)`
    },
    {
      id: 'laboratory',
      latitude: 8.9831, // Ubicación del laboratorio en tierra
      longitude: -79.5175,
      color: '#2196F3', // Azul vibrante
      title: `🏥 ${testData.laboratory}`
    }
  ];

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <LinearGradient
        colors={['#00A0B0', '#0081B0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.greetingContainer}>
            <ThemedText style={styles.title}>Seguimiento de Resultado</ThemedText>
            <View style={styles.editProfileIndicator}>
              <Ionicons name="location" size={14} color={Colors.light.primary} />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={() => console.log('Actualizar seguimiento')}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estado Actual */}
        <View style={[styles.statusCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          borderColor: statusConfig.color,
          shadowColor: Colors.light.shadowColor
        }]}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIcon, { backgroundColor: statusConfig.color }]}>
              <Ionicons name={statusConfig.icon} size={32} color="white" />
            </View>
            <View style={styles.statusInfo}>
              <ThemedText style={[styles.statusTitle, { color: statusConfig.color }]}>
                {statusConfig.title}
              </ThemedText>
              <ThemedText style={[styles.statusDescription, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {statusConfig.description}
              </ThemedText>
            </View>
          </View>
          
          {estimatedTime > 0 && (
            <View style={[styles.timeContainer, { backgroundColor: statusConfig.color + '20' }]}>
              <Ionicons name="time" size={20} color={statusConfig.color} />
              <ThemedText style={[styles.estimatedTime, { color: statusConfig.color }]}>
                Tiempo estimado: {estimatedTime} minutos
              </ThemedText>
            </View>
          )}
        </View>

        {/* Mapa de Tracking en Tiempo Real - GRANDE Y PROMINENTE */}
        <View style={[styles.mapCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          shadowColor: Colors.light.shadowColor
        }]}>
          <ThemedText style={[styles.mapTitle, { color: Colors.light.primary }]}>
            Ubicación en Tiempo Real
          </ThemedText>
          <View style={styles.mapWrapper}>
            <MapboxMap
              latitude={(deliveryLocation.lat + userLocation.lat) / 2}
              longitude={(deliveryLocation.lng + userLocation.lng) / 2}
              zoom={16}
              markers={mapMarkers}
              route={route?.coordinates}
              routeColor="#FF0000"
              routeWidth={6}
              showCurrentLocation={false}
              interactive={true}
              style={styles.map}
            />
          </View>
          <View style={styles.mapLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendMarker, { backgroundColor: '#00DD00' }]} />
              <ThemedText style={[styles.legendText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>Repartidor</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendMarker, { backgroundColor: '#FF4444' }]} />
              <ThemedText style={[styles.legendText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>Tu ubicación</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendMarker, { backgroundColor: '#2196F3' }]} />
              <ThemedText style={[styles.legendText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>Laboratorio</ThemedText>
            </View>
          </View>
          
          {/* Información del Repartidor */}
          <View style={styles.deliveryPersonInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color={Colors.light.primary} />
              <View style={styles.infoTextContainer}>
                <ThemedText style={[styles.infoLabel, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>Repartidor:</ThemedText>
                <ThemedText style={styles.infoValue}>{testData.deliveryPersonName}</ThemedText>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color={Colors.light.primary} />
              <View style={styles.infoTextContainer}>
                <ThemedText style={[styles.infoLabel, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>Distancia:</ThemedText>
                <ThemedText style={styles.infoValue}>{testData.deliveryDistance}m aprox.</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Información del Pedido */}
        <View style={[styles.infoCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          shadowColor: Colors.light.shadowColor
        }]}>
          <ThemedText style={[styles.cardTitle, { color: Colors.light.primary }]}>
            Información del Pedido
          </ThemedText>
          <View style={styles.infoRow}>
            <Ionicons name="document-text" size={20} color={Colors.light.primary} />
            <View style={styles.infoTextContainer}>
              <ThemedText style={[styles.infoLabel, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>Prueba:</ThemedText>
              <ThemedText style={styles.infoValue}>{testData.testName}</ThemedText>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="business" size={20} color={Colors.light.primary} />
            <View style={styles.infoTextContainer}>
              <ThemedText style={[styles.infoLabel, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>Laboratorio:</ThemedText>
              <ThemedText style={styles.infoValue}>{testData.laboratory}</ThemedText>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color={Colors.light.primary} />
            <View style={styles.infoTextContainer}>
              <ThemedText style={[styles.infoLabel, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>Fecha de Muestra:</ThemedText>
              <ThemedText style={styles.infoValue}>{testData.testDate}</ThemedText>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="card" size={20} color={Colors.light.primary} />
            <View style={styles.infoTextContainer}>
              <ThemedText style={[styles.infoLabel, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>ID de Orden:</ThemedText>
              <ThemedText style={styles.infoValue}>{orderId}</ThemedText>
            </View>
          </View>
        </View>

        {/* Progreso de Entrega */}
        <View style={[styles.infoCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          shadowColor: Colors.light.shadowColor
        }]}>
          <ThemedText style={[styles.cardTitle, { color: Colors.light.primary }]}>
            Progreso de Entrega
          </ThemedText>
          <View style={styles.progressSteps}>
            {Object.entries(STATUS_CONFIG).map(([key, config], index) => {
              const isCompleted = Object.keys(STATUS_CONFIG).indexOf(currentStatus) >= index;
              const isCurrent = key === currentStatus;
              
              return (
                <View key={key} style={styles.progressStep}>
                  <View style={[
                    styles.stepCircle, 
                    isCompleted && styles.completedStepCircle,
                    isCurrent && { backgroundColor: config.color }
                  ]}>
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    ) : (
                      <ThemedText style={[styles.stepNumber, {
                        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                      }]}>{index + 1}</ThemedText>
                    )}
                  </View>
                  <ThemedText style={[styles.stepText, {
                    color: isCompleted ? config.color : (isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary),
                    fontWeight: isCurrent ? 'bold' : 'normal'
                  }]}>
                    {config.title}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtons}>
          {currentStatus !== 'DELIVERED' && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: Colors.light.primary }]}
              onPress={handleCallDelivery}
            >
              <Ionicons name="call" size={20} color="white" />
              <ThemedText style={styles.actionButtonText}>Llamar Repartidor</ThemedText>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionButton, { 
              backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.border,
              borderWidth: 1,
              borderColor: Colors.light.primary
            }]}
            onPress={handleCallLab}
          >
            <Ionicons name="business" size={20} color={Colors.light.primary} />
            <ThemedText style={[styles.actionButtonText, { color: Colors.light.primary }]}>
              Llamar Laboratorio
            </ThemedText>
          </TouchableOpacity>
          
          {currentStatus === 'DELIVERED' && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: Colors.light.success }]}
              onPress={handleViewResult}
            >
              <Ionicons name="document-text" size={20} color="white" />
              <ThemedText style={styles.actionButtonText}>Ver Resultado</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerGradient: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 60,
  },
  headerSpacer: {
    width: 40,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  statusCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  mapCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 12,
  },
  mapWrapper: {
    height: height * 0.5, // Aumentar de 0.4 a 0.5 para mejor visualización
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
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
    marginBottom: 12,
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
  deliveryPersonInfo: {
    marginTop: 8,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  progressStep: {
    alignItems: 'center',
    width: '18%',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedStepCircle: {
    backgroundColor: Colors.light.success,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
  actionButtons: {
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  refreshButton: {
    padding: 5,
  },
}); 