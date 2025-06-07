import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/hooks/useLocation';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Dimensions, Linking, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapboxMap } from '../../components/MapboxMap';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { calculateDistance, calculateNextPosition, getOptimalMapView, getRoute, RouteInfo } from '../../utils/mapboxDirections';


const { height } = Dimensions.get('window');

type DeliveryStatus = 'PAID' | 'CONFIRMED' | 'PREPARING' | 'IN_PROGRESS' | 'ARRIVING' | 'DELIVERED';

const STATUS_CONFIG = {
  PAID: {
    title: 'Pago Confirmado',
    description: 'Tu pedido fue procesado. Preparando medicamentos...',
    color: '#FF9800',
    icon: 'card' as const,
  },
  CONFIRMED: {
    title: 'Pedido Confirmado',
    description: 'Farmacia confirmó tu pedido y está preparando los medicamentos',
    color: '#2196F3',
    icon: 'checkmark-circle' as const,
  },
  PREPARING: {
    title: 'En Preparación',
    description: 'Los medicamentos están siendo preparados para envío',
    color: '#FF9800',
    icon: 'medical' as const,
  },
  IN_PROGRESS: {
    title: 'En Camino',
    description: 'El repartidor está en ruta hacia tu ubicación',
    color: '#FF9800',
    icon: 'bicycle' as const,
  },
  ARRIVING: {
    title: 'Llegando',
    description: 'El repartidor está muy cerca (menos de 3 minutos)',
    color: '#4CAF50',
    icon: 'location' as const,
  },
  DELIVERED: {
    title: 'Entregado',
    description: 'Tu pedido ha sido entregado exitosamente',
    color: '#4CAF50',
    icon: 'checkmark-done' as const,
  },
};

// Coordenadas de la farmacia (fijas) - CORREGIDAS para estar en tierra
const pharmacyLocation = {
  lat: 8.9831, // Calle 50, área comercial
  lng: -79.5175, // Coordenadas terrestres
  name: 'Farmacia Central'
};

// Datos de ejemplo para seguimiento de farmacia
const orderInfo = {
  id: 'FAR-2024-001',
  deliveryPerson: {
    name: 'Juan Pérez',
    phone: '+507 6789-0123'
  }
};

