import { Colors } from '@/constants/Colors';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
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
  showCurrentLocation?: boolean;
  interactive?: boolean;
  style?: any;
}

const MAPBOX_API_KEY = "pk.eyJ1Ijoia2V2aW5uMjMiLCJhIjoiY204Y2J0bWN1MTg5ZzJtb2xobXljODM0MiJ9.48MFADtQhp_sFuQjewLFeA";

export const MapboxMap: React.FC<MapboxMapProps> = ({
  latitude = 8.9824,
  longitude = -79.5199, // Panamá City default
  zoom = 14,
  onLocationSelect,
  markers = [],
  showCurrentLocation = true,
  interactive = true,
  style
}) => {
  const webViewRef = useRef<WebView>(null);
  const [mapReady, setMapReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateMapHTML = () => {
    const markersJS = markers.map(marker => `
      new mapboxgl.Marker({ color: '${marker.color || '#FF0000'}' })
        .setLngLat([${marker.longitude}, ${marker.latitude}])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>${marker.title || ''}</h3>'))
        .addTo(map);
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          #map { 
            width: 100vw; 
            height: 100vh; 
          }
          .mapboxgl-ctrl-bottom-left,
          .mapboxgl-ctrl-bottom-right {
            display: none;
          }
          #loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 1000;
          }
        </style>
      </head>
      <body>
        <div id="loading">
          <div>Cargando mapa...</div>
        </div>
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

            let currentMarker = null;

            map.on('load', function() {
              document.getElementById('loading').style.display = 'none';
              
              window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapReady'
              }));

              // Add markers
              ${markersJS}

              // Add current location marker if enabled
              ${showCurrentLocation ? `
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(function(position) {
                    const userLocation = [position.coords.longitude, position.coords.latitude];
                    
                    new mapboxgl.Marker({ color: '#007AFF' })
                      .setLngLat(userLocation)
                      .setPopup(new mapboxgl.Popup().setHTML('<h3>Tu ubicación</h3>'))
                      .addTo(map);
                      
                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'currentLocation',
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                    }));
                  }, function(error) {
                    console.log('Geolocation error:', error);
                  });
                }
              ` : ''}

              // Handle map clicks for location selection
              ${onLocationSelect ? `
                map.on('click', function(e) {
                  const coords = e.lngLat;
                  
                  // Remove previous marker
                  if (currentMarker) {
                    currentMarker.remove();
                  }
                  
                  // Add new marker
                  currentMarker = new mapboxgl.Marker({ color: '#FF6B6B' })
                    .setLngLat([coords.lng, coords.lat])
                    .addTo(map);
                  
                  // Send coordinates to React Native
                  window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'locationSelected',
                    latitude: coords.lat,
                    longitude: coords.lng
                  }));
                });
              ` : ''}
            });

            map.on('error', function(e) {
              window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: 'Error cargando el mapa'
              }));
            });

            // Function to update map center
            window.updateMapCenter = function(lat, lng, zoomLevel = ${zoom}) {
              map.flyTo({
                center: [lng, lat],
                zoom: zoomLevel,
                essential: true
              });
            };

            // Function to add marker
            window.addMarker = function(lat, lng, color = '#FF0000', title = '') {
              new mapboxgl.Marker({ color: color })
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup().setHTML('<h3>' + title + '</h3>'))
                .addTo(map);
            };

            // Function to clear all markers
            window.clearMarkers = function() {
              const markers = document.querySelectorAll('.mapboxgl-marker');
              markers.forEach(marker => marker.remove());
            };

          } catch (error) {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              message: 'Error inicializando el mapa: ' + error.message
            }));
          }
        </script>
      </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'mapReady':
          setMapReady(true);
          setLoading(false);
          setError(null);
          break;
        case 'locationSelected':
          onLocationSelect && onLocationSelect(data.latitude, data.longitude);
          break;
        case 'currentLocation':
          // Handle current location if needed
          break;
        case 'error':
          setError(data.message);
          setLoading(false);
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
      setError('Error de comunicación con el mapa');
      setLoading(false);
    }
  };

  const handleWebViewError = () => {
    setError('Error cargando el mapa. Verifica tu conexión a internet.');
    setLoading(false);
  };

  const updateMapCenter = (lat: number, lng: number, zoomLevel?: number) => {
    if (webViewRef.current && mapReady) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'updateCenter',
        latitude: lat,
        longitude: lng,
        zoom: zoomLevel || zoom
      }));
    }
  };

  const addMarker = (lat: number, lng: number, color?: string, title?: string) => {
    if (webViewRef.current && mapReady) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'addMarker',
        latitude: lat,
        longitude: lng,
        color: color || '#FF0000',
        title: title || ''
      }));
    }
  };

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
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
        source={{ html: generateMapHTML() }}
        style={styles.webview}
        onMessage={handleWebViewMessage}
        onError={handleWebViewError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={true}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        geolocationEnabled={true}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
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
});

export default MapboxMap; 