import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Paleta de colores oficial MediGo
const COLORS = {
  primary: '#00A0B0',
  primaryLight: '#33b5c2',
  primaryDark: '#006070',
  accent: '#70D0E0',
  background: '#FFFFFF',
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  white: '#FFFFFF',
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  border: '#E9ECEF',
  cardBg: '#f8f9fa',
};

type Provider = {
  id: string;
  display_name: string;
  provider_type: string;
  organization_name?: string;
  avatar_url?: string;
  consultation_fee: number;
  location: string;
};

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

type UploadedDocument = {
  id: string;
  name: string;
  size: number;
  type: string;
  uri: string;
};

// Mock provider data
const mockProviders: Record<string, Provider> = {
  '1': {
    id: '1',
    display_name: 'Dr. María González',
    provider_type: 'Cardióloga',
    organization_name: 'Centro Médico Integral',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    consultation_fee: 800,
    location: 'Col. Roma Norte, CDMX'
  },
  '2': {
    id: '2',
    display_name: 'Dr. Carlos Ramírez',
    provider_type: 'Médico General',
    organization_name: 'Clínica San Miguel',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    consultation_fee: 600,
    location: 'Col. Condesa, CDMX'
  }
};

const paymentMethods: PaymentMethod[] = [
  {
    id: 'efectivo',
    name: 'Efectivo',
    icon: 'cash-outline',
    description: 'Paga en el consultorio'
  },
  {
    id: 'tarjeta',
    name: 'Tarjeta de crédito/débito',
    icon: 'card-outline',
    description: 'Visa, MasterCard, American Express'
  },
  {
    id: 'transferencia',
    name: 'Transferencia bancaria',
    icon: 'swap-horizontal-outline',
    description: 'SPEI, transferencia electrónica'
  },
  {
    id: 'digital',
    name: 'Pago digital',
    icon: 'phone-portrait-outline',
    description: 'PayPal, Mercado Pago, OXXO Pay'
  }
];

