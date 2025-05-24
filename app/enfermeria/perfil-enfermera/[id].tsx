import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Dimensions, FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={[styles.reviewCard, {
      backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
      borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
    }]}>
      <View style={styles.reviewHeader}>
        <ThemedText style={styles.reviewerName} numberOfLines={1}>{item.patientName}</ThemedText>
        <View style={styles.reviewRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name="star"
              size={14}
              color={star <= item.rating ? '#FFD700' : (isDarkMode ? Colors.dark.border : Colors.light.border)}
            />
          ))}
        </View>
      </View>
      <ThemedText style={[styles.reviewService, {
        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
      }]} numberOfLines={1}>{item.service}</ThemedText>
      <ThemedText style={[styles.reviewComment, {
        color: isDarkMode ? Colors.dark.text : Colors.light.text
      }]} numberOfLines={3}>{item.comment}</ThemedText>
      <ThemedText style={[styles.reviewDate, {
        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
      }]}>{item.date}</ThemedText>
    </View>
  );

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
          }]}>{nurse.description}</ThemedText>
        </View>

        {/* Specialties */}
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
        </View>

        {/* Certifications */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Certificaciones</ThemedText>
          {nurse.certifications.map((cert, index) => (
            <View key={index} style={styles.certificationItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.light.success} style={styles.certificationIcon} />
              <ThemedText style={[styles.certificationText, {
                color: isDarkMode ? Colors.dark.text : Colors.light.text
              }]} numberOfLines={2}>{cert}</ThemedText>
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
            }]}>Horarios disponibles para {selectedDay.dayName}</ThemedText>
            <View style={styles.timeSlotsGrid}>
              {selectedDay.timeSlots.map(renderTimeSlot)}
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>Reseñas de pacientes</ThemedText>
          <FlatList
            data={nurse.reviews}
            renderItem={renderReviewItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
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
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: Math.min(20, SCREEN_WIDTH * 0.05),
    fontWeight: 'bold',
    marginLeft: 16,
    flex: 1,
  },
  nurseInfoCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  nursePhoto: {
    width: Math.min(100, SCREEN_WIDTH * 0.25),
    height: Math.min(100, SCREEN_WIDTH * 0.25),
    borderRadius: Math.min(50, SCREEN_WIDTH * 0.125),
    marginRight: 16,
  },
  nurseDetails: {
    flex: 1,
  },
  nurseName: {
    fontSize: Math.min(20, SCREEN_WIDTH * 0.05),
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 24,
  },
  experience: {
    fontSize: 14,
    marginBottom: 12,
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
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviewsCount: {
    fontSize: 14,
    marginLeft: 4,
    flexShrink: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: SCREEN_WIDTH * 0.4,
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  certificationIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  certificationText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
  daysContainer: {
    marginBottom: 16,
  },
  daysContent: {
    paddingRight: 16,
  },
  dayButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    minWidth: Math.max(70, SCREEN_WIDTH * 0.18),
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeSlotsContainer: {
    marginTop: 8,
  },
  selectedDayTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: Math.max(80, SCREEN_WIDTH * 0.2),
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewService: {
    fontSize: 14,
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
  },
  bookingSection: {
    padding: 16,
    borderTopWidth: 1,
  },
  selectedTimeInfo: {
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedTimeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bookButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 