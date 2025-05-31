import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapboxMap } from '../../components/MapboxMap';
import { ThemedText } from '../../components/ThemedText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ServiceType = {
  id: string;
  name: string;
  duration: number; // in hours
  basePrice: number;
};

type PaymentMethod = {
  id: string;
  type: 'card' | 'cash';
  name: string;
  details: string;
};

const serviceTypes: ServiceType[] = [
  { id: '1', name: 'Aplicación de inyecciones', duration: 0.5, basePrice: 250 },
  { id: '2', name: 'Curación de heridas', duration: 1, basePrice: 350 },
  { id: '3', name: 'Toma de signos vitales', duration: 0.5, basePrice: 200 },
  { id: '4', name: 'Cuidado de adulto mayor', duration: 2, basePrice: 450 },
  { id: '5', name: 'Canalización intravenosa', duration: 1, basePrice: 400 },
  { id: '6', name: 'Sonda vesical', duration: 1.5, basePrice: 500 },
];

const paymentMethods: PaymentMethod[] = [
  { id: '1', type: 'card', name: 'Tarjeta de crédito', details: '**** **** **** 1234' },
  { id: '2', type: 'card', name: 'Tarjeta de débito', details: '**** **** **** 5678' },
];

export default function AgendarServicioScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const { nurseId, nurseName, date, time, rate } = useLocalSearchParams();
  
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [customDuration, setCustomDuration] = useState<number | null>(null);
  const [serviceAddress, setServiceAddress] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  
  // Map related states
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Estados para modales personalizados
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'info' });

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setModalConfig({
          title: 'Permisos requeridos',
          message: 'Se necesitan permisos de ubicación para usar esta función',
          type: 'error'
        });
        setShowErrorModal(true);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleLocationSelect = async (latitude: number, longitude: number) => {
    try {
      // Reverse geocoding to get address from coordinates
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const fullAddress = `${address.street || ''} ${address.streetNumber || ''}, ${address.district || ''}, ${address.city || ''}`.trim();
        
        setSelectedLocation({ latitude, longitude, address: fullAddress });
        setServiceAddress(fullAddress);
      } else {
        setSelectedLocation({ latitude, longitude });
        setServiceAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      }
      setShowMapModal(false);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setSelectedLocation({ latitude, longitude });
      setServiceAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      setShowMapModal(false);
    }
  };

  const nurseRate = parseFloat(rate as string) || 350;
  const serviceCost = selectedService ? selectedService.basePrice : 0;
  const duration = customDuration || selectedService?.duration || 1;
  const nursingCost = nurseRate * duration;
  const additionalCharges = 50; // Transportation fee
  const totalCost = serviceCost + nursingCost + additionalCharges;

  const handleConfirmBooking = () => {
    if (!selectedService || !serviceAddress || !selectedPaymentMethod) {
      setModalConfig({
        title: 'Error',
        message: 'Por favor completa todos los campos requeridos',
        type: 'error'
      });
      setShowErrorModal(true);
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmBooking = () => {
    setShowConfirmModal(false);
    setModalConfig({
      title: '¡Reserva Confirmada!',
      message: 'Tu servicio ha sido agendado exitosamente',
      type: 'success'
    });
    setShowSuccessModal(true);
  };

  const renderServiceOption = (service: ServiceType) => (
    <TouchableOpacity
      key={service.id}
      style={[
        styles.serviceOption,
        {
          backgroundColor: selectedService?.id === service.id 
            ? (isDarkMode ? 'rgba(45, 127, 249, 0.15)' : 'rgba(45, 127, 249, 0.1)')
            : (isDarkMode ? Colors.dark.background : Colors.light.background),
          borderColor: selectedService?.id === service.id 
            ? Colors.light.primary 
            : (isDarkMode ? Colors.dark.border : Colors.light.border),
        }
      ]}
      onPress={() => setSelectedService(service)}
    >
      <View style={styles.serviceOptionContent}>
        <ThemedText style={[
          styles.serviceName,
          { color: selectedService?.id === service.id ? Colors.light.primary : (isDarkMode ? Colors.dark.text : Colors.light.text) }
        ]} numberOfLines={2}>
          {service.name}
        </ThemedText>
        <ThemedText style={[styles.serviceDuration, {
          color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
        }]}>
          Duración estimada: {service.duration}h
        </ThemedText>
        <ThemedText style={[styles.servicePrice, { color: Colors.light.primary }]}>
          ${service.basePrice}
        </ThemedText>
      </View>
      {selectedService?.id === service.id && (
        <Ionicons name="checkmark-circle" size={24} color={Colors.light.primary} />
      )}
    </TouchableOpacity>
  );

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentOption,
        {
          backgroundColor: selectedPaymentMethod?.id === method.id
            ? (isDarkMode ? 'rgba(45, 127, 249, 0.15)' : 'rgba(45, 127, 249, 0.1)')
            : (isDarkMode ? Colors.dark.background : Colors.light.background),
          borderColor: selectedPaymentMethod?.id === method.id
            ? Colors.light.primary
            : (isDarkMode ? Colors.dark.border : Colors.light.border),
        }
      ]}
      onPress={() => setSelectedPaymentMethod(method)}
    >
      <View style={styles.paymentMethodContent}>
        <ThemedText style={[
          styles.paymentMethodName,
          { 
            color: selectedPaymentMethod?.id === method.id 
              ? Colors.light.primary 
              : (isDarkMode ? Colors.dark.text : Colors.light.text) 
          }
        ]} numberOfLines={1}>
          {method.name}
        </ThemedText>
        <ThemedText style={[styles.paymentMethodDetails, {
          color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
        }]} numberOfLines={1}>
          {method.details}
        </ThemedText>
      </View>
      {selectedPaymentMethod?.id === method.id && (
        <Ionicons name="checkmark-circle" size={24} color={Colors.light.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
          </TouchableOpacity>
          
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {user?.nombre?.charAt(0) || 'U'}{user?.apellido?.charAt(0) || 'S'}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.greetingContainer}>
              <ThemedText style={styles.greeting}>
                Agendar Servicio
              </ThemedText>
              <View style={styles.editProfileIndicator}>
                <Ionicons name="calendar" size={14} color={Colors.light.primary} />
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Booking Summary */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          borderColor: Colors.light.primary + '30',
        }]}>
          <View style={styles.sectionHeaderWithIcon}>
            <Ionicons name="clipboard" size={20} color={Colors.light.primary} />
            <ThemedText style={[styles.sectionTitle, { color: Colors.light.primary }]}>Resumen de la cita</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={[styles.summaryLabel, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>Enfermera:</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: Colors.light.primary }]} numberOfLines={1}>{nurseName}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={[styles.summaryLabel, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>Fecha y hora:</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: Colors.light.primary }]} numberOfLines={1}>{date} a las {time}</ThemedText>
          </View>
        </View>

        {/* Service Type Selection */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Tipo de servicio *</ThemedText>
          {serviceTypes.map(renderServiceOption)}
        </View>

        {/* Custom Duration */}
        {selectedService && (
          <View style={[styles.section, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          }]}>
            <ThemedText style={styles.sectionTitle}>Duración personalizada (opcional)</ThemedText>
            <View style={[styles.inputContainer, {
              backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.border,
            }]}>
              <TextInput
                style={[styles.input, {
                  color: isDarkMode ? Colors.dark.text : Colors.light.text,
                }]}
                placeholder={`Duración en horas (por defecto: ${selectedService.duration}h)`}
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
                value={customDuration?.toString() || ''}
                onChangeText={(text) => setCustomDuration(text ? parseFloat(text) : null)}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        {/* Service Address */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Dirección del servicio *</ThemedText>
          <View style={[styles.inputContainer, {
            backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          }]}>
            <Ionicons name="location" size={20} color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} />
            <TextInput
              style={[styles.input, {
                color: isDarkMode ? Colors.dark.text : Colors.light.text,
              }]}
              placeholder="Ingresa la dirección completa"
              placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
              value={serviceAddress}
              onChangeText={setServiceAddress}
              multiline
            />
          </View>
          
          {/* Map Button */}
          <TouchableOpacity
            style={[styles.mapButton, { backgroundColor: Colors.light.primary }]}
            onPress={() => setShowMapModal(true)}
          >
            <Ionicons name="map" size={20} color="white" />
            <ThemedText style={styles.mapButtonText}>
              {selectedLocation ? 'Cambiar ubicación en mapa' : 'Seleccionar en mapa'}
            </ThemedText>
          </TouchableOpacity>
          
          {selectedLocation && (
            <View style={styles.selectedLocationInfo}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.light.success} />
              <ThemedText style={[styles.selectedLocationText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]} numberOfLines={2}>
                Ubicación seleccionada en mapa
              </ThemedText>
            </View>
          )}
        </View>
        
        {/* Map Modal */}
        <Modal
          visible={showMapModal}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <View style={styles.mapModalContainer}>
            <View style={[styles.mapModalHeader, {
              backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
              borderBottomColor: isDarkMode ? Colors.dark.border : Colors.light.border,
            }]}>
              <TouchableOpacity
                style={styles.mapModalCloseButton}
                onPress={() => setShowMapModal(false)}
              >
                <Ionicons name="close" size={24} color={Colors.light.primary} />
              </TouchableOpacity>
              <ThemedText style={styles.mapModalTitle}>Seleccionar ubicación</ThemedText>
              <View style={{ width: 24 }} />
            </View>
            
            <View style={styles.mapContainer}>
              <MapboxMap
                latitude={currentLocation?.latitude || 9.9281}
                longitude={currentLocation?.longitude || -84.0907}
                zoom={13}
                onLocationSelect={handleLocationSelect}
                markers={selectedLocation ? [{
                  id: 'selected',
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                  color: Colors.light.primary,
                  title: 'Ubicación seleccionada'
                }] : []}
                showCurrentLocation={true}
                interactive={true}
                style={styles.map}
              />
              
              {/* Current Location Button */}
              <TouchableOpacity
                style={[styles.currentLocationButton, { backgroundColor: Colors.light.primary }]}
                onPress={() => {
                  if (currentLocation) {
                    handleLocationSelect(currentLocation.latitude, currentLocation.longitude);
                  } else {
                    getCurrentLocation();
                  }
                }}
              >
                <Ionicons name="locate" size={20} color="white" />
                <ThemedText style={styles.currentLocationText}>
                  Usar mi ubicación actual
                </ThemedText>
              </TouchableOpacity>
              
              {/* Sample Locations for Demo */}
              <View style={styles.sampleLocationsContainer}>
                <ThemedText style={[styles.sampleLocationsTitle, {
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}>
                  Ubicaciones de ejemplo:
                </ThemedText>
                
                <TouchableOpacity
                  style={[styles.sampleLocationButton, {
                    backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                    borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                  }]}
                  onPress={() => handleLocationSelect(9.9281, -84.0907)} // San José, Costa Rica
                >
                  <Ionicons name="business" size={16} color={Colors.light.primary} />
                  <ThemedText style={[styles.sampleLocationText, {
                    color: isDarkMode ? Colors.dark.text : Colors.light.text
                  }]}>
                    Centro de San José
                  </ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.sampleLocationButton, {
                    backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                    borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                  }]}
                  onPress={() => handleLocationSelect(9.9342, -84.0879)} // Escazú
                >
                  <Ionicons name="home" size={16} color={Colors.light.primary} />
                  <ThemedText style={[styles.sampleLocationText, {
                    color: isDarkMode ? Colors.dark.text : Colors.light.text
                  }]}>
                    Escazú Centro
                  </ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.sampleLocationButton, {
                    backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                    borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                  }]}
                  onPress={() => handleLocationSelect(9.9355, -84.1059)} // Santa Ana
                >
                  <Ionicons name="leaf" size={16} color={Colors.light.primary} />
                  <ThemedText style={[styles.sampleLocationText, {
                    color: isDarkMode ? Colors.dark.text : Colors.light.text
                  }]}>
                    Santa Ana
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Additional Notes */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Notas adicionales</ThemedText>
          <View style={[styles.inputContainer, {
            backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          }]}>
            <TextInput
              style={[styles.input, styles.textArea, {
                color: isDarkMode ? Colors.dark.text : Colors.light.text,
              }]}
              placeholder="Instrucciones especiales, alergias, medicamentos, etc."
              placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Cost Breakdown */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Costo del servicio</ThemedText>
          <View style={styles.costRow}>
            <ThemedText style={[styles.costLabel, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>Servicio base:</ThemedText>
            <ThemedText style={styles.costValue}>${serviceCost}</ThemedText>
          </View>
          <View style={styles.costRow}>
            <ThemedText style={[styles.costLabel, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]} numberOfLines={1}>Enfermería ({duration}h × ${nurseRate}/h):</ThemedText>
            <ThemedText style={styles.costValue}>${nursingCost}</ThemedText>
          </View>
          <View style={styles.costRow}>
            <ThemedText style={[styles.costLabel, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>Cargo por traslado:</ThemedText>
            <ThemedText style={styles.costValue}>${additionalCharges}</ThemedText>
          </View>
          <View style={[styles.costRow, styles.totalRow]}>
            <ThemedText style={[styles.totalLabel, { color: Colors.light.primary }]}>Total:</ThemedText>
            <ThemedText style={[styles.totalValue, { color: Colors.light.primary }]}>${totalCost}</ThemedText>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Método de pago *</ThemedText>
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  {
                    backgroundColor: selectedPaymentMethod?.id === method.id
                      ? (isDarkMode ? 'rgba(45, 127, 249, 0.15)' : 'rgba(45, 127, 249, 0.1)')
                      : (isDarkMode ? Colors.dark.background : Colors.light.background),
                    borderColor: selectedPaymentMethod?.id === method.id
                      ? Colors.light.primary
                      : (isDarkMode ? Colors.dark.border : Colors.light.border),
                  }
                ]}
                onPress={() => setSelectedPaymentMethod(method)}
              >
                <View style={styles.paymentMethodContent}>
                  <ThemedText style={[
                    styles.paymentMethodName,
                    { 
                      color: selectedPaymentMethod?.id === method.id 
                        ? Colors.light.primary 
                        : (isDarkMode ? Colors.dark.text : Colors.light.text) 
                    }
                  ]} numberOfLines={1}>
                    {method.name}
                  </ThemedText>
                  <ThemedText style={[styles.paymentMethodDetails, {
                    color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                  }]} numberOfLines={1}>
                    {method.details}
                  </ThemedText>
                </View>
                {selectedPaymentMethod?.id === method.id && (
                  <Ionicons name="checkmark-circle" size={24} color={Colors.light.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Personal Information Section - Datos del usuario */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Información personal</ThemedText>
          <View style={styles.personalInfoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={18} color={Colors.light.primary} />
              <ThemedText style={styles.infoText}>
                {user?.nombre || 'Usuario'} {user?.apellido || 'Apellido'}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={18} color={Colors.light.primary} />
              <ThemedText style={styles.infoText}>
                {user?.telefono || 'Sin teléfono'}
              </ThemedText>
            </View>
            {user?.email && (
              <View style={styles.infoRow}>
                <Ionicons name="mail" size={18} color={Colors.light.primary} />
                <ThemedText style={styles.infoText}>{user.email}</ThemedText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button - Now at bottom without absolute positioning */}
      <View style={[styles.confirmSection, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderTopColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        paddingBottom: insets.bottom,
      }]}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor: (selectedService && serviceAddress && selectedPaymentMethod) 
                ? Colors.light.primary 
                : (isDarkMode ? Colors.dark.border : Colors.light.border),
              opacity: (selectedService && serviceAddress && selectedPaymentMethod) ? 1 : 0.5
            }
          ]}
          onPress={handleConfirmBooking}
          disabled={!selectedService || !serviceAddress || !selectedPaymentMethod}
        >
          <ThemedText style={styles.confirmButtonText} numberOfLines={1}>
            Confirmar y Pagar - ${totalCost}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Modal de Error */}
      <Modal
        visible={showErrorModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="alert-circle" size={48} color="#ef4444" />
            </View>
            <ThemedText style={styles.modalTitle}>{modalConfig.title}</ThemedText>
            <ThemedText style={styles.modalMessage}>{modalConfig.message}</ThemedText>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowErrorModal(false)}
            >
              <ThemedText style={styles.modalButtonText}>Entendido</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmación */}
      <Modal
        visible={showConfirmModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="clipboard" size={48} color="#00A0B0" />
            </View>
            <ThemedText style={styles.modalTitle}>Confirmar Reserva</ThemedText>
            <ThemedText style={styles.modalMessage}>
              ¿Confirmas la reserva del servicio de {selectedService?.name} con {nurseName} el {date} a las {time}?
            </ThemedText>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <ThemedText style={styles.modalCancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={confirmBooking}
              >
                <Ionicons name="checkmark" size={20} color="white" />
                <ThemedText style={styles.modalConfirmButtonText}>Confirmar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Éxito */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="checkmark-circle" size={48} color="#10b981" />
            </View>
            <ThemedText style={styles.modalTitle}>{modalConfig.title}</ThemedText>
            <ThemedText style={styles.modalMessage}>{modalConfig.message}</ThemedText>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.push('/enfermeria/mis-servicios' as any);
              }}
            >
              <ThemedText style={styles.modalButtonText}>Continuar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 6,
    marginRight: 12,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: Colors.light.primary,
    fontSize: 17,
    fontWeight: 'bold',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  editProfileIndicator: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 4,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    backgroundColor: Colors.light.white,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    backgroundColor: Colors.light.white,
  },
  serviceOptionContent: {
    flex: 1,
    paddingRight: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 22,
  },
  serviceDuration: {
    fontSize: 13,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.white,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    minHeight: 20,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  costLabel: {
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },
  costValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPaymentText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    color: Colors.light.primary,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    backgroundColor: Colors.light.white,
    width: '100%',
  },
  paymentMethodContent: {
    flex: 1,
    paddingRight: 8,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentMethodDetails: {
    fontSize: 14,
    lineHeight: 18,
  },
  confirmSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    backgroundColor: Colors.light.white,
  },
  confirmButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: Colors.light.primary,
  },
  mapButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  selectedLocationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 1,
    borderColor: Colors.light.success,
  },
  selectedLocationText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
    color: Colors.light.success,
  },
  mapModalContainer: {
    flex: 1,
    backgroundColor: Colors.light.white,
  },
  mapModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.white,
  },
  mapModalCloseButton: {
    padding: 8,
    borderRadius: 8,
  },
  mapModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.light.primary,
  },
  mapContainer: {
    flex: 1,
    padding: 16,
  },
  map: {
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  mapInstructionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  mapInstructionsText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
    color: Colors.light.text,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: Colors.light.primary,
  },
  currentLocationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  sampleLocationsContainer: {
    backgroundColor: 'rgba(45, 127, 249, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sampleLocationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.primary,
  },
  sampleLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.white,
  },
  sampleLocationText: {
    fontSize: 14,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.light.white,
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxWidth: 400,
  },
  modalIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.light.primary,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.light.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalCancelButton: {
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 8,
  },
  modalCancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalConfirmButton: {
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 8,
  },
  modalConfirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentMethodsContainer: {
    // Sin flexDirection row, esto hará que se muestren verticalmente
  },
  paymentMethodInfo: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
  },
  personalInfoContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
    flexWrap: 'wrap',
  },
}); 