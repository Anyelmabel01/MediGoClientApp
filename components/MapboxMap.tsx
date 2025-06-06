import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from './ThemedText';

const { width, height } = Dimensions.get('window');

interface MapboxMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  markers?: {
    id: string;
    latitude: number;
    longitude: number;
    color?: string;
    title?: string;
  }[];
  route?: [number, number][]; // Coordenadas de la ruta [lng, lat]
  showCurrentLocation?: boolean;
  interactive?: boolean;
  style?: any;
  routeColor?: string;
  routeWidth?: number;
}

const MAPBOX_API_KEY = "pk.eyJ1Ijoia2V2aW5uMjMiLCJhIjoiY204Y2J0bWN1MTg5ZzJtb2xobXljODM0MiJ9.48MFADtQhp_sFuQjewLFeA";

export const MapboxMap: React.FC<MapboxMapProps> = ({
  latitude = 8.9824,
  longitude = -79.5199,
  zoom = 13,
  onLocationSelect,
  markers = [],
  route,
  showCurrentLocation = false,
  interactive = true,
  style,
  routeColor = '#3887be',
  routeWidth = 4
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const webViewRef = useRef<WebView>(null);
  
  // Referencias para evitar actualizaciones innecesarias
  const lastMarkersRef = useRef<string>('');
  const lastRouteRef = useRef<string>('');
  const lastCenterRef = useRef<string>('');

  // Función optimizada para actualizar marcadores sin recargar
  const updateMarkers = useCallback(() => {
    if (!mapReady || !webViewRef.current) return;
    
    const markersString = JSON.stringify(markers);
    if (lastMarkersRef.current === markersString) return;
    
    lastMarkersRef.current = markersString;
    
    const updateScript = `
      (function() {
        try {
          // Eliminar solo marcadores existentes, no todos los elementos
          window.currentMarkers = window.currentMarkers || [];
          window.currentMarkers.forEach(marker => marker.remove());
          window.currentMarkers = [];
          
          // Añadir nuevos marcadores
          ${markers.map(marker => `
            // MARCADOR SIMPLE PERO MUY VISIBLE
            const marker_${marker.id} = new mapboxgl.Marker({
              color: '${marker.color || '#FF0000'}',
              scale: 2.0
            })
              .setLngLat([${marker.longitude}, ${marker.latitude}])
              .addTo(map);
            
            window.currentMarkers.push(marker_${marker.id});
            
            // FORZAR que sea SUPER visible
            const markerElement = marker_${marker.id}.getElement();
            markerElement.style.transform = 'scale(2)';
            markerElement.style.zIndex = '999999';
            markerElement.style.filter = 'drop-shadow(0 0 20px rgba(255,0,0,1))';
            markerElement.style.position = 'relative';
            
            console.log('MARCADOR CREADO:', marker_${marker.id}, 'en:', [${marker.longitude}, ${marker.latitude}]);
          `).join('')}
          
          return true;
        } catch(e) {
          console.error('Error updating markers:', e);
          return false;
        }
      })();
    `;
    
    webViewRef.current.injectJavaScript(updateScript);
  }, [markers, mapReady]);

  // Función optimizada para actualizar rutas sin recargar
  const updateRoute = useCallback(() => {
    if (!mapReady || !webViewRef.current) return;
    
    const routeString = JSON.stringify(route);
    if (lastRouteRef.current === routeString) return;
    
    lastRouteRef.current = routeString;
    
    const updateRouteScript = `
      (function() {
        try {
          if (!window.map) return false;
          
          ${route && route.length > 0 ? `
            // Actualizar o crear la ruta
            if (window.map.getSource('route')) {
              window.map.getSource('route').setData({
                'type': 'Feature',
                'properties': {},
                'geometry': {
                  'type': 'LineString',
                  'coordinates': ${JSON.stringify(route)}
                }
              });
            } else {
              window.map.addSource('route', {
                'type': 'geojson',
                'data': {
                  'type': 'Feature',
                  'properties': {},
                  'geometry': {
                    'type': 'LineString',
                    'coordinates': ${JSON.stringify(route)}
                  }
                }
              });
              
              window.map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                'paint': {
                  'line-color': '${routeColor}',
                  'line-width': ${routeWidth},
                  'line-opacity': 0.8
                }
              });
            }
          ` : `
            // Remover la ruta si no hay datos
            if (window.map.getLayer('route')) {
              window.map.removeLayer('route');
            }
            if (window.map.getSource('route')) {
              window.map.removeSource('route');
            }
          `}
          
          return true;
        } catch(e) {
          console.error('Error updating route:', e);
          return false;
        }
      })();
    `;
    
    webViewRef.current.injectJavaScript(updateRouteScript);
  }, [route, mapReady, routeColor, routeWidth]);

  // Función para actualizar el centro del mapa suavemente
  const updateCenter = useCallback((newLat: number, newLng: number, newZoom?: number) => {
    if (!mapReady || !webViewRef.current) return;
    
    const centerString = `${newLat},${newLng},${newZoom || zoom}`;
    if (lastCenterRef.current === centerString) return;
    
    lastCenterRef.current = centerString;
    
    const updateCenterScript = `
      (function() {
        try {
          if (!window.map) return false;
          
          window.map.easeTo({
            center: [${newLng}, ${newLat}],
            zoom: ${newZoom || zoom},
            duration: 1000,
            essential: true
          });
          
          return true;
        } catch(e) {
          console.error('Error updating center:', e);
          return false;
        }
      })();
    `;
    
    webViewRef.current.injectJavaScript(updateCenterScript);
  }, [mapReady, zoom]);

  // Efectos optimizados
  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  useEffect(() => {
    updateRoute();
  }, [updateRoute]);

  // Actualizar centro solo cuando cambien significativamente las coordenadas
  useEffect(() => {
    if (mapReady) {
      updateCenter(latitude, longitude, zoom);
    }
  }, [latitude, longitude, zoom, mapReady, updateCenter]);

  // Memorizar el HTML para evitar regeneraciones innecesarias
  const mapHTML = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden;
          }
          #map { 
            width: 100vw; 
            height: 100vh; 
          }
          .mapboxgl-popup-content {
            padding: 8px 12px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          (function() {
            try {
              mapboxgl.accessToken = '${MAPBOX_API_KEY}';
              
              window.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [${longitude}, ${latitude}],
                zoom: ${zoom},
                interactive: ${interactive},
                attributionControl: false,
                logoPosition: 'bottom-right'
              });

              // Variables globales para el manejo de marcadores
              window.currentMarkers = [];

              window.map.on('load', function() {
                // Notificar que el mapa está listo
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'mapReady'
                  }));
                }

                console.log('MAPA CARGADO - Centro:', [${longitude}, ${latitude}], 'Zoom:', ${zoom});

                // Agregar ubicación actual si está habilitada
                ${showCurrentLocation ? `
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                      const currentLocationMarker = new mapboxgl.Marker({ 
                        color: '#FF0000',
                        scale: 0.8
                      })
                        .setLngLat([position.coords.longitude, position.coords.latitude])
                        .setPopup(new mapboxgl.Popup({ 
                          offset: 25,
                          closeButton: false 
                        }).setHTML('<div style="padding: 8px; font-size: 14px; font-weight: bold;">Tu ubicación</div>'))
                        .addTo(window.map);
                      window.currentMarkers.push(currentLocationMarker);
                    }, function(error) {
                      console.warn('Error getting current location:', error);
                    });
                  }
                ` : ''}
              });

              // Manejar clics en el mapa
              ${onLocationSelect ? `
                window.map.on('click', function(e) {
                  const coords = e.lngLat;
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'locationSelect',
                      latitude: coords.lat,
                      longitude: coords.lng
                    }));
                  }
                });
              ` : ''}

              window.map.on('error', function(e) {
                console.error('Mapbox error:', e);
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'error',
                    message: 'Error de Mapbox: ' + (e.error ? e.error.message : 'Error desconocido')
                  }));
                }
              });

            } catch (error) {
              console.error('Init error:', error);
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'error',
                  message: 'Error de inicialización: ' + error.message
                }));
              }
            }
          })();
        </script>
      </body>
      </html>
    `;
  }, [
    // Solo regenerar HTML si cambian estos valores fundamentales
    interactive, 
    showCurrentLocation,
    !!onLocationSelect,
    // NO incluir latitude, longitude, zoom, markers, route aquí
    // porque se actualizan por JavaScript injection
  ]);

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'mapReady') {
        setLoading(false);
        setError(null);
        setMapReady(true);
      } else if (data.type === 'error') {
        setError(data.message);
        setLoading(false);
        setMapReady(false);
      } else if (data.type === 'locationSelect' && onLocationSelect) {
        onLocationSelect(data.latitude, data.longitude);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      setError('Error de comunicación con el mapa');
      setLoading(false);
    }
  }, [onLocationSelect]);

  const handleError = useCallback(() => {
    setError('Error cargando el mapa');
    setLoading(false);
    setMapReady(false);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    setMapReady(false);
    // Reset refs
    lastMarkersRef.current = '';
    lastRouteRef.current = '';
    lastCenterRef.current = '';
  }, []);

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <Ionicons name="warning" size={48} color="#F44336" style={{ marginBottom: 16 }} />
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={handleRetry}
        >
          <ThemedText style={styles.retryButtonText}>Reintentar</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <ThemedText style={styles.loadingText}>Cargando mapa...</ThemedText>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ html: mapHTML }}
        style={styles.webview}
        onMessage={handleMessage}
        onError={handleError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        cacheEnabled={true}
        // Optimizaciones adicionales para evitar recargas
        incognito={false}
        cacheMode="LOAD_DEFAULT"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    padding: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default MapboxMap; 