import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

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
    consultation_fee: 120,
    location: 'Altamira, Caracas'
  },
  '2': {
    id: '2',
    display_name: 'Dr. Carlos Ramírez',
    provider_type: 'Médico General',
    organization_name: 'Clínica San Miguel',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    consultation_fee: 80,
    location: 'Las Mercedes, Caracas'
  }
};

const paymentMethods: PaymentMethod[] = [
  {
    id: 'efectivo',
    name: 'Efectivo',
    icon: 'cash-outline',
    description: 'Paga en el consultorio al momento de la cita'
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const provider = mockProviders[providerId as string];

  if (!provider) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Agendar Cita</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.light.error} />
          <Text style={[styles.emptyTitle, { color: Colors.light.error }]}>
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
      setShowSuccessModal(true);
    }, 2000);
  };

  const SuccessModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showSuccessModal}
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          </View>
          
          <Text style={styles.successTitle}>¡Cita Agendada!</Text>
          <Text style={styles.successSubtitle}>
            Tu cita ha sido programada exitosamente
          </Text>
          
          <View style={styles.appointmentSummaryModal}>
            <View style={styles.summaryRow}>
              <Ionicons name="person-outline" size={18} color={Colors.light.primary} />
              <Text style={styles.summaryText}>{provider.display_name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="calendar-outline" size={18} color={Colors.light.primary} />
              <Text style={styles.summaryText}>
                {selectedDate === 'today' ? 'Hoy' : 'Mañana'} a las {selectedTime}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="location-outline" size={18} color={Colors.light.primary} />
              <Text style={styles.summaryText}>{provider.location}</Text>
            </View>
          </View>
          
          <Text style={styles.confirmationText}>
            Recibirás una confirmación por correo electrónico con todos los detalles de tu cita.
          </Text>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.viewAppointmentsButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.push('/consulta/consultorio/mis-citas');
              }}
            >
              <Ionicons name="calendar" size={18} color="white" />
              <Text style={styles.viewAppointmentsButtonText}>Ver mis citas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.okButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.back();
              }}
            >
              <Text style={styles.okButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Agendar Cita</Text>
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
                <Ionicons name="calendar-outline" size={14} color={Colors.light.primary} />
                <Text style={styles.detailText}>
                  {selectedDate === 'today' ? 'Hoy' : 'Mañana'} • {selectedTime}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={14} color={Colors.light.primary} />
                <Text style={styles.detailText}>{provider.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="cash-outline" size={14} color={Colors.light.primary} />
                <Text style={styles.detailText}>
                  Costo: Bs. {provider.consultation_fee}
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
            placeholderTextColor={Colors.light.textSecondary}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
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
            placeholderTextColor={Colors.light.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* Document Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Documentos relevantes (opcional)
          </Text>
          <Text style={styles.sectionSubtitle}>
            Sube estudios, recetas o documentos médicos
          </Text>

          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleDocumentUpload}
          >
            <Ionicons name="cloud-upload-outline" size={20} color={Colors.light.primary} />
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
                      size={18} 
                      color={Colors.light.primary} 
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
                    <Ionicons name="close-circle" size={18} color={Colors.light.error} />
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
                    size={20} 
                    color={selectedPayment === method.id ? Colors.light.primary : Colors.light.textSecondary} 
                  />
                  <View style={styles.paymentInfo}>
                    <Text style={[
                      styles.paymentName,
                      { color: selectedPayment === method.id ? Colors.light.primary : Colors.light.textPrimary }
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
                <Ionicons name="checkmark" size={14} color="white" />
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
                ? Colors.light.primary 
                : Colors.light.textSecondary,
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
              <Ionicons name="checkmark-circle" size={18} color="white" />
              <Text style={styles.confirmButtonText}>
                Confirmar cita • Bs. {provider.consultation_fee}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <SuccessModal />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 50,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.white,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.primary,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 8,
    color: Colors.light.textSecondary,
  },
  appointmentSummary: {
    gap: 12,
  },
  providerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    color: Colors.light.primary,
  },
  providerType: {
    fontSize: 13,
    marginBottom: 2,
    color: Colors.light.textSecondary,
  },
  organizationName: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  appointmentDetails: {
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.primary + '20',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: Colors.light.textPrimary,
    backgroundColor: Colors.light.white,
    textAlignVertical: 'top',
    height: 80,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: Colors.light.textPrimary,
    backgroundColor: Colors.light.white,
    textAlignVertical: 'top',
    height: 60,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: Colors.light.primary + '10',
  },
  uploadButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  documentsContainer: {
    marginTop: 8,
    gap: 6,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  documentText: {
    flex: 1,
  },
  documentName: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.textPrimary,
  },
  documentSize: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  removeButton: {
    padding: 4,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    backgroundColor: Colors.light.white,
  },
  selectedPaymentOption: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '10',
  },
  paymentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.light.primary + '50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: Colors.light.primary,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.light.primary + '50',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkedCheckbox: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  termsText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  termsLink: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  confirmContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1,
    borderTopColor: Colors.light.primary + '20',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.light.white,
    padding: 24,
    borderRadius: 20,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  successIcon: {
    backgroundColor: '#E8F5E8',
    borderRadius: 50,
    padding: 16,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4CAF50',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  appointmentSummaryModal: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.light.textPrimary,
    flex: 1,
  },
  confirmationText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  viewAppointmentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    gap: 8,
  },
  viewAppointmentsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  okButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F1F3F4',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  okButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
}); 