import { ThemedView } from '@/components/ThemedView';
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
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Unified design imports

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

type ProviderType = 'GENERAL_DOCTOR' | 'CARDIOLOGIST' | 'DERMATOLOGIST' | 'PEDIATRICIAN' | 'NEUROLOGIST' | 'PSYCHIATRIST';

type Provider = {
  id: string;
  display_name: string;
  provider_type: ProviderType;
  organization_name?: string;
  avatar_url?: string;
  license_number: string;
  bio: string;
  rating: number;
  total_reviews: number;
  consultation_fee: number;
  location: string;
  phone: string;
  email: string;
  years_experience: number;
  education: string[];
  specializations: string[];
  languages: string[];
  next_availability: string;
  certifications: string[];
  hospital_affiliations: string[];
  total_consultations: number;
  response_time: string;
  available_today: boolean;
  next_available_slot: string;
  is_available_telemedicine: boolean;
  is_available_office: boolean;
  specialty: string;
};

type Review = {
  id: string;
  patient_name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
};

type TimeSlot = {
  time: string;
  available: boolean;
};

const providerTypeLabels: Record<ProviderType, string> = {
  'GENERAL_DOCTOR': 'Médico General',
  'CARDIOLOGIST': 'Cardiólogo',
  'DERMATOLOGIST': 'Dermatólogo',
  'PEDIATRICIAN': 'Pediatra',
  'NEUROLOGIST': 'Neurólogo',
  'PSYCHIATRIST': 'Psiquiatra'
};

// Mock data
const mockProviders: Record<string, Provider> = {
  '1': {
    id: '1',
    display_name: 'Dr. Carlos Mendoza',
    provider_type: 'CARDIOLOGIST',
    organization_name: 'Hospital San Rafael',
    avatar_url: 'https://i.pravatar.cc/200?img=52',
    license_number: 'MD-12345',
    bio: 'Cardiólogo con más de 15 años de experiencia especializado en cardiología preventiva y tratamiento de enfermedades cardiovasculares complejas.',
    rating: 4.8,
    total_reviews: 127,
    specialty: 'Cardiología',
    years_experience: 15,
    consultation_fee: 150,
    is_available_telemedicine: true,
    is_available_office: true,
    location: 'Santa Cruz, Bolivia',
    available_today: true,
    next_available_slot: '2024-01-15 14:30',
    certifications: ['Cardiólogo Clínico', 'Especialista en Ecocardiografía'],
    hospital_affiliations: ['Hospital San Rafael', 'Clínica Foianini']
  },
  '2': {
    id: '2',
    display_name: 'Dra. Maria Elena Vargas',
    provider_type: 'GENERAL_DOCTOR',
    organization_name: 'Centro Médico Boliviano',
    avatar_url: 'https://i.pravatar.cc/200?img=49',
    license_number: 'MD-67890',
    bio: 'Médico general con enfoque en medicina familiar y preventiva. Especializada en atención integral de pacientes de todas las edades.',
    rating: 4.9,
    total_reviews: 89,
    specialty: 'Medicina General',
    years_experience: 12,
    consultation_fee: 80,
    is_available_telemedicine: true,
    is_available_office: true,
    location: 'La Paz, Bolivia',
    available_today: false,
    next_available_slot: '2024-01-16 09:00',
    certifications: ['Medicina General', 'Medicina Familiar'],
    hospital_affiliations: ['Centro Médico Boliviano', 'Hospital del Niño']
  },
  '3': {
    id: '3',
    display_name: 'Dr. Roberto Quiroga',
    provider_type: 'DERMATOLOGIST',
    organization_name: 'Dermatología Integral',
    avatar_url: 'https://i.pravatar.cc/200?img=33',
    license_number: 'MD-54321',
    bio: 'Dermatólogo especializado en dermatología cosmética y cirugía dermatológica. Tratamiento de enfermedades de la piel y procedimientos estéticos.',
    rating: 4.7,
    total_reviews: 156,
    specialty: 'Dermatología',
    years_experience: 18,
    consultation_fee: 120,
    is_available_telemedicine: false,
    is_available_office: true,
    location: 'Cochabamba, Bolivia',
    available_today: true,
    next_available_slot: '2024-01-15 16:00',
    certifications: ['Dermatología Clínica', 'Cirugía Dermatológica'],
    hospital_affiliations: ['Dermatología Integral', 'Hospital Viedma']
  },
  '4': {
    id: '4',
    display_name: 'Dra. Ana Lucia Mamani',
    provider_type: 'PEDIATRICIAN',
    organization_name: 'Hospital del Niño Dr. Ovidio Aliaga Uría',
    avatar_url: 'https://i.pravatar.cc/200?img=44',
    license_number: 'MD-98765',
    bio: 'Pediatra especializada en neonatología y cuidados intensivos pediátricos. Amplia experiencia en el tratamiento de enfermedades infantiles.',
    rating: 4.9,
    total_reviews: 203,
    specialty: 'Pediatría',
    years_experience: 20,
    consultation_fee: 100,
    is_available_telemedicine: true,
    is_available_office: true,
    location: 'La Paz, Bolivia',
    available_today: true,
    next_available_slot: '2024-01-15 11:30',
    certifications: ['Pediatría General', 'Neonatología'],
    hospital_affiliations: ['Hospital del Niño Dr. Ovidio Aliaga Uría', 'Clínica del Sur']
  }
};

