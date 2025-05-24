import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type RatingCategory = 'overall' | 'responseTime' | 'serviceQuality' | 'paramedic';

export default function EmergenciaCompletadoScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [ratings, setRatings] = useState<Record<RatingCategory, number>>({
    overall: 0,
    responseTime: 0,
    serviceQuality: 0,
    paramedic: 0,
  });
  const [comments, setComments] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  
  const handleRating = (category: RatingCategory, rating: number) => {
    setRatings(prev => ({ ...prev, [category]: rating }));
  };

  const handleSubmitFeedback = () => {
    // Simular envío de feedback
    console.log('Feedback enviado:', { ratings, comments });
    router.push('/emergencia/historial' as any);
  };

  const handleNewRequest = () => {
    router.push('/emergencia/medica' as any);
  };

  const serviceData = {
    requestId: 'EMG-' + Date.now().toString().slice(-6),
    emergencyType: 'Emergencia Médica',
    startTime: '14:25',
    endTime: '15:10',
    duration: '45 min',
    status: 'Completado',
    providerName: 'MediGo Emergency Services',
    paramedicName: 'Dr. María González',
    baseFee: 25.00,
    distanceFee: 5.00,
    total: 30.00,
    paymentMethod: 'Tarjeta de crédito **** 1234',
    transactionId: 'TXN-' + Date.now().toString().slice(-8),
  };

  const ratingCategories = [
    { key: 'overall' as const, label: 'Calificación general', icon: 'star' as const },
    { key: 'responseTime' as const, label: 'Tiempo de respuesta', icon: 'time' as const },
    { key: 'serviceQuality' as const, label: 'Calidad del servicio', icon: 'medical' as const },
    { key: 'paramedic' as const, label: 'Atención del paramédico', icon: 'person' as const },
  ];

  const renderStars = (category: RatingCategory) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRating(category, star)}
          >
            <Ionicons
              name={star <= ratings[category] ? 'star' : 'star-outline'}
              size={32}
              color={star <= ratings[category] ? '#FFD700' : '#DDD'}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
        </View>
        <ThemedText style={styles.title}>¡Servicio Completado!</ThemedText>
        <ThemedText style={[styles.subtitle, { 
          color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
        }]}>
          Tu emergencia ha sido atendida exitosamente
        </ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Resumen del Servicio */}
        <View style={[styles.summaryCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
        }]}>
          <ThemedText style={styles.cardTitle}>Resumen del Servicio</ThemedText>
          
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>ID de solicitud:</ThemedText>
            <ThemedText style={styles.summaryValue}>{serviceData.requestId}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Tipo de emergencia:</ThemedText>
            <ThemedText style={styles.summaryValue}>{serviceData.emergencyType}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Hora de inicio:</ThemedText>
            <ThemedText style={styles.summaryValue}>{serviceData.startTime}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Hora de finalización:</ThemedText>
            <ThemedText style={styles.summaryValue}>{serviceData.endTime}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Duración:</ThemedText>
            <ThemedText style={styles.summaryValue}>{serviceData.duration}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Proveedor:</ThemedText>
            <ThemedText style={styles.summaryValue}>{serviceData.providerName}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Paramédico:</ThemedText>
            <ThemedText style={styles.summaryValue}>{serviceData.paramedicName}</ThemedText>
          </View>
        </View>

        {/* Recibo de Pago */}
        <View style={[styles.summaryCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
        }]}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Recibo de Pago</ThemedText>
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={() => setShowReceipt(!showReceipt)}
            >
              <Ionicons name="download" size={20} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.priceRow}>
            <ThemedText style={styles.priceLabel}>Tarifa base:</ThemedText>
            <ThemedText style={styles.priceValue}>${serviceData.baseFee.toFixed(2)}</ThemedText>
          </View>

          <View style={styles.priceRow}>
            <ThemedText style={styles.priceLabel}>Tarifa por distancia:</ThemedText>
            <ThemedText style={styles.priceValue}>${serviceData.distanceFee.toFixed(2)}</ThemedText>
          </View>

          <View style={[styles.priceRow, styles.totalRow]}>
            <ThemedText style={styles.totalLabel}>Total pagado:</ThemedText>
            <ThemedText style={styles.totalValue}>${serviceData.total.toFixed(2)}</ThemedText>
          </View>

          <View style={styles.paymentInfo}>
            <ThemedText style={[styles.paymentMethod, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Método de pago: {serviceData.paymentMethod}
            </ThemedText>
            <ThemedText style={[styles.transactionId, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              ID de transacción: {serviceData.transactionId}
            </ThemedText>
          </View>
        </View>

        {/* Sistema de Calificaciones */}
        <View style={[styles.summaryCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
        }]}>
          <ThemedText style={styles.cardTitle}>Califica el Servicio</ThemedText>
          <ThemedText style={[styles.ratingSubtitle, { 
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
          }]}>
            Tu opinión nos ayuda a mejorar nuestros servicios
          </ThemedText>
          
          {ratingCategories.map((category) => (
            <View key={category.key} style={styles.ratingCategory}>
              <View style={styles.ratingHeader}>
                <Ionicons name={category.icon} size={20} color={Colors.light.primary} />
                <ThemedText style={styles.ratingLabel}>{category.label}</ThemedText>
              </View>
              {renderStars(category.key)}
            </View>
          ))}

          <View style={styles.commentsSection}>
            <ThemedText style={styles.commentsLabel}>Comentarios adicionales</ThemedText>
            <TextInput
              style={[styles.commentsInput, { 
                backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
                color: isDarkMode ? Colors.dark.text : Colors.light.text,
                borderColor: isDarkMode ? Colors.dark.border : '#E0E0E0'
              }]}
              placeholder="Cuéntanos sobre tu experiencia..."
              placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
              value={comments}
              onChangeText={setComments}
              multiline={true}
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmitFeedback}
          >
            <ThemedText style={styles.submitButtonText}>Enviar Calificación</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Acciones Adicionales */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.newRequestButton]}
            onPress={handleNewRequest}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>Solicitar Servicio Similar</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.historyButton, { 
              backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
              borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
            }]}
            onPress={() => router.push('/emergencia/historial' as any)}
          >
            <Ionicons name="time" size={20} color={Colors.light.primary} />
            <ThemedText style={[styles.historyButtonText, { color: Colors.light.primary }]}>
              Ver Historial
            </ThemedText>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  successIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  downloadButton: {
    padding: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
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
    color: '#4CAF50',
  },
  paymentInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  paymentMethod: {
    fontSize: 14,
    marginBottom: 4,
  },
  transactionId: {
    fontSize: 12,
  },
  ratingSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  ratingCategory: {
    marginBottom: 20,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  star: {
    marginHorizontal: 4,
  },
  commentsSection: {
    marginTop: 12,
  },
  commentsLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  commentsInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 50,
    marginBottom: 12,
  },
  newRequestButton: {
    backgroundColor: '#F44336',
  },
  historyButton: {
    borderWidth: 1,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 