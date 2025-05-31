import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type StepData = {
  collectionMethod: 'laboratory' | 'home' | null;
  selectedLab?: Laboratory;
  appointmentDate: Date | null;
  appointmentTime: string | null;
  personalInfo: {
    phone: string;
    email: string;
    emergencyContact: string;
    notes: string;
    address?: {
      street: string;
      city: string;
      postalCode: string;
      references: string;
    };
  };
  medicalInfo: {
    hasRecipe: boolean;
    recipeImage?: string;
    allergies: string;
    medications: string;
    fastingHours?: number;
  };
  payment: {
    method: 'card' | 'cash' | 'insurance' | null;
    promoCode: string;
    discount: number;
  };
};

type Laboratory = {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  homeCollection: boolean;
  availableSlots: string[];
  price: number;
};

const mockLaboratories: Laboratory[] = [
  {
    id: '1',
    name: 'Laboratorio Central Plaza',
    address: 'Av. Insurgentes Sur 1234, Col. Del Valle',
    distance: '1.2 km',
    rating: 4.8,
    homeCollection: true,
    availableSlots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    price: 0
  },
  {
    id: '2',
    name: 'Clínica Norte Especializada',
    address: 'Av. Universidad 567, Col. Narvarte',
    distance: '2.1 km',
    rating: 4.6,
    homeCollection: true,
    availableSlots: ['07:30', '08:30', '09:30', '10:30', '15:30', '16:30'],
    price: 0
  },
  {
    id: '3',
    name: 'Centro Médico Sur',
    address: 'Calz. de Tlalpan 890, Col. Vértiz Narvarte',
    distance: '3.5 km',
    rating: 4.4,
    homeCollection: false,
    availableSlots: ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00'],
    price: 0
  }
];

const steps = [
  'Método de toma',
  'Selección de laboratorio',
  'Fecha y hora',
  'Información personal',
  'Información médica',
  'Pago',
  'Confirmación'
];

