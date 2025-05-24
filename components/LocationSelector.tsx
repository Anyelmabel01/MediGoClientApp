import { UserLocation, mockLocations } from '@/constants/UserModel';
import { handleError } from '@/utils/errorHandler';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface LocationSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  onLocationSelect?: (location: UserLocation) => void;
}

export function LocationSelector({ isVisible, onClose, onLocationSelect }: LocationSelectorProps) {
  const [locations, setLocations] = useState<UserLocation[]>(mockLocations);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLocation, setEditingLocation] = useState<UserLocation | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingAddress, setEditingAddress] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState({
    latitude: 8.9673,
    longitude: -79.5314,
  });
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const webViewRef = useRef(null);

  // Cargar ubicaciones (en una app real vendría de una API)
  useEffect(() => {
    // Aquí iría la llamada a la API para obtener las ubicaciones actualizadas
    setLocations(mockLocations);
  }, [isVisible]);

  // Cuando se edita una ubicación existente, actualizamos las coordenadas seleccionadas
  useEffect(() => {
    if (editingLocation) {
      setSelectedCoords({
        latitude: editingLocation.latitud,
        longitude: editingLocation.longitud,
      });
    }
  }, [editingLocation]);

  const handleSaveLocation = () => {
    if (isAddingNew) {
      // Crear una nueva ubicación
      const newLocation: UserLocation = {
        id: `new-${Date.now()}`, // En producción, el ID vendría del backend
        userId: '1', // Usuario actual
        nombre: editingName,
        direccion: editingAddress,
        latitud: selectedCoords.latitude, // Usamos las coordenadas seleccionadas en el mapa
        longitud: selectedCoords.longitude,
        esPrincipal: locations.length === 0 // Si es la primera, la hacemos principal
      };
      
      setLocations([...locations, newLocation]);
    } else if (editingLocation) {
      // Actualizar una ubicación existente
      const updatedLocations = locations.map(loc => 
        loc.id === editingLocation.id 
          ? { 
              ...loc, 
              nombre: editingName, 
              direccion: editingAddress,
              latitud: selectedCoords.latitude,
              longitud: selectedCoords.longitude
            }
          : loc
      );
      setLocations(updatedLocations);
    }
    
    resetEditState();
  };

  const handleSelectLocation = (location: UserLocation) => {
    // Si hay una función de callback para selección, la llamamos
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    onClose();
  };

  const handleDeleteLocation = (locationId: string) => {
    setLocations(locations.filter(loc => loc.id !== locationId));
  };

  const handleSetDefault = (locationId: string) => {
    const updatedLocations = locations.map(loc => ({
      ...loc,
      esPrincipal: loc.id === locationId
    }));
    setLocations(updatedLocations);
  };

  const handleEditLocation = (location: UserLocation) => {
    setEditingLocation(location);
    setEditingName(location.nombre);
    setEditingAddress(location.direccion);
    setIsEditing(true);
    setIsAddingNew(false);
    setMapLoading(true);
    setMapError(false);
  };

  const handleAddNewLocation = () => {
    setEditingLocation(null);
    setEditingName('');
    setEditingAddress('');
    setIsEditing(true);
    setIsAddingNew(true);
    setMapLoading(true);
    setMapError(false);
  };

  const resetEditState = () => {
    setIsEditing(false);
    setEditingLocation(null);
    setEditingName('');
    setEditingAddress('');
    setIsAddingNew(false);
  };

  // Manejar mensajes desde el WebView
  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerDragEnd' || data.type === 'mapClick') {
        setSelectedCoords({
          latitude: data.latitude,
          longitude: data.longitude
        });
      } else if (data.type === 'mapLoaded') {
        setMapLoading(false);
      } else if (data.type === 'mapError') {
        setMapError(true);
        setMapLoading(false);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // HTML simplificado para el WebView
  const getMapHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          #map {
            width: 100%;
            height: 100%;
            background-color: #f2f2f2;
          }
          .error-message {
            text-align: center;
            color: red;
            padding: 20px;
            display: none;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <div id="error" class="error-message">No se pudo cargar el mapa. Verifica tu conexión a internet.</div>
        
        <script>
          // Función para informar al React Native que ocurrió un error
          function notifyError() {
            try {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapError'
              }));
              document.getElementById('error').style.display = 'block';
              document.getElementById('map').style.display = 'none';
            } catch (e) {
              console.error('Error al notificar estado:', e);
            }
          }

          // Intenta cargar las librerías de Leaflet
          try {
            // Carga la hoja de estilos de Leaflet
            var linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
            document.head.appendChild(linkElement);
            
            // Carga el script de Leaflet
            var scriptElement = document.createElement('script');
            scriptElement.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
            
            scriptElement.onload = function() {
              // Inicializa el mapa cuando se carga Leaflet
              try {
                var map = L.map('map').setView([${selectedCoords.latitude}, ${selectedCoords.longitude}], 15);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
                
                var marker = L.marker([${selectedCoords.latitude}, ${selectedCoords.longitude}], {
                  draggable: true
                }).addTo(map);
                
                marker.on('dragend', function(e) {
                  var position = marker.getLatLng();
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'markerDragEnd',
                    latitude: position.lat,
                    longitude: position.lng
                  }));
                });
                
                map.on('click', function(e) {
                  marker.setLatLng(e.latlng);
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'mapClick',
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
                  }));
                });
                
                // Notifica que el mapa se cargó correctamente
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'mapLoaded'
                }));
              } catch (e) {
                console.error('Error al inicializar el mapa:', e);
                notifyError();
              }
            };
            
            scriptElement.onerror = function() {
              console.error('Error al cargar Leaflet');
              notifyError();
            };
            
            document.body.appendChild(scriptElement);
          } catch (e) {
            console.error('Error al cargar las librerías:', e);
            notifyError();
          }
        </script>
      </body>
      </html>
    `;
  };

  const renderLocationItem = ({ item }: { item: UserLocation }) => (
    <View style={styles.locationItem}>
      <TouchableOpacity 
        style={styles.locationMainContent}
        onPress={() => handleSelectLocation(item)}
      >
        <View style={styles.locationIconContainer}>
          <Ionicons
            name={item.esPrincipal ? "location" : "location-outline"}
            size={24}
            color={item.esPrincipal ? "#2D7FF9" : "#777"}
          />
        </View>
        <View style={styles.locationInfo}>
          <ThemedText style={styles.locationName}>
            {item.nombre}
            {item.esPrincipal && <ThemedText style={styles.defaultBadge}> (Principal)</ThemedText>}
          </ThemedText>
          <ThemedText style={styles.locationAddress}>{item.direccion}</ThemedText>
        </View>
      </TouchableOpacity>
      
      <View style={styles.locationActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditLocation(item)}
        >
          <Ionicons name="pencil" size={18} color="#777" />
        </TouchableOpacity>
        
        {!item.esPrincipal && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(item.id)}
          >
            <Ionicons name="star-outline" size={18} color="#777" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteLocation(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#777" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderizar el contenido del mapa con estados de carga y error
  const renderMapContent = () => {
    return (
      <View style={styles.mapContainer}>
        <ThemedText style={styles.fieldLabel}>Selecciona la ubicación en el mapa</ThemedText>
        
        <View style={styles.mapWrapper}>
          <WebView
            ref={webViewRef}
            style={styles.map}
            originWhitelist={['*']}
            source={{ html: getMapHtml() }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onError={() => {
              setMapError(true);
              setMapLoading(false);
            }}
          />
          
          {mapLoading && (
            <View style={styles.mapLoadingOverlay}>
              <ActivityIndicator size="large" color="#2D7FF9" />
              <ThemedText style={styles.loadingText}>Cargando mapa...</ThemedText>
            </View>
          )}
          
          {mapError && (
            <View style={styles.mapErrorOverlay}>
              <Ionicons name="cloud-offline-outline" size={40} color="#888" />
              <ThemedText style={styles.errorText}>
                No se pudo cargar el mapa. Verifica tu conexión a internet.
              </ThemedText>
            </View>
          )}
        </View>
        
        <ThemedText style={styles.mapInstructions}>
          Toca en el mapa o arrastra el marcador para seleccionar la ubicación exacta
        </ThemedText>
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>
              {isEditing 
                ? (isAddingNew ? 'Añadir ubicación' : 'Editar ubicación')
                : 'Mis ubicaciones'
              }
            </ThemedText>
            <TouchableOpacity onPress={isEditing ? resetEditState : onClose} style={styles.closeButton}>
              <Ionicons name={isEditing ? "arrow-back" : "close"} size={24} color="#777" />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <View style={styles.formField}>
                <ThemedText style={styles.fieldLabel}>Nombre</ThemedText>
                <TextInput
                  style={styles.input}
                  value={editingName}
                  onChangeText={setEditingName}
                  placeholder="Ej: Casa, Trabajo, Gimnasio..."
                />
              </View>
              
              <View style={styles.formField}>
                <ThemedText style={styles.fieldLabel}>Dirección</ThemedText>
                <TextInput
                  style={styles.input}
                  value={editingAddress}
                  onChangeText={setEditingAddress}
                  placeholder="Dirección completa"
                  multiline
                />
              </View>
              
              {renderMapContent()}
              
              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  (!editingName || !editingAddress) && styles.saveButtonDisabled
                ]}
                onPress={handleSaveLocation}
                disabled={!editingName || !editingAddress}
              >
                <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <FlatList
                data={locations}
                renderItem={renderLocationItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.locationsList}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Ionicons name="location-outline" size={50} color="#ccc" />
                    <ThemedText style={styles.emptyText}>No hay ubicaciones guardadas</ThemedText>
                  </View>
                }
              />
              
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddNewLocation}
              >
                <Ionicons name="add" size={24} color="white" />
                <ThemedText style={styles.addButtonText}>Añadir nueva ubicación</ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  locationsList: {
    padding: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
  },
  locationMainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  defaultBadge: {
    fontSize: 12,
    color: '#2D7FF9',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
  },
  locationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D7FF9',
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  editForm: {
    padding: 16,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  mapContainer: {
    marginBottom: 20,
  },
  mapWrapper: {
    position: 'relative',
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  map: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
  mapErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
  },
  mapInstructions: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#2D7FF9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#a0c4f2',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 