const mockReviews: Review[] = [
  {
    id: '1',
    patient_name: 'Ana M.',
    rating: 5,
    comment: 'Excelente doctora, muy profesional y empática. Explicó todo detalladamente y me dio mucha confianza.',
    date: '2024-12-20',
    verified: true
  },
  {
    id: '2',
    patient_name: 'Roberto S.',
    rating: 5,
    comment: 'La mejor cardióloga que he visitado. Muy thorough en sus diagnósticos y siempre disponible para dudas.',
    date: '2024-12-18',
    verified: true
  },
  {
    id: '3',
    patient_name: 'Carmen L.',
    rating: 4,
    comment: 'Muy buena atención, aunque el tiempo de espera fue un poco largo. La doctora es muy conocedora.',
    date: '2024-12-15',
    verified: true
  },
  {
    id: '4',
    patient_name: 'José R.',
    rating: 5,
    comment: 'Excelente profesional, muy atento y dedicado. Resolvió todas mis dudas con paciencia.',
    date: '2024-12-12',
    verified: true
  },
  {
    id: '5',
    patient_name: 'María F.',
    rating: 4,
    comment: 'Muy buena atención, instalaciones limpias y modernas. Lo recomiendo ampliamente.',
    date: '2024-12-10',
    verified: false
  },
  {
    id: '6',
    patient_name: 'Pedro L.',
    rating: 5,
    comment: 'Doctor muy profesional y humano. Se toma el tiempo necesario para explicar cada procedimiento.',
    date: '2024-12-08',
    verified: true
  },
  {
    id: '7',
    patient_name: 'Sofía G.',
    rating: 4,
    comment: 'Buena experiencia en general, aunque me gustaría que tuviera más horarios disponibles.',
    date: '2024-12-05',
    verified: true
  },
  {
    id: '8',
    patient_name: 'Diego M.',
    rating: 5,
    comment: 'Increíble profesional, muy actualizado en las últimas técnicas. Totalmente recomendado.',
    date: '2024-12-01',
    verified: true
  }
];

const todaySlots: TimeSlot[] = [
  { time: '09:00 AM', available: false },
  { time: '09:30 AM', available: false },
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '11:30 AM', available: true },
  { time: '12:00 PM', available: false },
  { time: '02:00 PM', available: true },
  { time: '02:30 PM', available: true },
  { time: '03:00 PM', available: false },
  { time: '03:30 PM', available: true },
  { time: '04:00 PM', available: true }
];

