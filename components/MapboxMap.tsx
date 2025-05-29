import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from './ThemedText';

const { width, height } = Dimensions.get('window');

interface MapboxMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  markers?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    color?: string;
    title?: string;
  }>;
  route?: Array<[number, number]>; // Coordenadas de la ruta [lng, lat]
  showCurrentLocation?: boolean;
  interactive?: boolean;
  style?: any;
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
  style
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const webViewRef = useRef<WebView>(null);

  // Función para actualizar los marcadores sin recargar el WebView
  useEffect(() => {
    if (mapReady && webViewRef.current) {
      const updateScript = `
        try {
          // Eliminar marcadores existentes
          document.querySelectorAll('.mapboxgl-marker').forEach(m => m.remove());
          
          // Añadir nuevos marcadores
          ${markers.map(marker => `
            new mapboxgl.Marker({ color: '${marker.color || '#3887BE'}' })
              .setLngLat([${marker.longitude}, ${marker.latitude}])
              .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML('<h3>${marker.title || ''}</h3>'))
              .addTo(map);
          `).join('')}
          
          true;
        } catch(e) {
          false;
        }
      `;
      
      webViewRef.current.injectJavaScript(updateScript);
    }
  }, [markers, mapReady]);

  // Función para actualizar la ruta sin recargar el WebView
  useEffect(() => {
    if (mapReady && webViewRef.current && route) {
      const updateRouteScript = `
        try {
          if (map.getSource('route')) {
            map.getSource('route').setData({
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': ${JSON.stringify(route)}
              }
            });
          } else {
            map.addSource('route', {
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
            
            map.addLayer({
              'id': 'route',
              'type': 'line',
              'source': 'route',
              'layout': {
                'line-join': 'round',
                'line-cap': 'round'
              },
              'paint': {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
              }
            });
          }
          true;
        } catch(e) {
          console.error(e);
          false;
        }
      `;
      
      webViewRef.current.injectJavaScript(updateRouteScript);
    }
  }, [route, mapReady]);

  // Memorizar el HTML para evitar regeneraciones innecesarias
  const mapHTML = useMemo(() => generateMapHTML(), [
    // Solo incluir dependencias que afecten la creación inicial del mapa
    latitude, 
    longitude, 
    zoom, 
    interactive, 
    showCurrentLocation,
    // Excluir markers y route porque se actualizan por injectJavaScript
  ]);

  function generateMapHTML() {
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
          }
          #map { 
            width: 100vw; 
            height: 100vh; 
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          try {
            mapboxgl.accessToken = '${MAPBOX_API_KEY}';
            
            const map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/mapbox/streets-v12',
              center: [${longitude}, ${latitude}],
              zoom: ${zoom},
              interactive: ${interactive}
            });

            map.on('load', () => {
              // Notificar que el mapa está listo
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapReady'
              }));

              // Agregar ubicación actual si está habilitada
              ${showCurrentLocation ? `
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    new mapboxgl.Marker({ color: '#FF0000' })
                      .setLngLat([position.coords.longitude, position.coords.latitude])
                      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML('<h3>Tu ubicación</h3>'))
                      .addTo(map);
                  });
                }
              ` : ''}
            });

            // Manejar clics en el mapa
            ${onLocationSelect ? `
              map.on('click', (e) => {
                const coords = e.lngLat;
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'locationSelect',
                  latitude: coords.lat,
                  longitude: coords.lng
                }));
              });
            ` : ''}

            map.on('error', (e) => {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: 'Error de Mapbox: ' + e.error.message
              }));
            });

          } catch (error) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              message: 'Error: ' + error.message
            }));
          }
        </script>
      </body>
      </html>
    `;
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'mapReady') {
        setLoading(false);
        setError(null);
        setMapReady(true);
      } else if (data.type === 'error') {
        setError(data.message);
        setLoading(false);
      } else if (data.type === 'locationSelect' && onLocationSelect) {
        onLocationSelect(data.latitude, data.longitude);
      }
    } catch (error) {
      setError('Error de comunicación');
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Error cargando el mapa');
    setLoading(false);
  };

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <Ionicons name="warning" size={48} color="#F44336" style={{ marginBottom: 16 }} />
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
          }}
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
        startInLoadingState={true}
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