import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Review = {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
};

type TimeSlot = {
  time: string;
  available: boolean;
};

type AvailabilityDay = {
  date: string;
  dayName: string;
  dayNumber: number;
  timeSlots: TimeSlot[];
};

const nurseData = {
  '1': {
    id: '1',
    name: 'Ana María González',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    experience: 8,
    specialties: ['Geriatría', 'Cuidados intensivos', 'Heridas'],
    rating: 4.9,
    reviewsCount: 127,
    isAvailable: true,
    baseRate: 350,
    description: 'Enfermera profesional con amplia experiencia en cuidados geriátricos y manejo de heridas complejas. Me especializo en brindar atención personalizada y compasiva en el hogar.',
    certifications: ['Licenciada en Enfermería', 'Especialista en Geriatría', 'Certificación en Cuidados Paliativos'],
    reviews: [
      {
        id: '1',
        patientName: 'María José',
        rating: 5,
        comment: 'Excelente profesional, muy cuidadosa y amable. Mi madre se sintió muy cómoda con su atención.',
        date: '2024-01-15',
        service: 'Cuidado de adulto mayor'
      },
      {
        id: '2',
        patientName: 'Carlos R.',
        rating: 5,
        comment: 'Muy profesional en el manejo de heridas. Excelente técnica y muy puntual.',
        date: '2024-01-10',
        service: 'Curación de heridas'
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Carlos Rodríguez',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    experience: 12,
    specialties: ['Administración de medicamentos', 'Rehabilitación'],
    rating: 4.8,
    reviewsCount: 203,
    isAvailable: false,
    baseRate: 400,
    description: 'Enfermero especializado en administración de medicamentos y procesos de rehabilitación. Con más de 12 años de experiencia, me enfoco en la recuperación integral del paciente.',
    certifications: ['Licenciado en Enfermería', 'Certificación en Farmacología Clínica', 'Especialista en Rehabilitación'],
    reviews: [
      {
        id: '1',
        patientName: 'Ana Lucía',
        rating: 5,
        comment: 'Muy profesional en la administración de medicamentos. Explica todo claramente.',
        date: '2024-01-12',
        service: 'Administración de medicamentos'
      },
      {
        id: '2',
        patientName: 'Roberto M.',
        rating: 4,
        comment: 'Excelente en terapia de rehabilitación. Muy paciente y dedicado.',
        date: '2024-01-08',
        service: 'Sesión de rehabilitación'
      }
    ]
  },
  '3': {
    id: '3',
    name: 'María Fernanda López',
    photo: 'https://images.unsplash.com/photo-1594824047323-65b2b4e20c9e?w=300&h=300&fit=crop&crop=face',
    experience: 5,
    specialties: ['Pediatría', 'Vacunación', 'Cuidados domiciliarios'],
    rating: 4.7,
    reviewsCount: 89,
    isAvailable: true,
    baseRate: 300,
    description: 'Enfermera pediátrica con experiencia en cuidados infantiles y programas de vacunación. Me apasiona trabajar con niños y brindar tranquilidad a las familias.',
    certifications: ['Licenciada en Enfermería', 'Especialista en Pediatría', 'Certificación en Vacunación'],
    reviews: [
      {
        id: '1',
        patientName: 'Carmen S.',
        rating: 5,
        comment: 'Excelente con los niños, muy cariñosa y profesional. Mi hijo la adora.',
        date: '2024-01-14',
        service: 'Cuidado pediátrico'
      },
      {
        id: '2',
        patientName: 'Luis F.',
        rating: 4,
        comment: 'Muy eficiente en la aplicación de vacunas. Los niños no lloran con ella.',
        date: '2024-01-09',
        service: 'Vacunación infantil'
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Roberto Hernández',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    experience: 15,
    specialties: ['Cardiología', 'Diabetes', 'Hipertensión'],
    rating: 4.9,
    reviewsCount: 156,
    isAvailable: true,
    baseRate: 450,
    description: 'Enfermero especializado en cuidados cardiovasculares y manejo de enfermedades crónicas. Con 15 años de experiencia, me especializo en el monitoreo y control de pacientes con diabetes e hipertensión.',
    certifications: ['Licenciado en Enfermería', 'Especialista en Cardiología', 'Certificación en Diabetes', 'Especialista en Hipertensión'],
    reviews: [
      {
        id: '1',
        patientName: 'Elena R.',
        rating: 5,
        comment: 'Excelente en el monitoreo de presión arterial. Muy conocedor y confiable.',
        date: '2024-01-13',
        service: 'Control de hipertensión'
      },
      {
        id: '2',
        patientName: 'Manuel J.',
        rating: 5,
        comment: 'Increíble manejo de pacientes diabéticos. Muy educativo y profesional.',
        date: '2024-01-11',
        service: 'Control de diabetes'
      }
    ]
  }
  // More nurse data can be added here
};

const availabilityData: AvailabilityDay[] = [
  {
    date: '2024-01-20',
    dayName: 'Hoy',
    dayNumber: 20,
    timeSlots: [
      { time: '09:00', available: true },
      { time: '10:00', available: false },
      { time: '11:00', available: true },
      { time: '14:00', available: true },
      { time: '15:00', available: false },
      { time: '16:00', available: true },
    ]
  },
  {
    date: '2024-01-21',
    dayName: 'Mañana',
    dayNumber: 21,
    timeSlots: [
      { time: '08:00', available: true },
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '14:00', available: false },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
    ]
  },
  {
    date: '2024-01-22',
    dayName: 'Lun',
    dayNumber: 22,
    timeSlots: [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: false },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: false },
    ]
  }
];

export default function PerfilEnfermeraScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState(availabilityData[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const nurse = nurseData[id as keyof typeof nurseData];

  if (!nurse) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Perfil no encontrado</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const handleBookService = () => {
    if (selectedTimeSlot) {
      router.push({
        pathname: '/enfermeria/agendar-servicio',
        params: {
          nurseId: nurse.id,
          nurseName: nurse.name,
          date: selectedDay.date,
          time: selectedTimeSlot,
          rate: nurse.baseRate.toString()
        }
      } as any);
    }
  };

  const renderTimeSlot = (slot: TimeSlot) => (
    <TouchableOpacity
      key={slot.time}
      style={[
        styles.timeSlot,
        {
          backgroundColor: selectedTimeSlot === slot.time 
            ? Colors.light.primary 
            : slot.available 
              ? (isDarkMode ? Colors.dark.border : Colors.light.border)
              : (isDarkMode ? Colors.dark.background : '#F5F5F5'),
          borderColor: selectedTimeSlot === slot.time 
            ? Colors.light.primary 
            : slot.available 
              ? (isDarkMode ? Colors.dark.border : Colors.light.border)
              : (isDarkMode ? Colors.dark.border : '#E0E0E0'),
          opacity: slot.available ? 1 : 0.5
        }
      ]}
      onPress={() => slot.available && setSelectedTimeSlot(slot.time)}
      disabled={!slot.available}
    >
      <ThemedText style={[
        styles.timeSlotText,
        {
          color: selectedTimeSlot === slot.time 
            ? 'white' 
            : slot.available 
              ? (isDarkMode ? Colors.dark.text : Colors.light.text)
              : (isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary)
        }
      ]}>
        {slot.time}
      </ThemedText>
    </TouchableOpacity>
  );

  const renderDayButton = (day: AvailabilityDay) => (
    <TouchableOpacity
      key={day.date}
      style={[
        styles.dayButton,
        {
          backgroundColor: selectedDay.date === day.date 
            ? Colors.light.primary 
            : (isDarkMode ? Colors.dark.border : Colors.light.border),
          borderColor: selectedDay.date === day.date 
            ? Colors.light.primary 
            : (isDarkMode ? Colors.dark.border : Colors.light.border),
        }
      ]}
      onPress={() => {
        setSelectedDay(day);
        setSelectedTimeSlot(null);
      }}
    >
      <ThemedText style={[
        styles.dayButtonText,
        {
          color: selectedDay.date === day.date 
            ? 'white' 
            : (isDarkMode ? Colors.dark.text : Colors.light.text)
        }
      ]} numberOfLines={1}>
        {day.dayName}
      </ThemedText>
      <ThemedText style={[
        styles.dayNumber,
        {
          color: selectedDay.date === day.date 
            ? 'white' 
            : (isDarkMode ? Colors.dark.text : Colors.light.text)
        }
      ]}>
        {day.dayNumber}
      </ThemedText>
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
        <ThemedText style={styles.title} numberOfLines={1}>Perfil de Enfermera</ThemedText>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Nurse Info Section */}
        <View style={[styles.nurseInfoCard, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <Image source={{ uri: nurse.photo }} style={styles.nursePhoto} />
          <View style={styles.nurseDetails}>
            <ThemedText style={styles.nurseName} numberOfLines={2}>{nurse.name}</ThemedText>
            <ThemedText style={[styles.experience, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>{nurse.experience} años de experiencia</ThemedText>
            
            <View style={styles.ratingContainer}>
              <View style={styles.rating}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <ThemedText style={styles.ratingText}>{nurse.rating}</ThemedText>
                <ThemedText style={[styles.reviewsCount, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]} numberOfLines={1}>({nurse.reviewsCount} reseñas)</ThemedText>
              </View>
              <ThemedText style={[styles.price, { color: Colors.light.primary }]}>
                ${nurse.baseRate}/hora
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Sobre mí</ThemedText>
          <ThemedText style={[styles.description, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]} numberOfLines={3}>{nurse.description}</ThemedText>
        </View>

        {/* Specialties & Certifications Combined */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Especialidades</ThemedText>
          <View style={styles.specialtiesGrid}>
            {nurse.specialties.map((specialty, index) => (
              <View key={index} style={[styles.specialtyTag, {
                backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.15)' : 'rgba(45, 127, 249, 0.1)'
              }]}>
                <ThemedText style={[styles.specialtyText, { color: Colors.light.primary }]} numberOfLines={1}>
                  {specialty}
                </ThemedText>
              </View>
            ))}
          </View>
          
          <ThemedText style={[styles.sectionTitle, { marginTop: 12, marginBottom: 8 }]}>Certificaciones</ThemedText>
          {nurse.certifications.slice(0, 2).map((cert, index) => (
            <View key={index} style={styles.certificationItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.light.success} style={styles.certificationIcon} />
              <ThemedText style={[styles.certificationText, {
                color: isDarkMode ? Colors.dark.text : Colors.light.text
              }]} numberOfLines={2}>{cert}</ThemedText>
            </View>
          ))}
          {nurse.certifications.length > 2 && (
            <ThemedText style={[styles.moreCertifications, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              +{nurse.certifications.length - 2} certificaciones más
            </ThemedText>
          )}
        </View>

        {/* Availability Calendar */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Disponibilidad</ThemedText>
          
          {/* Day Selector */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.daysContainer}
            contentContainerStyle={styles.daysContent}
          >
            {availabilityData.map(renderDayButton)}
          </ScrollView>

          {/* Time Slots */}
          <View style={styles.timeSlotsContainer}>
            <ThemedText style={[styles.selectedDayTitle, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]} numberOfLines={1}>Horarios para {selectedDay.dayName}</ThemedText>
            <View style={styles.timeSlotsGrid}>
              {selectedDay.timeSlots.map(renderTimeSlot)}
            </View>
          </View>
        </View>

        {/* Reviews - Limited to 2 */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <View style={styles.reviewsHeader}>
            <ThemedText style={styles.sectionTitle}>Reseñas</ThemedText>
            <ThemedText style={[styles.reviewsCount, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              {nurse.reviewsCount} total
            </ThemedText>
          </View>
          {nurse.reviews.slice(0, 2).map((review) => (
            <View key={review.id} style={[styles.reviewCard, {
              backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
              borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
            }]}>
              <View style={styles.reviewHeader}>
                <ThemedText style={styles.reviewerName} numberOfLines={1}>{review.patientName}</ThemedText>
                <View style={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name="star"
                      size={12}
                      color={star <= review.rating ? '#FFD700' : (isDarkMode ? Colors.dark.border : Colors.light.border)}
                    />
                  ))}
                </View>
              </View>
              <ThemedText style={[styles.reviewComment, {
                color: isDarkMode ? Colors.dark.text : Colors.light.text
              }]} numberOfLines={2}>{review.comment}</ThemedText>
              <ThemedText style={[styles.reviewDate, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>{review.date}</ThemedText>
            </View>
          ))}
          {nurse.reviews.length > 2 && (
            <TouchableOpacity style={styles.moreReviewsButton}>
              <ThemedText style={[styles.moreReviewsText, { color: Colors.light.primary }]}>
                Ver todas las reseñas
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Book Service Button - Now at bottom without absolute positioning */}
      <View style={[styles.bookingSection, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderTopColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        paddingBottom: insets.bottom,
      }]}>
        {selectedTimeSlot && (
          <View style={styles.selectedTimeInfo}>
            <ThemedText style={[styles.selectedTimeText, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]} numberOfLines={1}>
              {selectedDay.dayName} a las {selectedTimeSlot}
            </ThemedText>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.bookButton,
            {
              backgroundColor: selectedTimeSlot ? Colors.light.primary : (isDarkMode ? Colors.dark.border : Colors.light.border),
              opacity: selectedTimeSlot ? 1 : 0.5
            }
          ]}
          onPress={handleBookService}
          disabled={!selectedTimeSlot}
        >
          <ThemedText style={styles.bookButtonText} numberOfLines={1}>
            {selectedTimeSlot ? 'Agendar Servicio' : 'Selecciona un horario'}
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
    paddingVertical: 12,
  },
  backButton: {
    padding: 6,
    borderRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
  nurseInfoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  nursePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  nurseDetails: {
    flex: 1,
  },
  nurseName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 3,
    lineHeight: 20,
  },
  experience: {
    fontSize: 13,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  reviewsCount: {
    fontSize: 13,
    marginLeft: 3,
    flexShrink: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  specialtyTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    maxWidth: SCREEN_WIDTH * 0.35,
  },
  specialtyText: {
    fontSize: 13,
    fontWeight: '500',
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  certificationIcon: {
    marginTop: 1,
    flexShrink: 0,
  },
  certificationText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  moreCertifications: {
    fontSize: 13,
    fontWeight: '500',
  },
  daysContainer: {
    marginBottom: 12,
  },
  daysContent: {
    paddingRight: 16,
  },
  dayButton: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    minWidth: 60,
  },
  dayButtonText: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeSlotsContainer: {
    marginTop: 6,
  },
  selectedDayTitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timeSlot: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 70,
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '500',
  },
  reviewCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 6,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewService: {
    fontSize: 13,
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 6,
  },
  reviewDate: {
    fontSize: 11,
  },
  bookingSection: {
    padding: 12,
    borderTopWidth: 1,
  },
  selectedTimeInfo: {
    marginBottom: 8,
    alignItems: 'center',
  },
  selectedTimeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  bookButton: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moreReviewsButton: {
    padding: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  moreReviewsText: {
    fontSize: 13,
    fontWeight: '500',
  },
}); 