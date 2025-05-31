import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { useAppointments } from '../../../context/AppointmentsContext';

// Login color palette
const PRIMARY_COLOR = '#00A0B0';
const PRIMARY_LIGHT = '#33b5c2';
const PRIMARY_DARK = '#006070';
const ACCENT_COLOR = '#70D0E0';

type SpecialtyType = 'CARDIOLOGY' | 'DERMATOLOGY' | 'GENERAL_MEDICINE' | 'PSYCHOLOGY' | 'NEUROLOGY' | 'PEDIATRICS';
type LanguageType = 'SPANISH' | 'ENGLISH' | 'FRENCH';

type VirtualSpecialist = {
  id: string;
  display_name: string;
  specialty: SpecialtyType;
  bio: string;
  avatar_url?: string;
  next_availability: string;
  rating: number;
  consultation_fee: number;
  languages: LanguageType[];
  available_today: boolean;
  years_experience: number;
  education: string[];
  certifications: string[];
  total_consultations: number;
  response_time: string;
};

type Review = {
  id: string;
  patient_name: string;
  rating: number;
  comment: string;
  date: string;
};

type TimeSlot = {
  time: string;
  available: boolean;
};

const specialtyLabels: Record<SpecialtyType, string> = {
  'CARDIOLOGY': 'Cardiología',
  'DERMATOLOGY': 'Dermatología',
  'GENERAL_MEDICINE': 'Medicina General',
  'PSYCHOLOGY': 'Psicología',
  'NEUROLOGY': 'Neurología',
  'PEDIATRICS': 'Pediatría'
};

const languageLabels: Record<LanguageType, string> = {
  'SPANISH': 'Español',
  'ENGLISH': 'Inglés',
  'FRENCH': 'Francés'
};

// Mock data
const mockSpecialists: Record<string, VirtualSpecialist> = {
  '1': {
    id: '1',
    display_name: 'Dr. Carlos Mendoza',
    specialty: 'CARDIOLOGY',
    bio: 'Cardiólogo con 10 años de experiencia en telemedicina y diagnóstico cardiovascular. Especializado en hipertensión, arritmias y prevención de enfermedades cardíacas. Comprometido con brindar atención médica de calidad a través de consultas virtuales.',
    avatar_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    next_availability: 'Hoy, 2:00 PM',
    rating: 4.8,
    consultation_fee: 750,
    languages: ['SPANISH', 'ENGLISH'],
    available_today: true,
    years_experience: 10,
    education: [
      'Medicina - Universidad Nacional Autónoma de México',
      'Especialidad en Cardiología - Instituto Nacional de Cardiología',
      'Maestría en Telemedicina - Universidad de Barcelona'
    ],
    certifications: [
      'Certificación en Cardiología - Consejo Mexicano de Cardiología',
      'Certificación en Telemedicina - American Telemedicine Association',
      'Certificación en Ecocardiografía - Sociedad Mexicana de Cardiología'
    ],
    total_consultations: 1250,
    response_time: '< 2 horas'
  }
};

const mockReviews: Review[] = [
  {
    id: '1',
    patient_name: 'María G.',
    rating: 5,
    comment: 'Excelente doctor, muy profesional y explicó todo claramente. La consulta virtual fue muy cómoda.',
    date: '2024-12-20'
  },
  {
    id: '2',
    patient_name: 'Roberto S.',
    rating: 5,
    comment: 'Muy satisfecho con la atención. El doctor se tomó el tiempo necesario para responder todas mis preguntas.',
    date: '2024-12-18'
  },
  {
    id: '3',
    patient_name: 'Ana L.',
    rating: 4,
    comment: 'Buena consulta, aunque la conexión tuvo algunos problemas técnicos menores.',
    date: '2024-12-15'
  }
];

const todaySlots: TimeSlot[] = [
  { time: '2:00 PM', available: true },
  { time: '3:00 PM', available: false },
  { time: '4:00 PM', available: true },
  { time: '5:00 PM', available: true },
  { time: '6:00 PM', available: false }
];