const tomorrowSlots: TimeSlot[] = [
  { time: '08:00 AM', available: true },
  { time: '08:30 AM', available: true },
  { time: '09:00 AM', available: false },
  { time: '09:30 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '11:30 AM', available: true },
  { time: '02:00 PM', available: true },
  { time: '02:30 PM', available: false },
  { time: '03:00 PM', available: true },
  { time: '03:30 PM', available: true }
];

export default function PerfilProveedorScreen() {
  const router = useRouter();
  const { providerId } = useLocalSearchParams();
  
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>('today');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showAllReviews, setShowAllReviews] = useState(false);

  const provider = mockProviders[providerId as string];

  if (!provider) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Perfil del doctor</Text>
          
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

  const currentSlots = selectedDay === 'today' ? todaySlots : tomorrowSlots;
  const availableSlots = currentSlots.filter(slot => slot.available);

  const handleScheduleAppointment = () => {
    if (!selectedTime) {
      Alert.alert('Selecciona un horario', 'Por favor selecciona un horario disponible para agendar tu cita.');
      return;
    }

    router.push({
      pathname: '/consulta/consultorio/agendar-cita',
      params: { 
        providerId: provider.id,
        selectedDate: selectedDay,
        selectedTime: selectedTime
      }
    });
  };

  const handleViewAllReviews = () => {
    setShowAllReviews(true);
  };

  const renderStarRating = (rating: number, size: number = 16) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={size} color="#fbbf24" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={size} color="#fbbf24" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={size} color="#fbbf24" />
      );
    }

    return stars;
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Perfil del doctor</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Provider Header */}
        <View style={styles.section}>
          <View style={styles.providerHeader}>
            <Image 
              source={{ uri: provider.avatar_url || 'https://via.placeholder.com/100' }}
              style={styles.avatar}
            />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{provider.display_name}</Text>
              <Text style={styles.providerType}>
                {providerTypeLabels[provider.provider_type]}
              </Text>
              {provider.organization_name && (
                <Text style={styles.organizationName}>
                  {provider.organization_name}
                </Text>
              )}
              <Text style={styles.experience}>
                {provider.years_experience} años de experiencia
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                Bs. {provider.consultation_fee.toLocaleString()}
              </Text>
              <Text style={styles.priceLabel}>
                por consulta
              </Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {renderStarRating(provider.rating, 18)}
            </View>
            <Text style={styles.ratingText}>
              {provider.rating} ({provider.total_reviews} reseñas)
            </Text>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={16} color={COLORS.primary} />
              <Text style={styles.contactText}>
                {provider.location}
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={16} color={COLORS.primary} />
              <Text style={styles.contactText}>
                {provider.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca del Doctor</Text>
          <Text style={styles.bioText}>
            {provider.bio}
          </Text>
        </View>

        {/* Education & Specializations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Formación y Especialidades</Text>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Educación:</Text>
            {provider.education.map((edu, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="school-outline" size={16} color={COLORS.primary} />
                <Text style={styles.listItemText}>
                  {edu}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Especialidades:</Text>
            <View style={styles.tagsContainer}>
              {provider.specializations.map((spec, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>
                    {spec}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Idiomas:</Text>
            <View style={styles.tagsContainer}>
              {provider.languages.map((lang, index) => (
                <View key={index} style={styles.languageTag}>
                  <Text style={styles.languageTagText}>
                    {lang}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Availability Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponibilidad</Text>
          
          {/* Day Selector */}
          <View style={styles.daySelector}>
            <TouchableOpacity
              style={[
                styles.dayButton,
                selectedDay === 'today' && styles.selectedDayButton
              ]}
              onPress={() => {
                setSelectedDay('today');
                setSelectedTime('');
              }}
            >
              <Text style={[
                styles.dayButtonText,
                { color: selectedDay === 'today' ? COLORS.white : COLORS.primary }
              ]}>
                Hoy
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.dayButton,
                selectedDay === 'tomorrow' && styles.selectedDayButton
              ]}
              onPress={() => {
                setSelectedDay('tomorrow');
                setSelectedTime('');
              }}
            >
              <Text style={[
                styles.dayButtonText,
                { color: selectedDay === 'tomorrow' ? COLORS.white : COLORS.primary }
              ]}>
                Mañana
              </Text>
            </TouchableOpacity>
          </View>

          {/* Time Slots */}
          <View style={styles.timeSlotsContainer}>
            <Text style={styles.subsectionTitle}>
              Horarios disponibles:
            </Text>
            
            {availableSlots.length > 0 ? (
              <View style={styles.timeSlots}>
                {availableSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.time}
                    style={[
                      styles.timeSlot,
                      selectedTime === slot.time && styles.selectedTimeSlot
                    ]}
                    onPress={() => setSelectedTime(slot.time)}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      { color: selectedTime === slot.time ? COLORS.white : COLORS.textPrimary }
                    ]}>
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.noSlotsText}>
                No hay horarios disponibles para {selectedDay === 'today' ? 'hoy' : 'mañana'}
              </Text>
            )}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reseñas de Pacientes</Text>
          
          {mockReviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>{review.patient_name}</Text>
                  {review.verified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
                      <Text style={styles.verifiedText}>Verificado</Text>
                    </View>
                  )}
                </View>
                <View style={styles.reviewRating}>
                  {renderStarRating(review.rating, 14)}
                </View>
              </View>
              <Text style={styles.reviewComment}>
                {review.comment}
              </Text>
              <Text style={styles.reviewDate}>
                {new Date(review.date).toLocaleDateString('es-ES')}
              </Text>
            </View>
          ))}
          
          <TouchableOpacity style={styles.viewAllReviews} onPress={handleViewAllReviews}>
            <Text style={styles.viewAllReviewsText}>
              Ver todas las reseñas ({provider.total_reviews})
            </Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de todas las reseñas */}
      <Modal
        visible={showAllReviews}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Todas las reseñas ({mockReviews.length})
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAllReviews(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {mockReviews.map((review) => (
              <View key={review.id} style={styles.modalReviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{review.patient_name}</Text>
                    {review.verified && (
                      <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
                        <Text style={styles.verifiedText}>Verificado</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.reviewRating}>
                    {renderStarRating(review.rating, 14)}
                  </View>
                </View>
                <Text style={styles.reviewComment}>
                  {review.comment}
                </Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.date).toLocaleDateString('es-ES')}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Schedule Button */}
      <View style={styles.scheduleContainer}>
        <TouchableOpacity 
          style={[
            styles.scheduleButton,
            { 
              backgroundColor: selectedTime ? COLORS.primary : COLORS.textSecondary,
              opacity: selectedTime ? 1 : 0.6
            }
          ]}
          onPress={handleScheduleAppointment}
          disabled={!selectedTime}
        >
          <Ionicons name="calendar" size={20} color="white" />
          <Text style={styles.scheduleButtonText}>
            {selectedTime ? `Agendar para ${selectedTime}` : 'Selecciona un horario'}
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginHorizontal: 16,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerHeader: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  providerInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  providerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    color: COLORS.textPrimary,
  },
  providerType: {
    fontSize: 16,
    marginBottom: 4,
    color: COLORS.textSecondary,
  },
  organizationName: {
    fontSize: 14,
    marginBottom: 4,
    color: COLORS.textSecondary,
  },
  experience: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 8,
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  contactInfo: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.textPrimary,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  listItemText: {
    fontSize: 14,
    flex: 1,
    color: COLORS.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '20',
  },
  languageTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.success + '20',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  languageTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  daySelector: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: COLORS.cardBg,
    padding: 4,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: COLORS.primary,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeSlotsContainer: {
    marginTop: 8,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
  },
  selectedTimeSlot: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noSlotsText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
    color: COLORS.textSecondary,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  verifiedText: {
    fontSize: 10,
    color: COLORS.success,
    fontWeight: '600',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    color: COLORS.textSecondary,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  viewAllReviews: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 8,
  },
  viewAllReviewsText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  scheduleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    backgroundColor: COLORS.primary,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalReviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
}); 