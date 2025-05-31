import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
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

  const handleDownloadReceipt = async () => {
    try {
      // Generar HTML del recibo con estilos profesionales
      const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Recibo de Emergencia MediGo</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 20px;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #00A0B0;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #00A0B0;
            margin-bottom: 5px;
        }
        .subtitle {
            color: #666;
            font-size: 16px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            background-color: #00A0B0;
            color: white;
            padding: 10px 15px;
            margin-bottom: 15px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 16px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #555;
        }
        .value {
            color: #00A0B0;
            font-weight: 600;
        }
        .total-row {
            background-color: #f0f9ff;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
        }
        .total-amount {
            font-size: 20px;
            font-weight: bold;
            color: #00A0B0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #00A0B0;
            color: #666;
        }
        .footer-message {
            font-style: italic;
            color: #00A0B0;
            font-weight: 600;
        }
        .receipt-id {
            background-color: #e8f4f8;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            font-family: monospace;
            font-size: 14px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">MediGo</div>
            <div class="subtitle">Recibo de Servicio de Emergencia</div>
        </div>
        
        <div class="receipt-id">
            <strong>ID de Solicitud:</strong> ${serviceData.requestId}<br>
            <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-VE')} - ${new Date().toLocaleTimeString('es-VE')}
        </div>

        <div class="section">
            <div class="section-title">Detalles del Servicio</div>
            <div class="info-row">
                <span class="label">Tipo de emergencia:</span>
                <span class="value">${serviceData.emergencyType}</span>
            </div>
            <div class="info-row">
                <span class="label">Hora de inicio:</span>
                <span class="value">${serviceData.startTime}</span>
            </div>
            <div class="info-row">
                <span class="label">Hora de finalización:</span>
                <span class="value">${serviceData.endTime}</span>
            </div>
            <div class="info-row">
                <span class="label">Duración total:</span>
                <span class="value">${serviceData.duration}</span>
            </div>
            <div class="info-row">
                <span class="label">Proveedor:</span>
                <span class="value">${serviceData.providerName}</span>
            </div>
            <div class="info-row">
                <span class="label">Paramédico asignado:</span>
                <span class="value">${serviceData.paramedicName}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Desglose de Costos</div>
            <div class="info-row">
                <span class="label">Tarifa base del servicio:</span>
                <span class="value">Bs ${serviceData.baseFee.toFixed(2)}</span>
            </div>
            <div class="info-row">
                <span class="label">Tarifa por distancia:</span>
                <span class="value">Bs ${serviceData.distanceFee.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <div class="info-row">
                    <span class="label">TOTAL PAGADO:</span>
                    <span class="total-amount">Bs ${serviceData.total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Información de Pago</div>
            <div class="info-row">
                <span class="label">Método de pago:</span>
                <span class="value">${serviceData.paymentMethod}</span>
            </div>
            <div class="info-row">
                <span class="label">ID de transacción:</span>
                <span class="value">${serviceData.transactionId}</span>
            </div>
        </div>

        <div class="footer">
            <p>Gracias por confiar en MediGo Emergency Services</p>
            <p class="footer-message">¡Tu seguridad es nuestra prioridad!</p>
            <p style="font-size: 12px; margin-top: 20px;">
                Este recibo es válido como comprobante de pago.<br>
                Para consultas, contacta nuestro centro de atención: +58 212-XXX-XXXX
            </p>
        </div>
    </div>
</body>
</html>
      `;

      // Generar PDF
      const { uri } = await Print.printToFileAsync({
        html: receiptHTML,
        base64: false,
      });

      // Verificar si el sharing está disponible
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartir recibo de emergencia',
        });
      } else {
        Alert.alert(
          'Recibo generado',
          'El recibo PDF se ha generado exitosamente.',
          [{ text: 'OK' }]
        );
      }
      
    } catch (error) {
      console.error('Error al generar recibo:', error);
      Alert.alert(
        'Error',
        'No se pudo generar el recibo. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    }
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
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          borderColor: Colors.light.primary + '30'
        }]}>
          <View style={styles.cardHeaderWithIcon}>
            <Ionicons name="document-text" size={24} color={Colors.light.primary} />
            <ThemedText style={[styles.cardTitle, { color: Colors.light.primary }]}>Resumen del Servicio</ThemedText>
          </View>
          
          <View style={styles.summaryRow}>
            <ThemedText style={[styles.summaryLabel, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>ID de solicitud:</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: Colors.light.primary }]}>{serviceData.requestId}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={[styles.summaryLabel, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Tipo de emergencia:</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: Colors.light.primary }]}>{serviceData.emergencyType}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={[styles.summaryLabel, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Hora de inicio:</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: Colors.light.primary }]}>{serviceData.startTime}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={[styles.summaryLabel, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Hora de finalización:</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: Colors.light.primary }]}>{serviceData.endTime}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={[styles.summaryLabel, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Duración:</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: Colors.light.primary }]}>{serviceData.duration}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={[styles.summaryLabel, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Proveedor:</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: Colors.light.primary }]}>{serviceData.providerName}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={[styles.summaryLabel, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Paramédico:</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: Colors.light.primary }]}>{serviceData.paramedicName}</ThemedText>
          </View>
        </View>

        {/* Recibo de Pago */}
        <View style={[styles.summaryCard, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          borderColor: Colors.light.primary + '30'
        }]}>
          <View style={styles.cardHeaderWithIcon}>
            <Ionicons name="card" size={24} color={Colors.light.primary} />
            <ThemedText style={[styles.cardTitle, { color: Colors.light.primary }]}>Recibo de Pago</ThemedText>
            <TouchableOpacity 
              style={styles.downloadButton}
              onPress={handleDownloadReceipt}
            >
              <Ionicons name="download" size={20} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.priceRow}>
            <ThemedText style={[styles.priceLabel, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Tarifa base:</ThemedText>
            <ThemedText style={[styles.priceValue, { color: Colors.light.primary }]}>Bs {serviceData.baseFee.toFixed(2)}</ThemedText>
          </View>

          <View style={styles.priceRow}>
            <ThemedText style={[styles.priceLabel, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Tarifa por distancia:</ThemedText>
            <ThemedText style={[styles.priceValue, { color: Colors.light.primary }]}>Bs {serviceData.distanceFee.toFixed(2)}</ThemedText>
          </View>

          <View style={[styles.priceRow, styles.totalRow, { borderTopColor: Colors.light.primary + '30' }]}>
            <ThemedText style={[styles.totalLabel, { color: Colors.light.primary }]}>Total pagado:</ThemedText>
            <ThemedText style={[styles.totalValue, { color: Colors.light.primary }]}>Bs {serviceData.total.toFixed(2)}</ThemedText>
          </View>

          <View style={[styles.paymentInfo, { borderTopColor: Colors.light.primary + '30' }]}>
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
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          borderColor: Colors.light.primary + '30'
        }]}>
          <View style={styles.cardHeaderWithIcon}>
            <Ionicons name="star" size={24} color={Colors.light.primary} />
            <ThemedText style={[styles.cardTitle, { color: Colors.light.primary }]}>Califica el Servicio</ThemedText>
          </View>
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
            <Ionicons name="add" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>Nueva Emergencia</ThemedText>
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

          <TouchableOpacity 
            style={[styles.actionButton, styles.homeButton]}
            onPress={() => router.replace('/')}
          >
            <Ionicons name="home" size={20} color="white" />
            <ThemedText style={styles.actionButtonText}>Ir al Inicio</ThemedText>
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
  cardHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  downloadButton: {
    padding: 8,
    marginLeft: 'auto',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 16,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
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
    color: Colors.light.primary,
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
    color: Colors.light.primary,
  },
  commentsInput: {
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
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
    borderRadius: 12,
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
  homeButton: {
    backgroundColor: Colors.light.primary,
  },
}); 