export default function SolicitarScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const { testId, nombrePrueba } = useLocalSearchParams<{
    testId: string;
    nombrePrueba: string;
  }>();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para modales personalizados  
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'error' });

  const [stepData, setStepData] = useState<StepData>({
    collectionMethod: null,
    appointmentDate: null,
    appointmentTime: null,
    personalInfo: {
      phone: '',
      email: '',
      emergencyContact: '',
      notes: ''
    },
    medicalInfo: {
      hasRecipe: false,
      allergies: '',
      medications: ''
    },
    payment: {
      method: null,
      promoCode: '',
      discount: 0
    }
  });

  const colors = isDarkMode ? Colors.dark : Colors.light;
  
  // Obtener precio base de la prueba (mock)
  const basePrice = 250; // En una app real vendría de la API
  const homeCollectionFee = stepData.collectionMethod === 'home' ? 100 : 0;
  const totalPrice = basePrice + homeCollectionFee - stepData.payment.discount;

  useEffect(() => {
    // Validar si podemos continuar al siguiente paso
    const canContinue = validateCurrentStep();
  }, [stepData, currentStep]);

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Método de toma
        return stepData.collectionMethod !== null;
      case 1: // Selección de laboratorio
        return stepData.selectedLab !== undefined;
      case 2: // Fecha y hora
        return stepData.appointmentDate !== null && stepData.appointmentTime !== null;
      case 3: // Información personal
        const { phone, email } = stepData.personalInfo;
        const validPhone = phone.length >= 10;
        const validEmail = email.includes('@') && email.includes('.');
        const validAddress = stepData.collectionMethod === 'laboratory' || 
          (stepData.personalInfo.address?.street && stepData.personalInfo.address?.city);
        return validPhone && validEmail && validAddress;
      case 4: // Información médica
        return true; // Este paso es opcional pero se puede validar
      case 5: // Pago
        return stepData.payment.method !== null;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      setModalConfig({
        title: 'Información incompleta',
        message: 'Por favor completa todos los campos requeridos.',
        type: 'error'
      });
      setShowErrorModal(true);
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setStepData(prev => ({
        ...prev,
        appointmentDate: selectedDate
      }));
    }
  };

  const handleTimeSelect = (time: string) => {
    setStepData(prev => ({
      ...prev,
      appointmentTime: time
    }));
  };

  const handleLabSelect = (lab: Laboratory) => {
    setStepData(prev => ({
      ...prev,
      selectedLab: lab
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simular envío de datos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setModalConfig({
        title: 'Cita Agendada Exitosamente',
        message: `Tu cita para ${nombrePrueba} ha sido programada para el ${stepData.appointmentDate?.toLocaleDateString('es-VE')} a las ${stepData.appointmentTime}.`,
        type: 'success'
      });
      setShowSuccessModal(true);
    } catch (error) {
      setModalConfig({
        title: 'Error',
        message: 'Hubo un problema al agendar tu cita. Intenta nuevamente.',
        type: 'error'
      });
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Método de toma
        return (
          <View style={styles.stepContent}>
            <ThemedText style={[styles.stepQuestion, { color: colors.text }]}>
              ¿Dónde deseas realizar la prueba?
            </ThemedText>
            
            <TouchableOpacity
              style={[
                styles.methodCard,
                { 
                  backgroundColor: stepData.collectionMethod === 'laboratory' ? colors.primary : colors.background,
                  borderColor: stepData.collectionMethod === 'laboratory' ? colors.primary : colors.border
                }
              ]}
              onPress={() => setStepData(prev => ({ ...prev, collectionMethod: 'laboratory' }))}
            >
              <Ionicons 
                name="business-outline" 
                size={32} 
                color={stepData.collectionMethod === 'laboratory' ? '#fff' : colors.primary} 
              />
              <View style={styles.methodInfo}>
                <ThemedText style={[
                  styles.methodTitle,
                  { color: stepData.collectionMethod === 'laboratory' ? '#fff' : colors.text }
                ]}>
                  En Laboratorio
                </ThemedText>
                <ThemedText style={[
                  styles.methodDescription,
                  { color: stepData.collectionMethod === 'laboratory' ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
                ]}>
                  Acude directamente al laboratorio de tu elección
                </ThemedText>
                <ThemedText style={[
                  styles.methodPrice,
                  { color: stepData.collectionMethod === 'laboratory' ? '#fff' : colors.success }
                ]}>
                  Sin costo adicional
                </ThemedText>
              </View>
              {stepData.collectionMethod === 'laboratory' && (
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodCard,
                { 
                  backgroundColor: stepData.collectionMethod === 'home' ? colors.primary : colors.background,
                  borderColor: stepData.collectionMethod === 'home' ? colors.primary : colors.border
                }
              ]}
              onPress={() => setStepData(prev => ({ ...prev, collectionMethod: 'home' }))}
            >
              <Ionicons 
                name="home-outline" 
                size={32} 
                color={stepData.collectionMethod === 'home' ? '#fff' : colors.primary} 
              />
              <View style={styles.methodInfo}>
                <ThemedText style={[
                  styles.methodTitle,
                  { color: stepData.collectionMethod === 'home' ? '#fff' : colors.text }
                ]}>
                  A Domicilio
                </ThemedText>
                <ThemedText style={[
                  styles.methodDescription,
                  { color: stepData.collectionMethod === 'home' ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
                ]}>
                  Un técnico visitará tu domicilio para la toma de muestra
                </ThemedText>
                <ThemedText style={[
                  styles.methodPrice,
                  { color: stepData.collectionMethod === 'home' ? '#fff' : colors.accent }
                ]}>
                  + Bs 100 VED
                </ThemedText>
              </View>
              {stepData.collectionMethod === 'home' && (
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        );

      case 1: // Selección de laboratorio
        const filteredLabs = stepData.collectionMethod === 'home' 
          ? mockLaboratories.filter(lab => lab.homeCollection)
          : mockLaboratories;
          
        return (
          <View style={styles.stepContent}>
            <ThemedText style={[styles.stepQuestion, { color: colors.text }]}>
              Selecciona un laboratorio
            </ThemedText>
            
            {filteredLabs.map(lab => (
              <TouchableOpacity
                key={lab.id}
                style={[
                  styles.labCard,
                  { 
                    backgroundColor: stepData.selectedLab?.id === lab.id ? colors.primaryLight : colors.background,
                    borderColor: stepData.selectedLab?.id === lab.id ? colors.primary : colors.border
                  }
                ]}
                onPress={() => handleLabSelect(lab)}
              >
                <View style={styles.labInfo}>
                  <ThemedText style={[styles.labName, { color: colors.text }]}>
                    {lab.name}
                  </ThemedText>
                  <ThemedText style={[styles.labAddress, { color: colors.textSecondary }]}>
                    {lab.address}
                  </ThemedText>
                  <View style={styles.labMeta}>
                    <View style={styles.labMetaItem}>
                      <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                      <ThemedText style={[styles.labMetaText, { color: colors.textSecondary }]}>
                        {lab.distance}
                      </ThemedText>
                    </View>
                    <View style={styles.labMetaItem}>
                      <Ionicons name="star" size={14} color="#ffc107" />
                      <ThemedText style={[styles.labMetaText, { color: colors.textSecondary }]}>
                        {lab.rating}
                      </ThemedText>
                    </View>
                    {stepData.collectionMethod === 'home' && lab.homeCollection && (
                      <View style={styles.labMetaItem}>
                        <Ionicons name="home" size={14} color={colors.success} />
                        <ThemedText style={[styles.labMetaText, { color: colors.success }]}>
                          A domicilio
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>
                {stepData.selectedLab?.id === lab.id && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case 2: // Fecha y hora
        return (
          <View style={styles.stepContent}>
            <ThemedText style={[styles.stepQuestion, { color: colors.text }]}>
              Selecciona fecha y hora
            </ThemedText>
            
            <TouchableOpacity 
              style={[styles.dateButton, { 
                backgroundColor: colors.background,
                borderColor: colors.border 
              }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <ThemedText style={[styles.dateButtonText, { color: colors.text }]}>
                {stepData.appointmentDate 
                  ? stepData.appointmentDate.toLocaleDateString('es-VE', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  : 'Seleccionar fecha'
                }
              </ThemedText>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={stepData.appointmentDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
                maximumDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 días
              />
            )}

            {stepData.appointmentDate && stepData.selectedLab && (
              <View style={styles.timeSlots}>
                <ThemedText style={[styles.timeSlotsTitle, { color: colors.text }]}>
                  Horarios disponibles:
                </ThemedText>
                <View style={styles.timeSlotsGrid}>
                  {stepData.selectedLab.availableSlots.map(time => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        { 
                          backgroundColor: stepData.appointmentTime === time ? colors.primary : colors.background,
                          borderColor: stepData.appointmentTime === time ? colors.primary : colors.border
                        }
                      ]}
                      onPress={() => handleTimeSelect(time)}
                    >
                      <ThemedText style={[
                        styles.timeSlotText,
                        { color: stepData.appointmentTime === time ? '#fff' : colors.text }
                      ]}>
                        {time}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        );

      case 3: // Información personal
        return (
          <View style={styles.stepContent}>
            <ThemedText style={[styles.stepQuestion, { color: colors.text }]}>
              Información de contacto
            </ThemedText>
            
            <View style={styles.formGroup}>
              <ThemedText style={[styles.formLabel, { color: colors.text }]}>
                Teléfono *
              </ThemedText>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                placeholder="Ej: 55 1234 5678"
                placeholderTextColor={colors.textSecondary}
                value={stepData.personalInfo.phone}
                onChangeText={(text) => setStepData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, phone: text }
                }))}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={[styles.formLabel, { color: colors.text }]}>
                Correo electrónico *
              </ThemedText>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                placeholder="ejemplo@correo.com"
                placeholderTextColor={colors.textSecondary}
                value={stepData.personalInfo.email}
                onChangeText={(text) => setStepData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, email: text }
                }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={[styles.formLabel, { color: colors.text }]}>
                Contacto de emergencia
              </ThemedText>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                placeholder="Nombre y teléfono"
                placeholderTextColor={colors.textSecondary}
                value={stepData.personalInfo.emergencyContact}
                onChangeText={(text) => setStepData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, emergencyContact: text }
                }))}
              />
            </View>

            {stepData.collectionMethod === 'home' && (
              <>
                <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>
                  Dirección para toma a domicilio
                </ThemedText>
                
                <View style={styles.formGroup}>
                  <ThemedText style={[styles.formLabel, { color: colors.text }]}>
                    Calle y número *
                  </ThemedText>
                  <TextInput
                    style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card, color: colors.text }]}
                    placeholder="Av. Insurgentes Sur 1234"
                    placeholderTextColor={colors.text + '80'}
                    value={stepData.personalInfo.address?.street || ''}
                    onChangeText={(text) => setStepData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        address: {
                          ...prev.personalInfo.address!,
                          street: text
                        }
                      }
                    }))}
                  />
                </View>

                <View style={styles.formGroup}>
                  <ThemedText style={[styles.formLabel, { color: colors.text }]}>
                    Colonia y Ciudad *
                  </ThemedText>
                  <TextInput
                    style={[styles.formInput, { 
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text 
                    }]}
                    placeholder="Col. Del Valle, Caracas"
                    placeholderTextColor={colors.textSecondary}
                    value={stepData.personalInfo.address?.city || ''}
                    onChangeText={(text) => setStepData(prev => ({
                      ...prev,
                      personalInfo: { 
                        ...prev.personalInfo, 
                        address: { ...prev.personalInfo.address!, city: text }
                      }
                    }))}
                  />
                </View>

                <View style={styles.formGroup}>
                  <ThemedText style={[styles.formLabel, { color: colors.text }]}>
                    Referencias
                  </ThemedText>
                  <TextInput
                    style={[styles.formInput, { 
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text 
                    }]}
                    placeholder="Casa azul, portón negro"
                    placeholderTextColor={colors.textSecondary}
                    value={stepData.personalInfo.address?.references || ''}
                    onChangeText={(text) => setStepData(prev => ({
                      ...prev,
                      personalInfo: { 
                        ...prev.personalInfo, 
                        address: { ...prev.personalInfo.address!, references: text }
                      }
                    }))}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </>
            )}

            <View style={styles.formGroup}>
              <ThemedText style={[styles.formLabel, { color: colors.text }]}>
                Notas adicionales
              </ThemedText>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                placeholder="Información adicional que consideres relevante"
                placeholderTextColor={colors.textSecondary}
                value={stepData.personalInfo.notes}
                onChangeText={(text) => setStepData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, notes: text }
                }))}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        );

      case 4: // Información médica
        return (
          <View style={styles.stepContent}>
            <ThemedText style={[styles.stepQuestion, { color: colors.text }]}>
              Información médica
            </ThemedText>
            
            <View style={[styles.switchRow, { backgroundColor: colors.background }]}>
              <View style={styles.switchContent}>
                <ThemedText style={[styles.switchLabel, { color: colors.text }]}>
                  ¿Tienes orden médica?
                </ThemedText>
                <ThemedText style={[styles.switchDescription, { color: colors.textSecondary }]}>
                  Algunos estudios requieren receta médica
                </ThemedText>
              </View>
              <Switch
                value={stepData.medicalInfo.hasRecipe}
                onValueChange={(value) => setStepData(prev => ({
                  ...prev,
                  medicalInfo: { ...prev.medicalInfo, hasRecipe: value }
                }))}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={[styles.formLabel, { color: colors.text }]}>
                Alergias conocidas
              </ThemedText>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                placeholder="Ej: Penicilina, mariscos, látex"
                placeholderTextColor={colors.textSecondary}
                value={stepData.medicalInfo.allergies}
                onChangeText={(text) => setStepData(prev => ({
                  ...prev,
                  medicalInfo: { ...prev.medicalInfo, allergies: text }
                }))}
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={[styles.formLabel, { color: colors.text }]}>
                Medicamentos actuales
              </ThemedText>
              <TextInput
                style={[styles.formInput, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                placeholder="Lista los medicamentos que tomas actualmente"
                placeholderTextColor={colors.textSecondary}
                value={stepData.medicalInfo.medications}
                onChangeText={(text) => setStepData(prev => ({
                  ...prev,
                  medicalInfo: { ...prev.medicalInfo, medications: text }
                }))}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={[styles.infoCard, { 
              backgroundColor: colors.primaryLight, 
              borderColor: colors.primary 
            }]}>
              <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
              <View style={styles.infoCardContent}>
                <ThemedText style={[styles.infoCardTitle, { color: colors.primary }]}>
                  Preparación importante
                </ThemedText>
                <ThemedText style={[styles.infoCardText, { color: colors.text }]}>
                  Recuerda seguir las indicaciones de ayuno si la prueba lo requiere. 
                  Te contactaremos 24 horas antes para confirmarte los detalles.
                </ThemedText>
              </View>
            </View>
          </View>
        );

      case 5: // Pago
        return (
          <View style={styles.stepContent}>
            <ThemedText style={[styles.stepQuestion, { color: colors.text }]}>
              Método de pago
            </ThemedText>
            
            {/* Resumen de costos */}
            <View style={[styles.costSummary, { 
              backgroundColor: colors.background,
              borderColor: colors.border 
            }]}>
              <ThemedText style={[styles.costSummaryTitle, { color: colors.text }]}>
                Resumen de costos
              </ThemedText>
              
              <View style={styles.costRow}>
                <ThemedText style={[styles.costLabel, { color: colors.textSecondary }]}>
                  Prueba de laboratorio
                </ThemedText>
                <ThemedText style={[styles.costValue, { color: colors.text }]}>
                  Bs {basePrice.toLocaleString()} VED
                </ThemedText>
              </View>
              
              {homeCollectionFee > 0 && (
                <View style={styles.costRow}>
                  <ThemedText style={[styles.costLabel, { color: colors.textSecondary }]}>
                    Toma a domicilio
                  </ThemedText>
                  <ThemedText style={[styles.costValue, { color: colors.text }]}>
                    Bs {homeCollectionFee.toLocaleString()} VED
                  </ThemedText>
                </View>
              )}
              
              {stepData.payment.discount > 0 && (
                <View style={styles.costRow}>
                  <ThemedText style={[styles.costLabel, { color: colors.success }]}>
                    Descuento aplicado
                  </ThemedText>
                  <ThemedText style={[styles.costValue, { color: colors.success }]}>
                    -Bs {stepData.payment.discount.toLocaleString()} VED
                  </ThemedText>
                </View>
              )}
              
              <View style={[styles.costRow, styles.totalRow]}>
                <ThemedText style={[styles.totalLabel, { color: colors.text }]}>
                  Total a pagar
                </ThemedText>
                <ThemedText style={[styles.totalValue, { color: colors.primary }]}>
                  Bs {totalPrice.toLocaleString()} VED
                </ThemedText>
              </View>
            </View>

            {/* Métodos de pago */}
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
              Selecciona método de pago
            </ThemedText>
            
            {['card'].map(method => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentMethod,
                  { 
                    backgroundColor: stepData.payment.method === method ? colors.primaryLight : colors.background,
                    borderColor: stepData.payment.method === method ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setStepData(prev => ({
                  ...prev,
                  payment: { ...prev.payment, method: method as any }
                }))}
              >
                <Ionicons 
                  name="card-outline"
                  size={24} 
                  color={stepData.payment.method === method ? colors.primary : colors.textSecondary} 
                />
                <View style={styles.paymentMethodInfo}>
                  <ThemedText style={[styles.paymentMethodTitle, { color: colors.text }]}>
                    Tarjeta de crédito/débito
                  </ThemedText>
                  <ThemedText style={[styles.paymentMethodDescription, { color: colors.textSecondary }]}>
                    Pago seguro en línea
                  </ThemedText>
                </View>
                {stepData.payment.method === method && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case 6: // Confirmación
        return (
          <View style={styles.stepContent}>
            <View style={styles.confirmationHeader}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success} />
              <ThemedText style={[styles.confirmationTitle, { color: colors.text }]}>
                ¡Casi listo!
              </ThemedText>
              <ThemedText style={[styles.confirmationSubtitle, { color: colors.textSecondary }]}>
                Revisa los detalles de tu cita antes de confirmar
              </ThemedText>
            </View>

            <View style={[styles.confirmationCard, { 
              backgroundColor: colors.background,
              borderColor: colors.border 
            }]}>
              <ThemedText style={[styles.confirmationCardTitle, { color: colors.primary }]}>
                Detalles de la cita
              </ThemedText>
              
              <View style={styles.confirmationRow}>
                <ThemedText style={[styles.confirmationLabel, { color: colors.textSecondary }]}>
                  Prueba:
                </ThemedText>
                <ThemedText style={[styles.confirmationValue, { color: colors.text }]}>
                  {nombrePrueba || 'Prueba de laboratorio'}
                </ThemedText>
              </View>

              <View style={styles.confirmationRow}>
                <ThemedText style={[styles.confirmationLabel, { color: colors.textSecondary }]}>
                  Método:
                </ThemedText>
                <ThemedText style={[styles.confirmationValue, { color: colors.text }]}>
                  {stepData.collectionMethod === 'home' ? 'Toma a domicilio' : 'En laboratorio'}
                </ThemedText>
              </View>

              <View style={styles.confirmationRow}>
                <ThemedText style={[styles.confirmationLabel, { color: colors.textSecondary }]}>
                  Laboratorio:
                </ThemedText>
                <ThemedText style={[styles.confirmationValue, { color: colors.text }]}>
                  {stepData.selectedLab?.name}
                </ThemedText>
              </View>

              <View style={styles.confirmationRow}>
                <ThemedText style={[styles.confirmationLabel, { color: colors.textSecondary }]}>
                  Fecha y hora:
                </ThemedText>
                <ThemedText style={[styles.confirmationValue, { color: colors.text }]}>
                  {stepData.appointmentDate?.toLocaleDateString('es-VE')} a las {stepData.appointmentTime}
                </ThemedText>
              </View>

              <View style={styles.confirmationRow}>
                <ThemedText style={[styles.confirmationLabel, { color: colors.textSecondary }]}>
                  Total a pagar:
                </ThemedText>
                <ThemedText style={[styles.confirmationValue, { color: colors.primary, fontWeight: 'bold' }]}>
                  Bs {totalPrice.toLocaleString()} VED
                </ThemedText>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
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
                  {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.greetingContainer}>
              <ThemedText style={styles.greeting}>
                Agendar Prueba
              </ThemedText>
              <View style={styles.editProfileIndicator}>
                <Ionicons name="flask" size={14} color={Colors.light.primary} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Indicador de progreso */}
      <View style={[styles.progressContainer, { backgroundColor: colors.background }]}>
        <View style={styles.stepsIndicator}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepIndicator}>
              <View style={[
                styles.stepNumber,
                { 
                  backgroundColor: index <= currentStep ? colors.primary : colors.border,
                  borderColor: index <= currentStep ? colors.primary : colors.border
                }
              ]}>
                {index < currentStep ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : (
                  <ThemedText style={[
                    styles.stepNumberText,
                    { color: index <= currentStep ? '#fff' : colors.textSecondary }
                  ]}>
                    {index + 1}
                  </ThemedText>
                )}
              </View>
              {index < steps.length - 1 && (
                <View style={[
                  styles.stepConnector,
                  { backgroundColor: index < currentStep ? colors.primary : colors.border }
                ]} />
              )}
            </View>
          ))}
        </View>
        <ThemedText style={[styles.currentStepLabel, { color: colors.text }]}>
          {steps[currentStep]}
        </ThemedText>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        >
          {renderStepContent()}
        </ScrollView>

        {/* Botones de navegación */}
        <View style={[styles.navigationContainer, { 
          backgroundColor: colors.background,
          borderTopColor: colors.border 
        }]}>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.prevButton,
              { 
                backgroundColor: currentStep > 0 ? colors.background : 'transparent',
                borderColor: colors.border,
                opacity: currentStep > 0 ? 1 : 0.5
              }
            ]}
            onPress={handlePrevious}
            disabled={currentStep === 0}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
            <ThemedText style={[styles.navButtonText, { color: colors.text }]}>
              Anterior
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              { 
                backgroundColor: validateCurrentStep() ? colors.primary : colors.border,
                opacity: validateCurrentStep() ? 1 : 0.5
              }
            ]}
            onPress={currentStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={!validateCurrentStep() || isLoading}
          >
            <ThemedText style={[styles.navButtonText, { color: '#fff' }]}>
              {currentStep === steps.length - 1 ? 'Confirmar' : 'Siguiente'}
            </ThemedText>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

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

      {/* Modal de Éxito */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.successModalContainer, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}>
            {/* Icono de éxito animado */}
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            </View>
            
            {/* Título */}
            <ThemedText style={[styles.successModalTitle, { 
              color: isDarkMode ? Colors.dark.text : Colors.light.textPrimary 
            }]}>
              ¡Cita agendada exitosamente!
            </ThemedText>
            
            {/* Mensaje */}
            <ThemedText style={[styles.successModalMessage, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              Tu cita para {nombrePrueba} ha sido programada para el {stepData.appointmentDate?.toLocaleDateString('es-VE')} a las {stepData.appointmentTime}.
            </ThemedText>
            
            {/* Información adicional */}
            <View style={[styles.appointmentInfoCard, { 
              backgroundColor: isDarkMode ? Colors.dark.border : 'rgba(76, 175, 80, 0.1)',
              borderColor: '#4CAF50'
            }]}>
              <View style={styles.appointmentInfoRow}>
                <Ionicons name="location" size={16} color="#4CAF50" />
                <ThemedText style={[styles.appointmentInfoText, { color: '#4CAF50' }]}>
                  {stepData.selectedLab?.name}
                </ThemedText>
              </View>
              <View style={styles.appointmentInfoRow}>
                <Ionicons name="calendar" size={16} color="#4CAF50" />
                <ThemedText style={[styles.appointmentInfoText, { color: '#4CAF50' }]}>
                  {stepData.collectionMethod === 'home' ? 'Toma a domicilio' : 'En laboratorio'}
                </ThemedText>
              </View>
            </View>
            
            {/* Botones */}
            <View style={styles.successModalButtons}>
              <TouchableOpacity 
                style={[styles.successModalButton, styles.secondaryButton, { borderColor: Colors.light.primary }]}
                onPress={() => {
                  setShowSuccessModal(false);
                  router.replace('/laboratorio');
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="flask" size={18} color={Colors.light.primary} />
                <ThemedText style={[styles.secondaryButtonText, { color: Colors.light.primary }]}>
                  Ver mis citas
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.successModalButton, styles.primaryButton, { backgroundColor: Colors.light.primary }]}
                onPress={() => {
                  setShowSuccessModal(false);
                  router.replace('/');
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="home" size={18} color={Colors.light.white} />
                <ThemedText style={[styles.primaryButtonText, { color: Colors.light.white }]}>
                  Ir al inicio
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
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
  progressContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  stepsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepConnector: {
    width: 20,
    height: 2,
    marginHorizontal: 4,
  },
  currentStepLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    padding: 16,
  },
  stepQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  methodInfo: {
    flex: 1,
    marginLeft: 16,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    marginBottom: 6,
  },
  methodPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  labCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  labInfo: {
    flex: 1,
  },
  labName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  labAddress: {
    fontSize: 14,
    marginBottom: 8,
  },
  labMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  labMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  labMetaText: {
    fontSize: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  dateButtonText: {
    fontSize: 16,
    marginLeft: 12,
  },
  timeSlots: {
    marginTop: 20,
  },
  timeSlotsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  prevButton: {
    borderWidth: 1,
  },
  nextButton: {
    borderWidth: 0,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  switchContent: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  infoCardContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoCardText: {
    fontSize: 13,
    lineHeight: 18,
  },
  costSummary: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  costSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 14,
  },
  costValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: 16,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentMethodDescription: {
    fontSize: 14,
  },
  confirmationHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  confirmationCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  confirmationCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  confirmationLabel: {
    fontSize: 14,
    flex: 1,
  },
  confirmationValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.light.background,
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalIconContainer: {
    backgroundColor: Colors.light.primary,
    borderRadius: 24,
    padding: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIconContainer: {
    backgroundColor: Colors.light.primary,
    borderRadius: 40,
    padding: 12,
    marginBottom: 16,
  },
  successModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successModalMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
  appointmentInfoCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
  },
  appointmentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentInfoText: {
    fontSize: 14,
    marginLeft: 8,
  },
  successModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  successModalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    borderWidth: 0,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 