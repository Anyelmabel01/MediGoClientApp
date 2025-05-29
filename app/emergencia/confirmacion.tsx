import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const PAYMENT_METHODS = [
  { id: 'card', name: 'Tarjeta de crédito', icon: 'card' as const, details: '**** 1234' },
];

export default function EmergenciaConfirmacionScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user, currentLocation } = useUser();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  
  const handleConfirm = () => {
    router.push('/emergencia/seguimiento' as any);
  };

  // Datos simulados del resumen usando información del usuario
  const emergencyData = {
    type: 'Emergencia Médica',
    description: 'Solicitud de emergencia médica',
    severity: 'Media',
    patient: `${user.nombre} ${user.apellido}`,
    bloodType: user.tipoSangre,
    phone: user.telefono,
    location: currentLocation.direccion,
    contact: `${user.nombre} ${user.apellido} - ${user.telefono}`,
    provider: 'MediGo Emergency Services',
    estimatedTime: '8-12 minutos',
    rating: 4.8,
    baseFee: 25.00,
    distanceFee: 5.00,
    total: 30.00,
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Confirmar Solicitud</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.alertBox}>
          <View style={styles.alertIcon}>
            <Ionicons name="flash" size={20} color={Colors.light.primary} />
          </View>
          <ThemedText style={styles.alertText}>
            Proceso rápido: Tu información ha sido cargada automáticamente
          </ThemedText>
        </View>
        
        {/* Resumen de la Emergencia */}
        <View style={styles.summaryCard}>
          <ThemedText style={styles.cardTitle}>Resumen de la Emergencia</ThemedText>
          
          <View style={styles.summaryRow}>
            <View style={[styles.iconContainer, { backgroundColor: '#F44336' + '20' }]}>
              <Ionicons name="medkit" size={18} color="#F44336" />
            </View>
            <View style={styles.summaryContent}>
              <ThemedText style={styles.summaryLabel}>Tipo de emergencia</ThemedText>
              <ThemedText style={styles.summaryValue}>{emergencyData.type}</ThemedText>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={18} color={Colors.light.primary} />
            </View>
            <View style={styles.summaryContent}>
              <ThemedText style={styles.summaryLabel}>Paciente</ThemedText>
              <ThemedText style={styles.summaryValue}>{emergencyData.patient}</ThemedText>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="water" size={18} color={Colors.light.primary} />
            </View>
            <View style={styles.summaryContent}>
              <ThemedText style={styles.summaryLabel}>Tipo de sangre</ThemedText>
              <ThemedText style={styles.summaryValue}>{emergencyData.bloodType}</ThemedText>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="call" size={18} color={Colors.light.primary} />
            </View>
            <View style={styles.summaryContent}>
              <ThemedText style={styles.summaryLabel}>Teléfono</ThemedText>
              <ThemedText style={styles.summaryValue}>{emergencyData.phone}</ThemedText>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={18} color={Colors.light.primary} />
            </View>
            <View style={styles.summaryContent}>
              <ThemedText style={styles.summaryLabel}>Ubicación</ThemedText>
              <ThemedText style={styles.summaryValue} numberOfLines={2}>{emergencyData.location}</ThemedText>
            </View>
          </View>
        </View>

        {/* Información del Proveedor */}
        <View style={styles.summaryCard}>
          <ThemedText style={styles.cardTitle}>Proveedor del Servicio</ThemedText>
          
          <View style={styles.providerInfo}>
            <View style={styles.providerIcon}>
              <Ionicons name="medical" size={28} color={Colors.light.primary} />
            </View>
            <View style={styles.providerDetails}>
              <ThemedText style={styles.providerName}>{emergencyData.provider}</ThemedText>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <ThemedText style={styles.rating}>{emergencyData.rating}</ThemedText>
              </View>
              <ThemedText style={styles.estimatedTime}>
                Tiempo estimado: {emergencyData.estimatedTime}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Cálculo de Precios */}
        <View style={styles.summaryCard}>
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
        <View style={styles.summaryCard}>
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
              <View style={styles.paymentIconContainer}>
                <Ionicons name={method.icon} size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.paymentDetails}>
                <ThemedText style={styles.paymentName}>{method.name}</ThemedText>
                <ThemedText style={styles.paymentInfo}>{method.details}</ThemedText>
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
          <Ionicons name="flash" size={20} color="white" style={styles.buttonIcon} />
          <ThemedText style={styles.confirmButtonText}>Confirmar Emergencia</ThemedText>
        </TouchableOpacity>

        <View style={styles.disclaimerBox}>
          <View style={styles.disclaimerIcon}>
            <Ionicons name="information-circle" size={18} color="#FF9800" />
          </View>
          <ThemedText style={styles.disclaimerText}>
            Al confirmar, un equipo médico será despachado a tu ubicación. El pago se procesará según el método seleccionado.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.white,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  alertBox: {
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.light.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
  },
  estimatedTime: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.light.text,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.primary + '20',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
  },
  selectedPaymentMethod: {
    backgroundColor: Colors.light.primary + '10',
    borderColor: Colors.light.primary,
  },
  paymentIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 2,
  },
  paymentInfo: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  confirmButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  disclaimerBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FFCC02' + '40',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disclaimerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFCC02' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#E65100',
    lineHeight: 16,
  },
}); 