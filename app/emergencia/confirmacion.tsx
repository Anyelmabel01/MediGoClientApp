import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const PAYMENT_METHODS = [
  { id: 'card', name: 'Tarjeta de crédito', icon: 'card' as const, details: '**** 1234' },
  { id: 'cash', name: 'Efectivo', icon: 'cash' as const, details: 'Pagar al recibir servicio' },
];

export default function EmergenciaConfirmacionScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  
  const handleConfirm = () => {
    router.push('/emergencia/seguimiento' as any);
  };

  // Datos simulados del resumen
  const emergencyData = {
    type: 'Emergencia Médica',
    description: 'Dolor en el pecho intenso',
    severity: 'Alta',
    patient: 'Para mí',
    location: 'Ubicación actual (Calle 50 #15-20)',
    contact: 'Juan Pérez - +507 6123-4567',
    provider: 'MediGo Emergency Services',
    estimatedTime: '8-12 minutos',
    rating: 4.8,
    baseFee: 25.00,
    distanceFee: 5.00,
    total: 30.00,
  };

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
        <ThemedText style={styles.title}>Confirmar Solicitud</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.alertBox, { 
          backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE',
          borderColor: isDarkMode ? 'rgba(244, 67, 54, 0.2)' : '#FFCDD2'
        }]}>
          <Ionicons name="time" size={24} color="#F44336" />
          <ThemedText style={[styles.alertText, { color: '#D32F2F' }]}>
            Revisa cuidadosamente toda la información antes de confirmar
          </ThemedText>
        </View>
        
        {/* Resumen de la Emergencia */}
        <View style={[styles.summaryCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
        }]}>
          <ThemedText style={styles.cardTitle}>Resumen de la Emergencia</ThemedText>
          
          <View style={styles.summaryRow}>
            <Ionicons name="medkit" size={20} color="#F44336" />
            <View style={styles.summaryContent}>
              <ThemedText style={styles.summaryLabel}>Tipo de emergencia</ThemedText>
              <ThemedText style={styles.summaryValue}>{emergencyData.type}</ThemedText>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="document-text" size={20} color={Colors.light.primary} />
            <View style={styles.summaryContent}>
              <ThemedText style={styles.summaryLabel}>Descripción</ThemedText>
              <ThemedText style={styles.summaryValue}>{emergencyData.description}</ThemedText>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="alert-circle" size={20} color="#FF9800" />
            <View style={styles.summaryContent}>
              <ThemedText style={styles.summaryLabel}>Nivel de urgencia</ThemedText>
              <ThemedText style={[styles.summaryValue, { color: '#F44336', fontWeight: 'bold' }]}>
                {emergencyData.severity}
              </ThemedText>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="person" size={20} color={Colors.light.primary} />
            <View style={styles.summaryContent}>
              <ThemedText style={styles.summaryLabel}>Paciente</ThemedText>
              <ThemedText style={styles.summaryValue}>{emergencyData.patient}</ThemedText>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="location" size={20} color={Colors.light.primary} />
            <View style={styles.summaryContent}>
              <ThemedText style={styles.summaryLabel}>Ubicación</ThemedText>
              <ThemedText style={styles.summaryValue}>{emergencyData.location}</ThemedText>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="call" size={20} color={Colors.light.primary} />
            <View style={styles.summaryContent}>
              <ThemedText style={styles.summaryLabel}>Contacto</ThemedText>
              <ThemedText style={styles.summaryValue}>{emergencyData.contact}</ThemedText>
            </View>
          </View>
        </View>

        {/* Información del Proveedor */}
        <View style={[styles.summaryCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
        }]}>
          <ThemedText style={styles.cardTitle}>Proveedor del Servicio</ThemedText>
          
          <View style={styles.providerInfo}>
            <View style={styles.providerIcon}>
              <Ionicons name="medical" size={32} color={Colors.light.primary} />
            </View>
            <View style={styles.providerDetails}>
              <ThemedText style={styles.providerName}>{emergencyData.provider}</ThemedText>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <ThemedText style={styles.rating}>{emergencyData.rating}</ThemedText>
              </View>
              <ThemedText style={[styles.estimatedTime, { color: Colors.light.primary }]}>
                Tiempo estimado: {emergencyData.estimatedTime}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Cálculo de Precios */}
        <View style={[styles.summaryCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
        }]}>
          <ThemedText style={styles.cardTitle}>Detalle de Costos</ThemedText>
          
          <View style={styles.priceRow}>
            <ThemedText style={styles.priceLabel}>Tarifa base</ThemedText>
            <ThemedText style={styles.priceValue}>${emergencyData.baseFee.toFixed(2)}</ThemedText>
          </View>

          <View style={styles.priceRow}>
            <ThemedText style={styles.priceLabel}>Tarifa por distancia</ThemedText>
            <ThemedText style={styles.priceValue}>${emergencyData.distanceFee.toFixed(2)}</ThemedText>
          </View>

          <View style={[styles.priceRow, styles.totalRow]}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={styles.totalValue}>${emergencyData.total.toFixed(2)}</ThemedText>
          </View>
        </View>

        {/* Método de Pago */}
        <View style={[styles.summaryCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
        }]}>
          <ThemedText style={styles.cardTitle}>Método de Pago</ThemedText>
          
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity 
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === method.id && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <Ionicons name={method.icon} size={24} color={Colors.light.primary} />
              <View style={styles.paymentDetails}>
                <ThemedText style={styles.paymentName}>{method.name}</ThemedText>
                <ThemedText style={[styles.paymentInfo, { 
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
                }]}>{method.details}</ThemedText>
              </View>
              {selectedPaymentMethod === method.id && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <ThemedText style={styles.confirmButtonText}>Confirmar y Solicitar</ThemedText>
          <Ionicons name="checkmark" size={20} color="white" style={styles.confirmIcon} />
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
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  alertText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryContent: {
    marginLeft: 12,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  estimatedTime: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
  },
  priceValue: {
    fontSize: 16,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
  },
  selectedPaymentMethod: {
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  paymentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentInfo: {
    fontSize: 14,
    marginTop: 2,
  },
  confirmButton: {
    backgroundColor: '#F44336',
    borderRadius: 10,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmIcon: {
    marginLeft: 8,
  },
}); 