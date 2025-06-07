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
    if (!mapReady || !webViewRef.current) {
      console.log('🔍 MAPA NO LISTO O SIN WEBVIEW REF - Mapready:', mapReady);
      return;
    }
    
    if (markers.length === 0) {
      console.log('🔍 NO HAY MARCADORES PARA MOSTRAR');
      return;
    }
    
    const markersString = JSON.stringify(markers);
    if (lastMarkersRef.current === markersString) {
      console.log('🔍 MARCADORES YA ESTÁN ACTUALIZADOS');
      return;
    }
    
    console.log('🔍 ACTUALIZANDO MARCADORES:', markers);
    lastMarkersRef.current = markersString;
    
    // Crear el script JavaScript más simple y seguro
    let markersScript = '';
    markers.forEach((marker, index) => {
      const safeTitle = marker.title ? marker.title.replace(/'/g, "\\'").replace(/"/g, '\\"') : '';
      markersScript += `
        try {
          console.log('Creando marcador ${marker.id}');
          var marker_${marker.id} = new mapboxgl.Marker({
            color: '${marker.color || '#FF0000'}',
            scale: 1.2
          })
          .setLngLat([${marker.longitude}, ${marker.latitude}])
          .addTo(window.map);
          
          window.currentMarkers.push(marker_${marker.id});
          
          ${marker.title ? `
            marker_${marker.id}.setPopup(
              new mapboxgl.Popup({ 
                offset: 25,
                closeButton: false
              }).setHTML('<div style="padding: 8px; font-weight: bold; text-align: center;">${safeTitle}</div>')
            );
          ` : ''}
          
          console.log('Marcador ${marker.id} creado');
        } catch(e) {
          console.error('Error creando marcador ${marker.id}:', e);
        }
      `;
    });
    
    const updateScript = `
      (function() {
        try {
          if (!window.map || !window.map.loaded()) {
            console.log('Mapa no listo, reintentando...');
            setTimeout(arguments.callee, 200);
            return false;
          }
          
          // Limpiar marcadores existentes
          window.currentMarkers = window.currentMarkers || [];
          console.log('Eliminando', window.currentMarkers.length, 'marcadores existentes');
          window.currentMarkers.forEach(function(marker) {
            if (marker && marker.remove) {
              marker.remove();
            }
          });
          window.currentMarkers = [];
          
          console.log('Creando', ${markers.length}, 'nuevos marcadores');
          ${markersScript}
          
          console.log('Total marcadores creados:', window.currentMarkers.length);
          return true;
        } catch(e) {
          console.error('Error actualizando marcadores:', e);
          return false;
        }
      })();
    `;
    
    webViewRef.current.injectJavaScript(updateScript);
  }, [markers, mapReady]);

  // Función optimizada para actualizar rutas sin recargar
  const updateRoute = useCallback(() => {
    if (!mapReady || !webViewRef.current) {
      console.log('🔍 RUTA: Mapa no listo para actualizar ruta');
      return;
    }
    
    const routeString = JSON.stringify(route);
    if (lastRouteRef.current === routeString) {
      console.log('🔍 RUTA: Ruta ya está actualizada');
      return;
    }
    
    console.log('🛣️ ACTUALIZANDO RUTA:', route ? route.length + ' puntos' : 'Sin ruta');
    lastRouteRef.current = routeString;
    
    const updateRouteScript = `
      (function() {
        try {
          if (!window.map || !window.map.loaded()) {
            console.log('⏳ RUTA: Mapa no existe o no está cargado');
            setTimeout(arguments.callee, 200);
            return false;
          }
          
          // Remover ruta existente si existe
          if (window.map.getLayer && window.map.getLayer('route')) {
            window.map.removeLayer('route');
            console.log('🗑️ Ruta anterior removida');
          }
          if (window.map.getSource && window.map.getSource('route')) {
            window.map.removeSource('route');
            console.log('🗑️ Fuente de ruta anterior removida');
          }
          
          ${route && route.length > 0 ? `
            console.log('🛣️ AGREGANDO RUTA con ${route.length} puntos');
            
            // Crear nueva fuente de ruta
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
            
            // Agregar capa de ruta
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
                'line-opacity': 1.0
              }
            });
            
            console.log('✅ RUTA AGREGADA EXITOSAMENTE');
          ` : `
            console.log('🗑️ REMOVIENDO RUTA - No hay datos');
          `}
          
          return true;
        } catch(e) {
          console.error('💥 Error actualizando ruta:', e);
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
    if (mapReady) {
      const timer = setTimeout(() => {
        updateRoute();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [updateRoute, mapReady]);

  useEffect(() => {
    if (mapReady) {
      const timer = setTimeout(() => {
        updateMarkers();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [updateMarkers, mapReady]);

  // Actualizar centro cuando cambien las coordenadas
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
          
          .mapboxgl-marker {
            z-index: 999999 !important;
            cursor: pointer !important;
          }
          
          .mapboxgl-marker svg {
            display: block !important;
            filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3)) !important;
          }
          
          .mapboxgl-popup-content {
            background: white !important;
            border-radius: 8px !important;
            padding: 8px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
          }
          
          .mapboxgl-popup-tip {
            border-top-color: white !important;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          (function() {
            try {
              const accessToken = '${MAPBOX_API_KEY}';
              if (!accessToken || accessToken.length < 20) {
                console.error('Token de Mapbox inválido');
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'error',
                    message: 'Error de configuración del mapa'
                  }));
                }
                return;
              }
              
              mapboxgl.accessToken = accessToken;
              
              window.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [${longitude}, ${latitude}],
                zoom: ${zoom},
                interactive: ${interactive},
                attributionControl: false,
                logoPosition: 'bottom-right',
                maxBounds: [[-85, -10], [-75, 15]],
                minZoom: 10,
                maxZoom: 18
              });

              window.currentMarkers = [];

              window.map.on('load', function() {
                console.log('MAPA CARGADO - Centro: [${longitude}, ${latitude}], Zoom: ${zoom}');
                
                window.mapFullyReady = true;
                console.log('✅ MAPA LISTO');
                
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'mapReady'
                  }));
                }
                
                setTimeout(() => {
                  try {
                    window.map.addSource('tracking-background', {
                      'type': 'geojson',
                      'data': {
                        'type': 'FeatureCollection',
                        'features': []
                      }
                    });

                    ${showCurrentLocation ? `
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                          const currentLocationMarker = new mapboxgl.Marker({ 
                            color: '#007AFF',
                            scale: 1.2
                          })
                            .setLngLat([position.coords.longitude, position.coords.latitude])
                            .setPopup(new mapboxgl.Popup({ 
                              offset: 30,
                              closeButton: false
                            }).setHTML('<div style="padding: 12px 16px; font-size: 16px; font-weight: bold; text-align: center; color: #007AFF;">📍 Tu ubicación actual</div>'))
                            .addTo(window.map);
                          window.currentMarkers.push(currentLocationMarker);
                        }, function(error) {
                          console.warn('Error getting location:', error);
                        });
                      }
                    ` : ''}
                    
                    console.log('✅ CONFIGURACIÓN COMPLETADA');
                  } catch (error) {
                    console.error('Error en configuración:', error);
                  }
                }, 500);
              });

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
                console.error('Error en mapa:', e);
                
                // Ignorar errores comunes que no son críticos
                if (e.error && (
                  e.error.message.includes('fetch') || 
                  e.error.message.includes('network') || 
                  e.error.message.includes('style') ||
                  e.error.message.includes('load') ||
                  e.error.message.includes('request') ||
                  e.error.message.includes('timeout')
                )) {
                  console.warn('Error no crítico ignorado:', e.error.message);
                  return;
                }
                
                // Solo notificar errores realmente críticos
                if (window.ReactNativeWebView && e.error && !e.error.message.includes('style')) {
                  console.warn('Error notificado al usuario:', e.error.message);
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'error',
                    message: 'Error en el mapa: ' + e.error.message
                  }));
                }
              });

              // Silenciar errores globales de Mapbox
              window.addEventListener('error', function(e) {
                if (e.message && (
                  e.message.includes('mapbox') || 
                  e.message.includes('style') ||
                  e.message.includes('webgl') ||
                  e.message.includes('fetch')
                )) {
                  console.warn('Error global silenciado:', e.message);
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              });

              // Silenciar promesas rechazadas de Mapbox
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && (
                  e.reason.toString().includes('mapbox') ||
                  e.reason.toString().includes('style') ||
                  e.reason.toString().includes('fetch')
                )) {
                  console.warn('Promesa rechazada silenciada:', e.reason);
                  e.preventDefault();
                  return false;
                }
              });

            } catch (error) {
              console.error('Error al inicializar mapa:', error);
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'error',
                  message: 'Error al inicializar el mapa: ' + error.message
                }));
              }
            }
          })();
        </script>
      </body>
      </html>
    `;
  }, [latitude, longitude, zoom, interactive, showCurrentLocation, onLocationSelect]);

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'mapReady') {
        console.log('✅ MENSAJE MAPREADY RECIBIDO');
        setLoading(false);
        setError(null);
        setMapReady(true);
      } else if (data.type === 'error') {
        console.log('❌ ERROR DEL MAPA:', data.message);
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

  // NUEVO: Verificación de emergencia para inicialización del mapa
  useEffect(() => {
    // Si después de 3 segundos el mapa no está listo, forzar inicialización
    const emergencyTimer = setTimeout(() => {
      if (!mapReady && !error) {
        console.log('🚨 MAPA NO SE INICIALIZÓ - FORZANDO INICIALIZACIÓN');
        setMapReady(true);
        setLoading(false);
      }
    }, 3000);
    
    return () => clearTimeout(emergencyTimer);
  }, [mapReady, error]);

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