import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MapboxMap from '../../components/MapboxMap';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const { height } = Dimensions.get('window');

export default function EmergenciaUbicacionScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [selectedOption, setSelectedOption] = useState<'current' | 'saved' | 'new' | 'map' | null>(null);
  const [newAddress, setNewAddress] = useState('');
  const [reference, setReference] = useState('');
  const [buildingDetails, setBuildingDetails] = useState('');
  const [accessInstructions, setAccessInstructions] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedMapLocation, setSelectedMapLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  
  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos de ubicación',
          'Necesitamos acceso a tu ubicación para ofrecerte el mejor servicio',
          [{ text: 'OK' }]
        );
        return;
      }
      setLocationPermission(true);
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    if (!locationPermission) {
      await requestLocationPermission();
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });
      setSelectedOption('current');
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Error de ubicación',
        'No pudimos obtener tu ubicación actual. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleMapLocationSelect = (lat: number, lng: number) => {
    setSelectedMapLocation({ lat, lng });
    setSelectedOption('map');
  };

  const getLocationText = () => {
    if (selectedOption === 'current' && currentLocation) {
      return `Lat: ${currentLocation.lat.toFixed(6)}, Lng: ${currentLocation.lng.toFixed(6)}`;
    }
    if (selectedOption === 'map' && selectedMapLocation) {
      return `Lat: ${selectedMapLocation.lat.toFixed(6)}, Lng: ${selectedMapLocation.lng.toFixed(6)}`;
    }
    return '';
  };
  
  const handleContinue = () => {
    router.push('/emergencia/paciente' as any);
  };

  const canContinue = selectedOption && (
    selectedOption === 'current' ||
    selectedOption === 'saved' ||
    selectedOption === 'map' ||
    (selectedOption === 'new' && newAddress.trim() !== '')
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Ubicación de Emergencia</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.alertBox, { 
          backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE',
          borderColor: isDarkMode ? 'rgba(244, 67, 54, 0.2)' : '#FFCDD2'
        }]}>
          <Ionicons name="location" size={24} color="#F44336" />
          <ThemedText style={[styles.alertText, { color: '#D32F2F' }]}>
            Es importante proporcionar la ubicación exacta para una respuesta rápida
          </ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>¿Dónde necesitas el servicio?</ThemedText>
          
          <TouchableOpacity 
            style={[
              styles.optionCard,
              { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                borderColor: selectedOption === 'current' ? Colors.light.primary : (isDarkMode ? Colors.dark.border : Colors.light.border)
              }
            ]}
            onPress={getCurrentLocation}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="navigate" size={24} color={Colors.light.primary} />
              <ThemedText style={styles.optionTitle}>Usar ubicación actual</ThemedText>
              {selectedOption === 'current' && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
              )}
            </View>
            <ThemedText style={[styles.optionDescription, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              {selectedOption === 'current' && currentLocation ? 
                getLocationText() : 
                'Detectamos automáticamente tu ubicación GPS actual'
              }
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.optionCard,
              { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                borderColor: selectedOption === 'saved' ? Colors.light.primary : (isDarkMode ? Colors.dark.border : Colors.light.border)
              }
            ]}
            onPress={() => setSelectedOption('saved')}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="bookmark" size={24} color={Colors.light.primary} />
              <ThemedText style={styles.optionTitle}>Dirección guardada</ThemedText>
              {selectedOption === 'saved' && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
              )}
            </View>
            <ThemedText style={[styles.optionDescription, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Casa: Calle 50 #15-20, San Francisco
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.optionCard,
              { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                borderColor: selectedOption === 'map' ? Colors.light.primary : (isDarkMode ? Colors.dark.border : Colors.light.border)
              }
            ]}
            onPress={() => setSelectedOption('map')}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="map" size={24} color={Colors.light.primary} />
              <ThemedText style={styles.optionTitle}>Seleccionar en el mapa</ThemedText>
              {selectedOption === 'map' && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
              )}
            </View>
            <ThemedText style={[styles.optionDescription, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              {selectedOption === 'map' && selectedMapLocation ? 
                getLocationText() : 
                'Toca en el mapa para seleccionar la ubicación exacta'
              }
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.optionCard,
              { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                borderColor: selectedOption === 'new' ? Colors.light.primary : (isDarkMode ? Colors.dark.border : Colors.light.border)
              }
            ]}
            onPress={() => setSelectedOption('new')}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="add-circle-outline" size={24} color={Colors.light.primary} />
              <ThemedText style={styles.optionTitle}>Ingresar nueva dirección</ThemedText>
              {selectedOption === 'new' && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
              )}
            </View>
            <ThemedText style={[styles.optionDescription, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Escribir una dirección diferente
            </ThemedText>
          </TouchableOpacity>
        </View>

        {selectedOption === 'map' && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Selecciona la ubicación en el mapa</ThemedText>
            <View style={styles.mapContainer}>
              <MapboxMap
                latitude={currentLocation?.lat || 8.9824}
                longitude={currentLocation?.lng || -79.5199}
                zoom={15}
                onLocationSelect={handleMapLocationSelect}
                showCurrentLocation={true}
                interactive={true}
                style={styles.map}
              />
            </View>
            <ThemedText style={[styles.mapInstructions, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Toca en cualquier punto del mapa para seleccionar la ubicación de la emergencia
            </ThemedText>
          </View>
        )}

        {selectedOption === 'new' && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Detalles de la dirección</ThemedText>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Dirección *</ThemedText>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}
                placeholder="Ej: Calle 50 #15-20, San Francisco"
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
                value={newAddress}
                onChangeText={setNewAddress}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Puntos de referencia</ThemedText>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}
                placeholder="Ej: Frente al supermercado El Rey"
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
                value={reference}
                onChangeText={setReference}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Edificio/Apartamento</ThemedText>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}
                placeholder="Ej: Edificio Torre Azul, Apto 5B"
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
                value={buildingDetails}
                onChangeText={setBuildingDetails}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Instrucciones de acceso</ThemedText>
              <TextInput
                style={[styles.textAreaInput, { 
                  backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}
                placeholder="Ej: Portería en el primer piso, código 1234"
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
                value={accessInstructions}
                onChangeText={setAccessInstructions}
                multiline={true}
                numberOfLines={3}
              />
            </View>
          </View>
        )}
        
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !canContinue && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <ThemedText style={styles.continueButtonText}>Continuar</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    flex: 1,
  },
  alertBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  alertText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 36,
  },
  mapContainer: {
    height: height * 0.4,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    flex: 1,
  },
  mapInstructions: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textAreaInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  continueButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 