export default function AgendarCitaScreen() {
  const router = useRouter();
  const { providerId, selectedDate, selectedTime } = useLocalSearchParams();
  
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const provider = mockProviders[providerId as string];

  if (!provider) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Agendar Cita</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={[styles.emptyTitle, { color: COLORS.error }]}>
            Proveedor no encontrado
          </Text>
        </View>
      </View>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const newDocument: UploadedDocument = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size || 0,
          type: file.mimeType || 'unknown',
          uri: file.uri,
        };
        setUploadedDocuments([...uploadedDocuments, newDocument]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el documento. Inténtalo de nuevo.');
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    setUploadedDocuments(uploadedDocuments.filter(doc => doc.id !== documentId));
  };

  const validateForm = () => {
    if (!reason.trim()) {
      Alert.alert('Campo requerido', 'Por favor describe el motivo de tu consulta.');
      return false;
    }
    if (!selectedPayment) {
      Alert.alert('Método de pago', 'Por favor selecciona un método de pago.');
      return false;
    }
    if (!acceptedTerms) {
      Alert.alert('Términos y condiciones', 'Debes aceptar los términos y condiciones para continuar.');
      return false;
    }
    return true;
  };

  const handleConfirmAppointment = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Cita agendada',
        'Tu cita ha sido agendada exitosamente. Recibirás una confirmación por correo electrónico.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/consulta/consultorio/mis-citas')
          }
        ]
      );
    }, 2000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Agendar Cita</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Appointment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de la Cita</Text>
          
          <View style={styles.appointmentSummary}>
            <View style={styles.providerSummary}>
              <Image 
                source={{ uri: provider.avatar_url || 'https://via.placeholder.com/60' }}
                style={styles.providerAvatar}
              />
              <View style={styles.providerDetails}>
                <Text style={styles.providerName}>{provider.display_name}</Text>
                <Text style={styles.providerType}>{provider.provider_type}</Text>
                {provider.organization_name && (
                  <Text style={styles.organizationName}>
                    {provider.organization_name}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.appointmentDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                <Text style={styles.detailText}>
                  {selectedDate === 'today' ? 'Hoy' : 'Mañana'} • {selectedTime}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color={COLORS.primary} />
                <Text style={styles.detailText}>{provider.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="cash-outline" size={16} color={COLORS.primary} />
                <Text style={styles.detailText}>
                  Costo: ${provider.consultation_fee}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reason for Visit */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Motivo de la consulta *
          </Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Describe brevemente el motivo de tu consulta..."
            placeholderTextColor={COLORS.textSecondary}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Notas adicionales (opcional)
          </Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Información adicional que consideres relevante..."
            placeholderTextColor={COLORS.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Document Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Documentos relevantes (opcional)
          </Text>
          <Text style={styles.sectionSubtitle}>
            Sube estudios, recetas o documentos médicos relevantes
          </Text>

          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleDocumentUpload}
          >
            <Ionicons name="cloud-upload-outline" size={24} color={COLORS.primary} />
            <Text style={styles.uploadButtonText}>
              Subir documento
            </Text>
          </TouchableOpacity>

          {uploadedDocuments.length > 0 && (
            <View style={styles.documentsContainer}>
              {uploadedDocuments.map((document) => (
                <View key={document.id} style={styles.documentItem}>
                  <View style={styles.documentInfo}>
                    <Ionicons 
                      name={document.type.includes('pdf') ? 'document-outline' : 'image-outline'} 
                      size={20} 
                      color={COLORS.primary} 
                    />
                    <View style={styles.documentText}>
                      <Text style={styles.documentName} numberOfLines={1}>
                        {document.name}
                      </Text>
                      <Text style={styles.documentSize}>
                        {formatFileSize(document.size)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveDocument(document.id)}
                  >
                    <Ionicons name="close-circle" size={20} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Método de pago *
          </Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                selectedPayment === method.id && styles.selectedPaymentOption
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentContent}>
                <View style={styles.paymentLeft}>
                  <View style={[
                    styles.radioButton,
                    selectedPayment === method.id && styles.selectedRadioButton
                  ]}>
                    {selectedPayment === method.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Ionicons 
                    name={method.icon as any} 
                    size={24} 
                    color={selectedPayment === method.id ? COLORS.primary : COLORS.textSecondary} 
                  />
                  <View style={styles.paymentInfo}>
                    <Text style={[
                      styles.paymentName,
                      { color: selectedPayment === method.id ? COLORS.primary : COLORS.textPrimary }
                    ]}>
                      {method.name}
                    </Text>
                    <Text style={styles.paymentDescription}>
                      {method.description}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.termsContainer}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
          >
            <View style={[
              styles.checkbox,
              acceptedTerms && styles.checkedCheckbox
            ]}>
              {acceptedTerms && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text style={styles.termsText}>
              Acepto los{' '}
              <Text style={styles.termsLink}>términos y condiciones</Text>
              {' '}y la{' '}
              <Text style={styles.termsLink}>política de privacidad</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.confirmContainer}>
        <TouchableOpacity 
          style={[
            styles.confirmButton,
            { 
              backgroundColor: (reason && selectedPayment && acceptedTerms && !isSubmitting) 
                ? COLORS.primary 
                : COLORS.textSecondary,
              opacity: (reason && selectedPayment && acceptedTerms && !isSubmitting) ? 1 : 0.6
            }
          ]}
          onPress={handleConfirmAppointment}
          disabled={!reason || !selectedPayment || !acceptedTerms || isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.confirmButtonText}>Procesando...</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.confirmButtonText}>
                Confirmar cita • ${provider.consultation_fee}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: COLORS.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
    color: COLORS.textSecondary,
  },
  appointmentSummary: {
    gap: 16,
  },
  providerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    color: COLORS.textPrimary,
  },
  providerType: {
    fontSize: 14,
    marginBottom: 2,
    color: COLORS.textSecondary,
  },
  organizationName: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  appointmentDetails: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    textAlignVertical: 'top',
    height: 100,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    textAlignVertical: 'top',
    height: 80,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: COLORS.primary + '10',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  documentsContainer: {
    marginTop: 12,
    gap: 8,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  documentText: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  documentSize: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  removeButton: {
    padding: 4,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    backgroundColor: COLORS.white,
  },
  selectedPaymentOption: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  paymentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkedCheckbox: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    flex: 1,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  confirmContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
}); 