import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  { id: '3', type: 'cash', name: 'Efectivo', details: 'Pago en efectivo al momento del servicio' },
];

export default function AgendarServicioScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { nurseId, nurseName, date, time, rate } = useLocalSearchParams();
  
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [customDuration, setCustomDuration] = useState<number | null>(null);
  const [serviceAddress, setServiceAddress] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  const nurseRate = parseFloat(rate as string) || 350;
  const serviceCost = selectedService ? selectedService.basePrice : 0;
  const duration = customDuration || selectedService?.duration || 1;
  const nursingCost = nurseRate * duration;
  const additionalCharges = 50; // Transportation fee
  const totalCost = serviceCost + nursingCost + additionalCharges;

  const handleConfirmBooking = () => {
    if (!selectedService || !serviceAddress || !selectedPaymentMethod) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    Alert.alert(
      'Confirmar Reserva',
      `¿Confirmas la reserva del servicio de ${selectedService.name} con ${nurseName} el ${date} a las ${time}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            // Here you would typically make an API call to book the service
            Alert.alert('¡Reserva Confirmada!', 'Tu servicio ha sido agendado exitosamente', [
              { text: 'OK', onPress: () => router.push('/enfermeria/mis-servicios' as any) }
            ]);
          }
        }
      ]
    );
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
      <View style={styles.paymentMethodIcon}>
        <Ionicons 
          name={method.type === 'card' ? 'card' : 'cash'} 
          size={24} 
          color={selectedPaymentMethod?.id === method.id ? Colors.light.primary : (isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary)}
        />
      </View>
      <View style={styles.paymentMethodContent}>
        <ThemedText style={[
          styles.paymentMethodName,
          { color: selectedPaymentMethod?.id === method.id ? Colors.light.primary : (isDarkMode ? Colors.dark.text : Colors.light.text) }
        ]} numberOfLines={1}>
          {method.name}
        </ThemedText>
        <ThemedText style={[styles.paymentMethodDetails, {
          color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
        }]} numberOfLines={2}>
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
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.title} numberOfLines={1}>Agendar Servicio</ThemedText>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Booking Summary */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Resumen de la cita</ThemedText>
          <View style={styles.summaryRow}>
            <ThemedText style={[styles.summaryLabel, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>Enfermera:</ThemedText>
            <ThemedText style={styles.summaryValue} numberOfLines={1}>{nurseName}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={[styles.summaryLabel, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>Fecha y hora:</ThemedText>
            <ThemedText style={styles.summaryValue} numberOfLines={1}>{date} a las {time}</ThemedText>
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
        </View>

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

        {/* Payment Method */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Método de pago *</ThemedText>
            <TouchableOpacity style={styles.addPaymentButton}>
              <Ionicons name="add" size={20} color={Colors.light.primary} />
              <ThemedText style={[styles.addPaymentText, { color: Colors.light.primary }]}>
                Agregar nuevo
              </ThemedText>
            </TouchableOpacity>
          </View>
          {paymentMethods.map(renderPaymentMethod)}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: Math.min(20, SCREEN_WIDTH * 0.05),
    fontWeight: 'bold',
    marginLeft: 16,
    flex: 1,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
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
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
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
    minHeight: 100,
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
    fontSize: 14,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
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
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  costValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPaymentText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    minHeight: 80,
  },
  paymentMethodIcon: {
    marginRight: 12,
    width: 32,
    alignItems: 'center',
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
    lineHeight: 20,
  },
  confirmSection: {
    padding: 16,
    borderTopWidth: 1,
  },
  confirmButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 