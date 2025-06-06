import { Colors } from '@/constants/Colors';
import { UserLocation, mockLocations } from '@/constants/UserModel';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { MapboxMap } from './MapboxMap';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

const { width } = Dimensions.get('window');

interface LocationSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  onLocationSelect?: (location: UserLocation) => void;
}

export function LocationSelector({ isVisible, onClose, onLocationSelect }: LocationSelectorProps) {
  const { isDarkMode } = useTheme();
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
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
  const [selectedLocationAddress, setSelectedLocationAddress] = useState('');

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
      setEditingAddress(editingLocation.direccion);
      setSelectedLocationAddress(editingLocation.direccion);
    } else if (isAddingNew) {
      // Para nuevas ubicaciones, centrar en Panama
      setSelectedCoords({
        latitude: 8.9673,
        longitude: -79.5314,
      });
      setSelectedLocationAddress('');
    }
  }, [editingLocation, isAddingNew]);

  // Función para obtener la ubicación actual del usuario
  const getCurrentLocation = async () => {
    setIsGettingCurrentLocation(true);
    try {
      // Solicitar permisos si no los tenemos
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Necesitamos acceso a tu ubicación para usar esta función',
          [{ text: 'OK' }]
        );
        return;
      }

      // Obtener ubicación actual
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;
      setSelectedCoords({ latitude, longitude });
      
      // Obtener dirección usando geocodificación inversa
      await reverseGeocode(latitude, longitude);
      
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert(
        'Error',
        'No pudimos obtener tu ubicación actual. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGettingCurrentLocation(false);
    }
  };

  // Función para geocodificación inversa (obtener dirección de coordenadas)
  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1Ijoia2V2aW5uMjMiLCJhIjoiY204Y2J0bWN1MTg5ZzJtb2xobXljODM0MiJ9.48MFADtQhp_sFuQjewLFeA&language=es`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const address = data.features[0].place_name;
        setSelectedLocationAddress(address);
        // Siempre actualizar el campo de dirección cuando se selecciona en el mapa
        setEditingAddress(address);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  // Función para buscar direcciones
  const searchAddresses = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=pk.eyJ1Ijoia2V2aW5uMjMiLCJhIjoiY204Y2J0bWN1MTg5ZzJtb2xobXljODM0MiJ9.48MFADtQhp_sFuQjewLFeA&country=PA&language=es&limit=5`
      );
      const data = await response.json();
      
      if (data.features) {
        setSearchResults(data.features);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Error searching addresses:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Manejar selección de resultado de búsqueda
  const handleSearchResultSelect = (feature: any) => {
    const [longitude, latitude] = feature.center;
    setSelectedCoords({ latitude, longitude });
    setEditingAddress(feature.place_name);
    setSelectedLocationAddress(feature.place_name);
    setSearchText('');
    setShowSearchResults(false);
  };

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText) {
        searchAddresses(searchText);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

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
    setMapLoading(false);
    setMapError(false);
    setSearchText('');
    setShowSearchResults(false);
  };

  const handleAddNewLocation = () => {
    setEditingLocation(null);
    setEditingName('');
    setEditingAddress('');
    setSelectedLocationAddress('');
    setIsEditing(true);
    setIsAddingNew(true);
    setMapLoading(false);
    setMapError(false);
    setSearchText('');
    setShowSearchResults(false);
  };

  const resetEditState = () => {
    setIsEditing(false);
    setEditingLocation(null);
    setEditingName('');
    setEditingAddress('');
    setSelectedLocationAddress('');
    setIsAddingNew(false);
    setSearchText('');
    setShowSearchResults(false);
  };

  // Manejar la selección de ubicación en el mapa de Mapbox
  const handleMapLocationSelect = (latitude: number, longitude: number) => {
    console.log('🎯 NUEVA UBICACIÓN SELECCIONADA:', { latitude, longitude });
    setSelectedCoords({
      latitude,
      longitude
    });
    // Obtener dirección automáticamente
    reverseGeocode(latitude, longitude);
    
    // Pequeña animación de feedback para indicar que se seleccionó una ubicación
    // Esto ayuda al usuario a entender que su acción fue registrada
  };

  const renderLocationItem = ({ item }: { item: UserLocation }) => (
    <View style={[styles.locationItem, { 
      backgroundColor: isDarkMode ? Colors.dark.background : '#f8f8f8',
      borderColor: isDarkMode ? Colors.dark.border : 'transparent'
    }]}>
      <TouchableOpacity 
        style={styles.locationMainContent}
        onPress={() => handleSelectLocation(item)}
      >
        <View style={[styles.locationIconContainer, { 
          backgroundColor: isDarkMode ? Colors.dark.border : '#f1f1f1' 
        }]}>
          <Ionicons
            name={item.esPrincipal ? "location" : "location-outline"}
            size={24}
            color={item.esPrincipal ? Colors.light.primary : (isDarkMode ? Colors.dark.textSecondary : "#777")}
          />
        </View>
        <View style={styles.locationInfo}>
          <ThemedText style={styles.locationName}>
            {item.nombre}
            {item.esPrincipal && <ThemedText style={[styles.defaultBadge, { color: Colors.light.primary }]}> (Principal)</ThemedText>}
          </ThemedText>
          <ThemedText style={[styles.locationAddress, { 
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
          }]}>{item.direccion}</ThemedText>
        </View>
      </TouchableOpacity>
      
      <View style={styles.locationActions}>
        <TouchableOpacity
          style={[styles.actionButton, { 
            backgroundColor: isDarkMode ? Colors.dark.border : '#f1f1f1' 
          }]}
          onPress={() => handleEditLocation(item)}
        >
          <Ionicons name="pencil" size={18} color={isDarkMode ? Colors.dark.textSecondary : "#777"} />
        </TouchableOpacity>
        
        {!item.esPrincipal && (
          <TouchableOpacity
            style={[styles.actionButton, { 
              backgroundColor: isDarkMode ? Colors.dark.border : '#f1f1f1' 
            }]}
            onPress={() => handleSetDefault(item.id)}
          >
            <Ionicons name="star-outline" size={18} color={isDarkMode ? Colors.dark.textSecondary : "#777"} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, { 
            backgroundColor: isDarkMode ? Colors.dark.border : '#f1f1f1' 
          }]}
          onPress={() => handleDeleteLocation(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.light.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderizar el contenido del mapa con Mapbox
  const renderMapContent = () => {
    // Debug logging
    console.log('🗺️ RENDERIZANDO MAPA:', {
      center: { lat: selectedCoords.latitude, lng: selectedCoords.longitude },
      markers: [{
        id: 'selected-location',
        latitude: selectedCoords.latitude,
        longitude: selectedCoords.longitude,
        color: '#FF0000'
      }]
    });

    return (
      <View style={styles.mapContainer}>
        <ThemedText style={[styles.fieldLabel, { 
          color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
        }]}>
          Selecciona la ubicación en el mapa
        </ThemedText>
        
        {/* Buscador de direcciones */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { 
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          }]}>
            <Ionicons 
              name="search" 
              size={20} 
              color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { 
                color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary 
              }]}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Buscar dirección..."
              placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
            />
            {isSearching && (
              <ActivityIndicator size="small" color={Colors.light.primary} style={styles.searchLoader} />
            )}
            {searchText.length > 0 && (
              <TouchableOpacity 
                onPress={() => {
                  setSearchText('');
                  setShowSearchResults(false);
                }}
                style={styles.clearSearchButton}
              >
                <Ionicons name="close-circle" size={20} color={Colors.light.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Resultados de búsqueda */}
          {showSearchResults && searchResults.length > 0 && (
            <View style={[styles.searchResults, { 
              backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
              borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
            }]}>
              {searchResults.map((result, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.searchResultItem, { 
                    borderBottomColor: isDarkMode ? Colors.dark.border : Colors.light.border 
                  }]}
                  onPress={() => handleSearchResultSelect(result)}
                >
                  <Ionicons 
                    name="location-outline" 
                    size={16} 
                    color={Colors.light.primary} 
                    style={styles.searchResultIcon}
                  />
                  <View style={styles.searchResultText}>
                    <ThemedText style={styles.searchResultTitle} numberOfLines={1}>
                      {result.text}
                    </ThemedText>
                    <ThemedText style={[styles.searchResultSubtitle, { 
                      color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
                    }]} numberOfLines={1}>
                      {result.place_name}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        <View style={[styles.mapWrapper, { 
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border 
        }]}>
          <MapboxMap
            latitude={selectedCoords.latitude}
            longitude={selectedCoords.longitude}
            zoom={15}
            onLocationSelect={handleMapLocationSelect}
            showCurrentLocation={false}
            interactive={true}
            style={styles.map}
            markers={[]}
          />
          
          {/* MARCADOR VISUAL ENCIMA DEL MAPA */}
          <View style={styles.mapMarkerOverlay}>
            <View style={styles.mapMarker}>
              <View style={styles.markerPin}>
                <Ionicons name="location" size={20} color="white" />
              </View>
              <View style={styles.markerPoint} />
            </View>
          </View>
          
          {/* Botón de ubicación actual */}
          <TouchableOpacity
            style={[styles.currentLocationButton, { 
              backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
              borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
            }]}
            onPress={getCurrentLocation}
            disabled={isGettingCurrentLocation}
          >
            {isGettingCurrentLocation ? (
              <ActivityIndicator size="small" color={Colors.light.primary} />
            ) : (
              <Ionicons 
                name="locate" 
                size={20} 
                color={Colors.light.primary} 
              />
            )}
          </TouchableOpacity>
          
          {mapLoading && (
            <View style={styles.mapLoadingOverlay}>
              <ActivityIndicator size="large" color={Colors.light.primary} />
              <ThemedText style={styles.loadingText}>Cargando mapa...</ThemedText>
            </View>
          )}
          
          {mapError && (
            <View style={styles.mapErrorOverlay}>
              <Ionicons name="cloud-offline-outline" size={40} color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} />
              <ThemedText style={styles.errorText}>
                No se pudo cargar el mapa. Verifica tu conexión a internet.
              </ThemedText>
            </View>
          )}
        </View>
        
        <ThemedText style={[styles.mapInstructions, { 
          color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
        }]}>
          Toca en el mapa para seleccionar la ubicación exacta o usa el buscador
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
      statusBarTranslucent={true}
    >
      <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" translucent />
      <ThemedView style={styles.centeredView}>
        <View style={[styles.modalView, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          shadowColor: Colors.light.shadowColor 
        }]}>
          <View style={[styles.modalHeader, { 
            borderBottomColor: isDarkMode ? Colors.dark.border : Colors.light.border 
          }]}>
            <ThemedText style={styles.modalTitle}>
              {isEditing 
                ? (isAddingNew ? 'Añadir ubicación' : 'Editar ubicación')
                : 'Mis ubicaciones'
              }
            </ThemedText>
            <TouchableOpacity onPress={isEditing ? resetEditState : onClose} style={styles.closeButton}>
              <Ionicons name={isEditing ? "arrow-back" : "close"} size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <View style={styles.formField}>
                <ThemedText style={[styles.fieldLabel, { 
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
                }]}>Nombre</ThemedText>
                <TextInput
                  style={[styles.input, { 
                    borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                    backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
                    color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary 
                  }]}
                  value={editingName}
                  onChangeText={setEditingName}
                  placeholder="Ej: Casa, Trabajo, Gimnasio..."
                  placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
                />
              </View>
              
              <View style={styles.formField}>
                <ThemedText style={[styles.fieldLabel, { 
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
                }]}>Dirección</ThemedText>
                <TextInput
                  style={[styles.input, { 
                    borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                    backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
                    color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary 
                  }]}
                  value={editingAddress}
                  onChangeText={setEditingAddress}
                  placeholder="Dirección completa"
                  placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
                  multiline
                />
              </View>
              
              {renderMapContent()}
              
              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  { backgroundColor: Colors.light.primary },
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
                    <Ionicons name="location-outline" size={50} color={isDarkMode ? Colors.dark.textSecondary : "#ccc"} />
                    <ThemedText style={[styles.emptyText, { 
                      color: isDarkMode ? Colors.dark.textSecondary : "#999" 
                    }]}>No hay ubicaciones guardadas</ThemedText>
                  </View>
                }
              />
              
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: Colors.light.primary }]}
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
    maxHeight: '85%',
    borderRadius: 20,
    overflow: 'hidden',
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
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
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
    borderWidth: 1,
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
  },
  locationAddress: {
    fontSize: 14,
  },
  locationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
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
  },
  editForm: {
    padding: 16,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  mapContainer: {
    marginBottom: 20,
  },
  mapWrapper: {
    position: 'relative',
    height: 220,
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  map: {
    width: '100%',
    height: 220,
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
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  searchLoader: {
    marginLeft: 8,
  },
  clearSearchButton: {
    padding: 4,
  },
  searchResults: {
    maxHeight: 200,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  searchResultItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchResultIcon: {
    marginRight: 10,
  },
  searchResultText: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  searchResultSubtitle: {
    fontSize: 12,
  },
  currentLocationButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedLocationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 8,
  },
  selectedLocationText: {
    flex: 1,
    fontSize: 12,
    marginLeft: 8,
    lineHeight: 16,
  },
  mapMarkerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  mapMarker: {
    width: 35,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerPin: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  markerPoint: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF0000',
    marginTop: -3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
}); 