const tomorrowSlots: TimeSlot[] = [
  { time: '9:00 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '2:00 PM', available: true },
  { time: '3:00 PM', available: true },
  { time: '4:00 PM', available: false }
];

export default function PerfilEspecialistaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { specialistId } = useLocalSearchParams();
  const { addTelemedicineAppointment } = useAppointments();
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>('today');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const specialist = mockSpecialists[specialistId as string];

  if (!specialist) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Perfil del Especialista</ThemedText>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={64} color={Colors.light.error} />
          <ThemedText style={[styles.emptyTitle, { color: Colors.light.error }]}>
            Especialista no encontrado
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  const handleScheduleConsultation = () => {
    if (!selectedTime) {
      Alert.alert('Selecciona un horario', 'Por favor selecciona un horario disponible para agendar tu consulta.');
      return;
    }

    setShowConfirmModal(true);
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color="#fbbf24" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#fbbf24" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#fbbf24" />
      );
    }

    return stars;
  };

  const renderTimeSlot = (slot: TimeSlot) => (
    <TouchableOpacity
      key={slot.time}
      style={[
        styles.timeSlot,
        {
          backgroundColor: slot.available 
            ? (selectedTime === slot.time ? PRIMARY_COLOR : 'transparent')
            : Colors.light.textSecondary + '20',
          borderColor: slot.available 
            ? (selectedTime === slot.time ? PRIMARY_COLOR : Colors.light.border)
            : Colors.light.textSecondary
        }
      ]}
      onPress={() => slot.available && setSelectedTime(slot.time)}
      disabled={!slot.available}
    >
      <ThemedText style={[
        styles.timeSlotText,
        {
          color: slot.available 
            ? (selectedTime === slot.time ? 'white' : (isDarkMode ? Colors.dark.text : Colors.light.text))
            : Colors.light.textSecondary
        }
      ]}>
        {slot.time}
      </ThemedText>
      {!slot.available && (
        <ThemedText style={[styles.unavailableText, { color: Colors.light.textSecondary }]}>
          No disponible
        </ThemedText>
      )}
    </TouchableOpacity>
  );

  const currentSlots = selectedDay === 'today' ? todaySlots : tomorrowSlots;

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Perfil del Especialista</ThemedText>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Specialist Info */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <View style={styles.specialistHeader}>
            <Image 
              source={{ uri: specialist.avatar_url || 'https://via.placeholder.com/100' }}
              style={styles.avatar}
            />
            <View style={styles.specialistInfo}>
              <ThemedText style={styles.specialistName}>{specialist.display_name}</ThemedText>
              <ThemedText style={[styles.specialty, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {specialtyLabels[specialist.specialty]}
              </ThemedText>
              <ThemedText style={[styles.experience, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {specialist.years_experience} años de experiencia
              </ThemedText>
              
              <View style={styles.ratingContainer}>
                <View style={styles.stars}>
                  {renderStarRating(specialist.rating)}
                </View>
                <ThemedText style={[styles.ratingText, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  {specialist.rating} ({specialist.total_consultations} consultas)
                </ThemedText>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <ThemedText style={[styles.price, { color: PRIMARY_COLOR }]}>
                ${specialist.consultation_fee}
              </ThemedText>
              <ThemedText style={[styles.priceLabel, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                por consulta
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Acerca del Doctor</ThemedText>
          <ThemedText style={[styles.bio, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            {specialist.bio}
          </ThemedText>
        </View>

        {/* Quick Stats */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Información Rápida</ThemedText>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color={PRIMARY_COLOR} />
              <ThemedText style={styles.statLabel}>Tiempo de respuesta</ThemedText>
              <ThemedText style={styles.statValue}>{specialist.response_time}</ThemedText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={20} color={PRIMARY_COLOR} />
              <ThemedText style={styles.statLabel}>Consultas realizadas</ThemedText>
              <ThemedText style={styles.statValue}>{specialist.total_consultations}</ThemedText>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="language-outline" size={20} color={PRIMARY_COLOR} />
              <ThemedText style={styles.statLabel}>Idiomas</ThemedText>
              <ThemedText style={styles.statValue}>
                {specialist.languages.map(lang => languageLabels[lang]).join(', ')}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Education */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Educación</ThemedText>
          {specialist.education.map((edu, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="school-outline" size={16} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.listItemText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {edu}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Certifications */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Certificaciones</ThemedText>
          {specialist.certifications.map((cert, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="ribbon-outline" size={16} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.listItemText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {cert}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Availability Calendar */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Disponibilidad</ThemedText>
          
          {/* Day Selector */}
          <View style={styles.daySelector}>
            <TouchableOpacity
              style={[
                styles.dayButton,
                {
                  backgroundColor: selectedDay === 'today' ? PRIMARY_COLOR : 'transparent',
                  borderColor: PRIMARY_COLOR
                }
              ]}
              onPress={() => {
                setSelectedDay('today');
                setSelectedTime(null);
              }}
            >
              <ThemedText style={[
                styles.dayButtonText,
                { color: selectedDay === 'today' ? 'white' : PRIMARY_COLOR }
              ]}>
                Hoy
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.dayButton,
                {
                  backgroundColor: selectedDay === 'tomorrow' ? PRIMARY_COLOR : 'transparent',
                  borderColor: PRIMARY_COLOR
                }
              ]}
              onPress={() => {
                setSelectedDay('tomorrow');
                setSelectedTime(null);
              }}
            >
              <ThemedText style={[
                styles.dayButtonText,
                { color: selectedDay === 'tomorrow' ? 'white' : PRIMARY_COLOR }
              ]}>
                Mañana
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Time Slots */}
          <View style={styles.timeSlotsContainer}>
            {currentSlots.map(renderTimeSlot)}
          </View>
        </View>

        {/* Reviews */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Reseñas de Pacientes</ThemedText>
          {mockReviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <ThemedText style={styles.reviewerName}>{review.patient_name}</ThemedText>
                <View style={styles.reviewRating}>
                  {renderStarRating(review.rating)}
                </View>
              </View>
              <ThemedText style={[styles.reviewComment, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {review.comment}
              </ThemedText>
              <ThemedText style={[styles.reviewDate, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {new Date(review.date).toLocaleDateString('es-ES')}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Schedule Button */}
      <View style={[styles.scheduleContainer, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderTopColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}>
        <TouchableOpacity 
          style={[
            styles.scheduleButton,
            { 
              backgroundColor: selectedTime ? PRIMARY_COLOR : Colors.light.textSecondary,
              opacity: selectedTime ? 1 : 0.6
            }
          ]}
          onPress={handleScheduleConsultation}
          disabled={!selectedTime}
        >
          <Ionicons name="calendar" size={20} color="white" />
          <ThemedText style={styles.scheduleButtonText}>
            {selectedTime ? `Agendar para ${selectedTime}` : 'Selecciona un horario'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Modal de Confirmación de Consulta */}
      <Modal
        visible={showConfirmModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="calendar" size={32} color={PRIMARY_COLOR} />
              </View>
              <ThemedText style={styles.modalTitle}>
                Confirmar Consulta Virtual
              </ThemedText>
            </View>

            {/* Información del Especialista */}
            <View style={styles.specialistSummary}>
              <Image 
                source={{ uri: specialist.avatar_url || 'https://via.placeholder.com/60' }}
                style={styles.modalAvatar}
              />
              <View style={styles.specialistSummaryInfo}>
                <ThemedText style={styles.modalSpecialistName}>
                  {specialist.display_name}
                </ThemedText>
                <ThemedText style={styles.modalSpecialty}>
                  {specialtyLabels[specialist.specialty]}
                </ThemedText>
                <View style={styles.modalRating}>
                  {renderStarRating(specialist.rating)}
                  <ThemedText style={styles.modalRatingText}>
                    {specialist.rating} ({specialist.total_consultations} consultas)
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Detalles de la Consulta */}
            <View style={styles.consultationDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="calendar-outline" size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.detailInfo}>
                  <ThemedText style={styles.detailLabel}>Fecha</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {selectedDay === 'today' ? 'Hoy' : 'Mañana'}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="time-outline" size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.detailInfo}>
                  <ThemedText style={styles.detailLabel}>Horario</ThemedText>
                  <ThemedText style={styles.detailValue}>{selectedTime}</ThemedText>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="videocam-outline" size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.detailInfo}>
                  <ThemedText style={styles.detailLabel}>Tipo</ThemedText>
                  <ThemedText style={styles.detailValue}>Consulta Virtual</ThemedText>
                </View>
              </View>

              <View style={styles.priceDetailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="card-outline" size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.detailInfo}>
                  <ThemedText style={styles.detailLabel}>Costo total</ThemedText>
                  <ThemedText style={styles.priceDetailValue}>
                    ${specialist.consultation_fee}
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Botones de Acción */}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={() => {
                  // Crear la cita nueva
                  const today = new Date();
                  const appointmentDate = selectedDay === 'today' 
                    ? today.toISOString().split('T')[0]
                    : new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

                  addTelemedicineAppointment({
                    date: appointmentDate,
                    time: selectedTime!,
                    specialist_name: specialist.display_name,
                    specialty: specialtyLabels[specialist.specialty],
                    avatar_url: specialist.avatar_url,
                    status: 'CONFIRMED',
                    consultation_fee: specialist.consultation_fee,
                    type: 'telemedicine',
                    can_join: false,
                    prescription_count: 0,
                    specialist_id: specialist.id,
                  });

                  setShowConfirmModal(false);
                  // Mostrar modal de éxito después de un breve delay
                  setTimeout(() => {
                    setShowSuccessModal(true);
                  }, 300);
                }}
              >
                <Ionicons name="checkmark" size={20} color="white" />
                <ThemedText style={styles.confirmButtonText}>Confirmar Consulta</ThemedText>
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
          <View style={styles.successModalContainer}>
            {/* Ícono de éxito */}
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#10b981" />
            </View>

            {/* Título */}
            <ThemedText style={styles.successTitle}>
              ¡Consulta Agendada!
            </ThemedText>

            {/* Mensaje */}
            <ThemedText style={styles.successMessage}>
              Tu consulta virtual ha sido agendada exitosamente. Recibirás una confirmación por email y un recordatorio antes de la cita.
            </ThemedText>

            {/* Detalles de la cita */}
            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Ionicons name="person" size={16} color={PRIMARY_COLOR} />
                <ThemedText style={styles.successDetailText}>
                  {specialist.display_name}
                </ThemedText>
              </View>
              <View style={styles.successDetailRow}>
                <Ionicons name="calendar" size={16} color={PRIMARY_COLOR} />
                <ThemedText style={styles.successDetailText}>
                  {selectedDay === 'today' ? 'Hoy' : 'Mañana'} a las {selectedTime}
                </ThemedText>
              </View>
              <View style={styles.successDetailRow}>
                <Ionicons name="videocam" size={16} color={PRIMARY_COLOR} />
                <ThemedText style={styles.successDetailText}>
                  Consulta Virtual
                </ThemedText>
              </View>
            </View>

            {/* Botón de continuar */}
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.back();
              }}
            >
              <ThemedText style={styles.continueButtonText}>Continuar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
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
    color: 'white',
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  specialistHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  specialistInfo: {
    flex: 1,
  },
  specialistName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 16,
    marginBottom: 2,
  },
  experience: {
    fontSize: 14,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    fontSize: 14,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  priceLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    lineHeight: 22,
  },
  statsContainer: {
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  listItemText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  daySelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  unavailableText: {
    fontSize: 10,
    marginTop: 2,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
  },
  scheduleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY_COLOR + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  specialistSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  specialistSummaryInfo: {
    flex: 1,
  },
  modalSpecialistName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSpecialty: {
    fontSize: 14,
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  modalRatingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  consultationDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY_COLOR + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  priceDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  priceDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.textSecondary + '20',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  successModalContainer: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  successDetails: {
    width: '100%',
    backgroundColor: PRIMARY_COLOR + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  successDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  successDetailText: {
    fontSize: 14,
    marginLeft: 8,
    color: Colors.light.textPrimary,
    fontWeight: '500',
  },
  continueButton: {
    width: '100%',
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 