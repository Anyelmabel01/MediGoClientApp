import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapboxMap } from '../../components/MapboxMap';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const { height } = Dimensions.get('window');

// Coordenadas simuladas del destino (farmacia)
const pharmacyLocation = {
  latitude: 8.9700,
  longitude: -79.5200,
  name: 'Farmacia Central'
};

// Datos de ejemplo para seguimiento de farmacia
const orderInfo = {
  id: 'FAR-2024-001',
  status: 'En camino',
  deliveryPerson: {
    name: 'Juan Pérez',
    phone: '55-1234-5678'
  },
  estimatedTime: '15-20 min',
  progress: [
    { step: 'Pedido\nconfirmado', completed: true },
    { step: 'En\npreparación', completed: true },
    { step: 'En camino', completed: true },
    { step: 'Entregado', completed: false }
  ]
};

// Función para calcular distancia entre dos puntos
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

// Función para obtener la ruta de Mapbox Directions API
const getMapboxRoute = async (start: any, end: any) => {
  const MAPBOX_API_KEY = "pk.eyJ1Ijoia2V2aW5uMjMiLCJhIjoiY204Y2J0bWN1MTg5ZzJtb2xobXljODM0MiJ9.48MFADtQhp_sFuQjewLFeA";
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?geometries=geojson&access_token=${MAPBOX_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      return {
        coordinates: data.routes[0].geometry.coordinates,
        duration: data.routes[0].duration,
        distance: data.routes[0].distance
      };
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo ruta:', error);
    return null;
  }
};

