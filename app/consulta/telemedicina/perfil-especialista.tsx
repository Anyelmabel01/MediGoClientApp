import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';

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
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>('today');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const specialist = mockSpecialists[specialistId as string];

  if (!specialist) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Perfil del Especialista</ThemedText>
          <View style={styles.headerSpacer} />
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

    const dayText = selectedDay === 'today' ? 'Hoy' : 'Mañana';
    Alert.alert(
      'Confirmar Consulta',
      `¿Deseas agendar una consulta con ${specialist.display_name} para ${dayText} a las ${selectedTime}?\n\nCosto: $${specialist.consultation_fee}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            Alert.alert('¡Consulta Agendada!', 'Tu consulta ha sido agendada exitosamente. Recibirás una confirmación por email.');
            router.back();
          }
        }
      ]
    );
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
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Perfil del Especialista</ThemedText>
        <View style={styles.headerSpacer} />
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
}); 