export default function SeguimientoScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  
  // Hook de ubicación real del usuario
  const { 
    location: userLocation, 
    isLoading: locationLoading, 
    error: locationError,
    hasPermission,
    getCurrentLocation,
    requestLocationPermission 
  } = useLocation(true); // watchPosition = true para seguimiento en tiempo real
  
  // Estados principales
  const [currentStatus, setCurrentStatus] = useState<DeliveryStatus>('PAID');
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [requestId] = useState('FAR-' + Date.now().toString().slice(-6));
  
  // Ubicación del usuario (real)
  const customerLocation = useMemo(() => {
    if (userLocation) {
      return {
        lat: userLocation.latitude,
        lng: userLocation.longitude
      };
    }
    // Ubicación por defecto (Ciudad de Panamá) si no hay ubicación real
    return {
      lat: 8.9824,
      lng: -79.5199
    };
  }, [userLocation]);
  
  // Ubicación inicial del repartidor (simulada cerca de la farmacia)
  const [deliveryStartLocation] = useState(() => {
    // Colocar al repartidor en la farmacia inicialmente (coordenadas terrestres)
    return {
      lat: pharmacyLocation.lat,
      lng: pharmacyLocation.lng
    };
  });
  
  // Estados del mapa y ruta
  const [deliveryLocation, setDeliveryLocation] = useState(deliveryStartLocation);
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [routeProgress, setRouteProgress] = useState(0); // 0 a 1
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [deliveryMovementStep, setDeliveryMovementStep] = useState(0); // Para controlar el movimiento paso a paso
  
  // Referencias para optimización
  const statusIntervalRef = useRef<number | null>(null);
  const movementIntervalRef = useRef<number | null>(null);
  const lastRouteRef = useRef<RouteInfo | null>(null);

  // Obtener la ruta inicial cuando se confirma el pedido
  const fetchRoute = useCallback(async () => {
    if (isLoadingRoute || route || !userLocation) return;
    
    setIsLoadingRoute(true);
    try {
      const routeData = await getRoute(
        pharmacyLocation,
        customerLocation,
        'driving-traffic'
      );
      
      if (routeData) {
        setRoute(routeData);
        lastRouteRef.current = routeData;
        
        // Actualizar tiempo estimado basado en la ruta real
        setEstimatedTime(Math.max(1, routeData.duration));
        console.log('Ruta obtenida:', {
          distance: routeData.distance,
          duration: routeData.duration,
          points: routeData.coordinates.length,
          origin: pharmacyLocation,
          destination: customerLocation
        });
      }
    } catch (error) {
      console.error('Error obteniendo ruta:', error);
    } finally {
      setIsLoadingRoute(false);
    }
  }, [userLocation, customerLocation, isLoadingRoute, route]);

  // Simular movimiento del repartidor siguiendo la ruta real
  useEffect(() => {
    if (!route || currentStatus === 'DELIVERED' || route.coordinates.length === 0) {
      return;
    }

    movementIntervalRef.current = setInterval(() => {
      setDeliveryMovementStep(prevStep => {
        // Calcular la velocidad de movimiento basada en el estado
        let stepIncrement = 0.5; // puntos por intervalo por defecto
        
        switch (currentStatus) {
          case 'CONFIRMED':
            stepIncrement = 0.3; // Más lento al inicio
            break;
          case 'IN_PROGRESS':
            stepIncrement = 0.5; // Velocidad normal
            break;
          case 'ARRIVING':
            stepIncrement = 0.8; // Más rápido al final
            break;
        }
        
        const newStep = prevStep + stepIncrement;
        const maxSteps = route.coordinates.length - 1;
        
        if (newStep >= maxSteps) {
          // Ha llegado al destino
          setRouteProgress(1);
          setEstimatedTime(0);
          // Cambiar estado a completado después de un breve delay
          setTimeout(() => {
            setCurrentStatus('DELIVERED');
          }, 3000); // 3 segundos para que se vea que llegó
          return maxSteps;
        }
        
        // Calcular progreso real basado en el paso actual
        const realProgress = newStep / maxSteps;
        setRouteProgress(realProgress);
        
        // Calcular nueva posición del repartidor
        const newPosition = calculateNextPosition(
          deliveryLocation,
          route.coordinates,
          realProgress
        );
        setDeliveryLocation(newPosition);
        
        // Actualizar tiempo estimado basado en el progreso real
        const remainingProgress = 1 - realProgress;
        const remainingTime = Math.ceil(remainingProgress * (route.duration || 5));
        setEstimatedTime(Math.max(0, remainingTime));
        
        console.log(`Repartidor progreso: ${(realProgress * 100).toFixed(1)}%, paso: ${newStep}/${maxSteps}, tiempo restante: ${remainingTime}min`);
        
        return newStep;
      });
    }, 3000); // Mover cada 3 segundos para un movimiento más visible y controlado
    
    return () => {
      if (movementIntervalRef.current) {
        clearInterval(movementIntervalRef.current);
      }
    };
  }, [route, currentStatus, deliveryLocation]);

  // Simular progreso de estados
  useEffect(() => {
    const statusProgression: DeliveryStatus[] = ['PAID', 'CONFIRMED', 'PREPARING', 'IN_PROGRESS', 'ARRIVING'];
    let currentIndex = 0;
    
    statusIntervalRef.current = setInterval(() => {
      if (currentIndex < statusProgression.length - 1) {
        currentIndex++;
        const newStatus = statusProgression[currentIndex];
        setCurrentStatus(newStatus);
        
        // Acciones específicas por estado
        if (newStatus === 'CONFIRMED') {
          setShowMap(true);
          if (userLocation) {
            fetchRoute(); // Obtener ruta real al confirmar
          }
        } else if (newStatus === 'ARRIVING') {
          // Cuando está llegando, solo cambiar a arriving si está cerca
          setEstimatedTime(2);
        }
      }
    }, 8000); // Cambiar estado cada 8 segundos
    
    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
    };
  }, [fetchRoute, userLocation]);

  // Calcular vista óptima del mapa - usar solo la ruta para determinar la vista, no las posiciones cambiantes
  const mapView = useMemo(() => {
    if (route?.coordinates) {
      // Usar la ruta completa para calcular la vista óptima de una vez
      return getOptimalMapView(
        customerLocation,
        { lat: pharmacyLocation.lat, lng: pharmacyLocation.lng }, // Usar posición fija de farmacia
        route.coordinates
      );
    }
    // Vista por defecto si no hay ruta
    return getOptimalMapView(
      customerLocation,
      { lat: pharmacyLocation.lat, lng: pharmacyLocation.lng }
    );
  }, [customerLocation, route]); // Remover deliveryLocation de las dependencias

  // Marcadores del mapa
  const mapMarkers = useMemo(() => [
    {
      id: 'customer',
      latitude: customerLocation.lat,
      longitude: customerLocation.lng,
      color: '#FF4444', // Rojo más vibrante
      title: '📍 Tu Ubicación'
    },
    {
      id: 'delivery',
      latitude: deliveryLocation.lat,
      longitude: deliveryLocation.lng,
      color: '#00DD00', // Verde más vibrante
      title: `🚴‍♂️ Repartidor (${estimatedTime}min)`
    },
    {
      id: 'pharmacy',
      latitude: pharmacyLocation.lat,
      longitude: pharmacyLocation.lng,
      color: '#2196F3', // Azul vibrante
      title: `🏥 ${pharmacyLocation.name}`
    }
  ], [customerLocation, deliveryLocation, estimatedTime, pharmacyLocation.name]);

  // Handlers
  const handleCallDelivery = useCallback(() => {
    const deliveryPhone = orderInfo.deliveryPerson.phone;
    Alert.alert(
      '📞 Llamar Repartidor',
      `¿Deseas llamar a ${orderInfo.deliveryPerson.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Llamar', 
          onPress: () => {
            Linking.openURL(`tel:${deliveryPhone}`).catch(() => {
              Alert.alert('Error', 'No se pudo realizar la llamada');
            });
          }
        }
      ]
    );
  }, []);

  const handleGoHome = useCallback(() => {
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
  }, [router]);

  const handleMapPress = useCallback(() => {
    setIsMapFullscreen(true);
  }, []);

  const handleCloseFullscreenMap = useCallback(() => {
    setIsMapFullscreen(false);
  }, []);

  const handleRefreshLocation = useCallback(async () => {
    try {
      await getCurrentLocation();
      Alert.alert('Ubicación actualizada', 'Tu ubicación ha sido actualizada correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la ubicación. Intenta nuevamente.');
    }
  }, [getCurrentLocation]);

  // Datos de la entrega
  const deliveryData = useMemo(() => ({
    pharmacyName: pharmacyLocation.name,
    customer: `${user?.nombre || 'Usuario'} ${user?.apellido || 'Apellido'}`,
    location: userLocation?.address || 
              `${customerLocation.lat.toFixed(4)}, ${customerLocation.lng.toFixed(4)}`,
    orderTime: new Date().toLocaleTimeString(),
    deliveryPersonName: orderInfo.deliveryPerson.name,
    deliveryPersonPhone: orderInfo.deliveryPerson.phone,
    deliveryDistance: calculateDistance(
      deliveryLocation.lat, 
      deliveryLocation.lng, 
      customerLocation.lat, 
      customerLocation.lng
    ),
    routeDistance: route?.distance || 0,
    routeProgress: Math.round(routeProgress * 100)
  }), [user, userLocation, deliveryLocation, customerLocation, route, routeProgress]);

  const statusConfig = STATUS_CONFIG[currentStatus];

  // Manejar errores de permisos
  useEffect(() => {
    if (locationError && !hasPermission) {
      Alert.alert(
        'Ubicación Requerida',
        'Necesitamos acceso a tu ubicación para el seguimiento de entregas. ¿Deseas conceder permisos?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Conceder', onPress: requestLocationPermission }
        ]
      );
    }
  }, [locationError, hasPermission, requestLocationPermission]);

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
        <ThemedText style={styles.title}>Seguimiento de Entrega</ThemedText>
        {showMap && (
          <View style={styles.progressIndicator}>
            <ThemedText style={styles.progressText}>{Math.round(routeProgress * 100)}%</ThemedText>
          </View>
        )}
        {userLocation && (
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={handleRefreshLocation}
          >
            <Ionicons name="refresh" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Indicador de estado de ubicación */}
        {(locationLoading || locationError) && (
          <View style={[styles.locationStatus, {
            backgroundColor: locationError ? '#FFEBEE' : '#E3F2FD'
          }]}>
            <Ionicons 
              name={locationLoading ? "location" : "warning"} 
              size={20} 
              color={locationError ? '#F44336' : '#2196F3'} 
            />
            <ThemedText style={[styles.locationStatusText, {
              color: locationError ? '#F44336' : '#2196F3'
            }]}>
              {locationLoading ? 'Obteniendo tu ubicación...' : 
               locationError ? 'Error: ' + locationError : 
               'Ubicación obtenida correctamente'}
            </ThemedText>
            {!hasPermission && (
              <TouchableOpacity 
                style={styles.permissionButton}
                onPress={requestLocationPermission}
              >
                <ThemedText style={styles.permissionButtonText}>Permitir</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        )}

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
              {route && (
                <ThemedText style={[styles.routeInfo, { color: statusConfig.color }]}>
                  • Distancia: {(deliveryData.routeDistance / 1000).toFixed(1)}km
                </ThemedText>
              )}
            </View>
          )}
        </View>

        {/* Mapa de Tracking en Tiempo Real */}
        {showMap && userLocation && (
          <View style={[styles.infoCard, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.primary + '30'
          }]}>
            <ThemedText style={styles.cardTitle}>
              Ubicación en Tiempo Real 
              {isLoadingRoute && <ThemedText style={styles.loadingText}> (Cargando ruta...)</ThemedText>}
            </ThemedText>
            <TouchableOpacity style={styles.mapContainer} onPress={handleMapPress}>
              <MapboxMap
                latitude={mapView.center.lat}
                longitude={mapView.center.lng}
                zoom={mapView.zoom}
                markers={mapMarkers}
                route={route?.coordinates}
                routeColor="#FF0000"
                routeWidth={6}
                showCurrentLocation={false}
                interactive={false}
                style={styles.map}
                key={route ? 'with-route' : 'no-route'}
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
                <View style={[styles.legendMarker, { backgroundColor: '#00AA00' }]} />
                <ThemedText style={styles.legendText}>Repartidor ({deliveryData.routeProgress}%)</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendMarker, { backgroundColor: '#28a745' }]} />
                <ThemedText style={styles.legendText}>Farmacia</ThemedText>
              </View>
              {route && (
                <View style={styles.legendItem}>
                  <View style={[styles.legendMarker, { backgroundColor: '#FF0000' }]} />
                  <ThemedText style={styles.legendText}>Ruta ({(deliveryData.routeDistance / 1000).toFixed(1)}km)</ThemedText>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Mensaje cuando no hay ubicación */}
        {showMap && !userLocation && (
          <View style={[styles.infoCard, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            borderColor: '#FF9800'
          }]}>
            <View style={styles.noLocationContainer}>
              <Ionicons name="location-outline" size={48} color="#FF9800" />
              <ThemedText style={styles.noLocationTitle}>Ubicación Requerida</ThemedText>
              <ThemedText style={styles.noLocationText}>
                Para mostrarte el seguimiento en tiempo real necesitamos acceso a tu ubicación.
              </ThemedText>
              <TouchableOpacity 
                style={styles.enableLocationButton}
                onPress={requestLocationPermission}
              >
                <Ionicons name="location" size={20} color="white" />
                <ThemedText style={styles.enableLocationText}>Habilitar Ubicación</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Información de la Solicitud */}
        <View style={[styles.infoCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.primary + '30'
        }]}>
          <ThemedText style={styles.cardTitle}>Detalles de la Entrega</ThemedText>
          
          <View style={styles.infoRow}>
            <Ionicons name="medical" size={20} color={Colors.light.primary} />
            <ThemedText style={styles.infoLabel}>Tipo:</ThemedText>
            <ThemedText style={styles.infoValue}>Entrega de Farmacia</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={Colors.light.primary} />
            <ThemedText style={styles.infoLabel}>Cliente:</ThemedText>
            <ThemedText style={styles.infoValue}>{deliveryData.customer}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons 
              name={userLocation ? "location" : "location-outline"} 
              size={20} 
              color={userLocation ? Colors.light.primary : '#FF9800'} 
            />
            <ThemedText style={styles.infoLabel}>Ubicación:</ThemedText>
            <ThemedText style={[styles.infoValue, {
              color: userLocation ? undefined : '#FF9800'
            }]}>
              {userLocation ? deliveryData.location : 'Obteniendo ubicación...'}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={Colors.light.primary} />
            <ThemedText style={styles.infoLabel}>Hora:</ThemedText>
            <ThemedText style={styles.infoValue}>{deliveryData.orderTime}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="bicycle" size={20} color={Colors.light.primary} />
            <ThemedText style={styles.infoLabel}>ID Pedido:</ThemedText>
            <ThemedText style={styles.infoValue}>{requestId}</ThemedText>
          </View>
        </View>

        {/* Información del Repartidor */}
        {(currentStatus === 'CONFIRMED' || currentStatus === 'IN_PROGRESS' || currentStatus === 'ARRIVING') && (
          <View style={[styles.infoCard, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.primary + '30'
          }]}>
            <ThemedText style={styles.cardTitle}>Información del Repartidor</ThemedText>
            
            <View style={styles.paramedicInfo}>
              <View style={styles.paramedicAvatar}>
                <Ionicons name="bicycle" size={32} color={Colors.light.primary} />
              </View>
              <View style={styles.paramedicDetails}>
                <ThemedText style={styles.paramedicName}>{deliveryData.deliveryPersonName}</ThemedText>
                <ThemedText style={[styles.paramedicDistance, { 
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
                }]}>
                  Distancia directa: {deliveryData.deliveryDistance}m
                </ThemedText>
                {route && (
                  <ThemedText style={[styles.paramedicDistance, { 
                    color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
                  }]}>
                    Por carretera: {(deliveryData.routeDistance / 1000).toFixed(1)}km
                  </ThemedText>
                )}
              </View>
              <TouchableOpacity 
                style={styles.callButton}
                onPress={handleCallDelivery}
              >
                <Ionicons name="call" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Botón para regresar al inicio cuando se complete la entrega */}
        {currentStatus === 'DELIVERED' && (
          <View style={[styles.completionSection, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          }]}>
            <View style={styles.completionHeader}>
              <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
              <ThemedText style={styles.completionTitle}>¡Entrega Completada!</ThemedText>
              <ThemedText style={[styles.completionDescription, { 
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
              }]}>
                Tu pedido de farmacia ha sido entregado exitosamente. ¡Esperamos que tengas una pronta recuperación!
              </ThemedText>
              {route && (
                <ThemedText style={[styles.completionStats, { 
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
                }]}>
                  Distancia recorrida: {(deliveryData.routeDistance / 1000).toFixed(1)}km
                </ThemedText>
              )}
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
              onPress={() => router.push('/farmacia')}
            >
              <Ionicons name="medical" size={20} color={Colors.light.primary} />
              <ThemedText style={[styles.secondaryButtonText, { color: Colors.light.primary }]}>
                Hacer Otro Pedido
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
          
          {userLocation ? (
            <MapboxMap
              latitude={mapView.center.lat}
              longitude={mapView.center.lng}
              zoom={Math.max(mapView.zoom, 14)}
              markers={mapMarkers}
              route={route?.coordinates}
              routeColor="#FF0000"
              routeWidth={6}
              showCurrentLocation={false}
              interactive={true}
              style={styles.fullscreenMap}
            />
          ) : (
            <View style={styles.fullscreenNoLocation}>
              <Ionicons name="location-outline" size={64} color="#999" />
              <ThemedText style={styles.fullscreenNoLocationText}>
                Esperando ubicación del usuario...
              </ThemedText>
            </View>
          )}
          
          <View style={styles.fullscreenMapFooter}>
            <View style={styles.fullscreenLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendMarker, { backgroundColor: '#FF0000' }]} />
                <ThemedText style={[styles.legendText, { color: 'white' }]}>Tu ubicación</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendMarker, { backgroundColor: '#00AA00' }]} />
                <ThemedText style={[styles.legendText, { color: 'white' }]}>
                  Repartidor ({deliveryData.routeProgress}%)
                </ThemedText>
              </View>
              {route && (
                <View style={styles.legendItem}>
                  <View style={[styles.legendMarker, { backgroundColor: '#FF0000' }]} />
                  <ThemedText style={[styles.legendText, { color: 'white' }]}>
                    Ruta ({(deliveryData.routeDistance / 1000).toFixed(1)}km)
                  </ThemedText>
                </View>
              )}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.white,
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  locationStatusText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
    color: Colors.light.textSecondary,
  },
  timeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  estimatedTime: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  routeInfo: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    marginTop: 4,
  },
  mapContainer: {
    height: height * 0.5,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
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
  noLocationContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noLocationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 12,
    marginBottom: 8,
  },
  noLocationText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  enableLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  enableLocationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mapLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  infoContent: {
    marginLeft: 12,
    flex: 1,
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
  callButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 2,
  },
  completionSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
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
    marginBottom: 8,
  },
  completionStats: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
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
    borderWidth: 1,
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
  fullscreenNoLocation: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  fullscreenNoLocationText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
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
    flexWrap: 'wrap',
  },
  fullscreenTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenTimeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.white,
    marginLeft: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.light.textSecondary,
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  progressIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  locationButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
}); 