export default function SeguimientoScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Estados para ubicaciones y ruta
  const [userLocation, setUserLocation] = useState<any>(null);
  const [deliveryLocation, setDeliveryLocation] = useState(pharmacyLocation);
  const [route, setRoute] = useState<any>(null);
  const [routeProgress, setRouteProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [orderStatus, setOrderStatus] = useState('En camino');
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  // Solicitar permisos de ubicación y obtener ubicación actual
  useEffect(() => {
    const getLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para mostrar tu posición en el mapa.');
          return;
        }

        setLocationPermission(true);
        
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        };

        setUserLocation(userCoords);

        // Obtener ruta desde farmacia hasta usuario
        const routeData = await getMapboxRoute(pharmacyLocation, userCoords);
        if (routeData) {
          setRoute(routeData);
          setEstimatedTime(Math.ceil(routeData.duration / 60)); // Convertir a minutos
        }

      } catch (error) {
        console.error('Error obteniendo ubicación:', error);
        Alert.alert('Error', 'No se pudo obtener tu ubicación. Usando ubicación por defecto.');
        // Usar ubicación por defecto en Panama City
        setUserLocation({
          latitude: 8.9824,
          longitude: -79.5199
        });
      }
    };

    getLocationPermission();
  }, []);

  // Simular movimiento del repartidor a lo largo de la ruta
  useEffect(() => {
    if (!route || !route.coordinates || route.coordinates.length === 0) return;

    const moveAlongRoute = () => {
      setRouteProgress(prevProgress => {
        const newProgress = prevProgress + 0.02; // Aumentar 2% cada vez
        
        if (newProgress >= 1) {
          setOrderStatus('Entregado');
          setEstimatedTime(0);
          return 1;
        }

        // Calcular posición en la ruta
        const routeIndex = Math.floor(newProgress * (route.coordinates.length - 1));
        const routeCoord = route.coordinates[routeIndex];
        
        if (routeCoord) {
          setDeliveryLocation({
            latitude: routeCoord[1], // Lat/Lng están invertidos en GeoJSON
            longitude: routeCoord[0],
            name: 'Repartidor en ruta'
          });
        }

        // Actualizar tiempo estimado
        const remainingTime = Math.ceil((1 - newProgress) * (route.duration / 60));
        setEstimatedTime(remainingTime);

        return newProgress;
      });
    };

    const interval = setInterval(moveAlongRoute, 2000); // Actualizar cada 2 segundos
    return () => clearInterval(interval);
  }, [route]);

  const handleClose = () => {
    router.back();
  };

  const handleCallDelivery = () => {
    console.log('Llamando al repartidor:', orderInfo.deliveryPerson.phone);
  };

  // Datos adicionales para la interfaz
  const deliveryData = {
    pharmacyName: pharmacyLocation.name,
    deliveryPersonName: 'Juan Pérez',
    deliveryPersonPhone: '+507 6789-0123',
    deliveryDistance: userLocation ? calculateDistance(
      deliveryLocation.latitude, 
      deliveryLocation.longitude, 
      userLocation.latitude, 
      userLocation.longitude
    ) : '0',
  };

  // Si no tenemos ubicación del usuario aún, mostrar loading
  if (!userLocation) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <Ionicons name="location" size={48} color={Colors.light.primary} />
        <ThemedText style={[styles.loadingText, {
          color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
        }]}>
          Obteniendo tu ubicación...
        </ThemedText>
        <ThemedText style={[styles.loadingSubtext, {
          color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
        }]}>
          Asegúrate de tener activado el GPS
        </ThemedText>
      </ThemedView>
    );
  }

  // Marcadores para el mapa de MapBox
  const mapMarkers = [
    {
      id: 'delivery',
      latitude: deliveryLocation.latitude,
      longitude: deliveryLocation.longitude,
      color: Colors.light.primary,
      title: 'Repartidor'
    },
    {
      id: 'user',
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      color: Colors.light.error,
      title: 'Tu ubicación'
    },
    {
      id: 'pharmacy',
      latitude: pharmacyLocation.latitude,
      longitude: pharmacyLocation.longitude,
      color: '#28a745',
      title: pharmacyLocation.name
    }
  ];

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white
      }]}>
        <ThemedText style={[styles.title, {
          color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
        }]}>
          Seguimiento de entrega
        </ThemedText>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleClose}
        >
          <Ionicons 
            name="close" 
            size={24} 
            color={Colors.light.primary} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Estado principal con MAPA DE MAPBOX */}
        <View style={[styles.statusCard, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white
        }]}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIcon, { backgroundColor: Colors.light.primary }]}>
              <Ionicons name="bicycle" size={32} color="white" />
            </View>
            <View style={styles.statusInfo}>
              <ThemedText style={[styles.statusTitle, { color: Colors.light.primary }]}>
                {orderStatus}
              </ThemedText>
              <ThemedText style={[styles.statusDescription, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {orderStatus === 'Entregado' ? 
                  'Tu pedido ha sido entregado exitosamente' : 
                  'Tu pedido está siendo entregado a tu ubicación'
                }
              </ThemedText>
            </View>
          </View>
          
          {estimatedTime > 0 && (
            <View style={[styles.timeContainer, { backgroundColor: Colors.light.primary + '20' }]}>
              <Ionicons name="time" size={20} color={Colors.light.primary} />
              <ThemedText style={[styles.estimatedTime, { color: Colors.light.primary }]}>
                Tiempo estimado: {estimatedTime} minutos
              </ThemedText>
            </View>
          )}
          
          {/* MAPA DE MAPBOX - NO SIMULACIÓN */}
          <View style={styles.mapContainer}>
            <MapboxMap
              latitude={(deliveryLocation.latitude + userLocation.latitude) / 2}
              longitude={(deliveryLocation.longitude + userLocation.longitude) / 2}
              zoom={13}
              markers={mapMarkers}
              route={route?.coordinates}
              showCurrentLocation={false}
              interactive={true}
              style={styles.map}
            />
            
            {/* Leyenda del mapa */}
            <View style={styles.mapLegend}>
              <View style={styles.legendItem}>
                <Ionicons name="bicycle" size={16} color={Colors.light.primary} />
                <ThemedText style={[styles.legendText, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  Repartidor
                </ThemedText>
              </View>
              <View style={styles.legendItem}>
                <Ionicons name="person" size={16} color={Colors.light.error} />
                <ThemedText style={[styles.legendText, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  Tu ubicación
                </ThemedText>
              </View>
              <View style={styles.legendItem}>
                <Ionicons name="storefront" size={16} color="#28a745" />
                <ThemedText style={[styles.legendText, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  Farmacia
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Información de entrega y repartidor */}
        <View style={[styles.infoCard, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white
        }]}>
          <ThemedText style={[styles.cardTitle, { color: Colors.light.primary }]}>
            Información de Entrega
          </ThemedText>
          
          <View style={styles.infoRow}>
            <Ionicons name="storefront" size={20} color={Colors.light.primary} />
            <View style={styles.infoContent}>
              <ThemedText style={[styles.infoLabel, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                Farmacia:
              </ThemedText>
              <ThemedText style={[styles.infoValue, {
                color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
              }]}>
                {deliveryData.pharmacyName}
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={Colors.light.primary} />
            <View style={styles.infoContent}>
              <ThemedText style={[styles.infoLabel, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                Repartidor:
              </ThemedText>
              <ThemedText style={[styles.infoValue, {
                color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
              }]}>
                {deliveryData.deliveryPersonName}
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={Colors.light.primary} />
            <View style={styles.infoContent}>
              <ThemedText style={[styles.infoLabel, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                Distancia:
              </ThemedText>
              <ThemedText style={[styles.infoValue, {
                color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
              }]}>
                {deliveryData.deliveryDistance}m aprox.
              </ThemedText>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.infoRow, styles.callButton]}
            onPress={handleCallDelivery}
          >
            <Ionicons name="call" size={20} color="white" />
            <View style={styles.infoContent}>
              <ThemedText style={[styles.infoValue, { color: 'white' }]}>
                Llamar Repartidor
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Progreso de entrega */}
        <View style={[styles.progressCard, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white
        }]}>
          <ThemedText style={[styles.progressTitle, {
            color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
          }]}>
            Progreso de entrega
          </ThemedText>
          
          <View style={styles.progressContainer}>
            {orderInfo.progress.map((item, index) => (
              <View key={index} style={styles.progressStep}>
                <View style={styles.progressIconContainer}>
                  <Ionicons 
                    name={item.completed ? 'checkmark-circle' : 'ellipse-outline'} 
                    size={24} 
                    color={item.completed ? Colors.light.primary : '#ccc'} 
                  />
                  {index < orderInfo.progress.length - 1 && (
                    <View style={[styles.progressLine, {
                      backgroundColor: item.completed ? Colors.light.primary : '#ccc'
                    }]} />
                  )}
                </View>
                <ThemedText style={[styles.progressStepText, {
                  color: item.completed 
                    ? (isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary)
                    : '#999',
                  fontWeight: item.completed ? '600' : 'normal'
                }]}>
                  {item.step}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  statusCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    fontSize: 20,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  estimatedTime: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  mapContainer: {
    height: height * 0.4,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapLegend: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    marginLeft: 4,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  callButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressIconContainer: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  progressLine: {
    position: 'absolute',
    top: 12,
    left: 24,
    width: 60,
    height: 2,
    zIndex: -1,
  },
  progressStepText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 