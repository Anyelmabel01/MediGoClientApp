import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const { width } = Dimensions.get('window');

type ConsultaVirtual = {
  id: string;
  date: string;
  time: string;
  provider_name: string;
  provider_type: string;
  specialty: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  avatar_url?: string;
  start_time?: Date;
  can_join?: boolean;
};

type VirtualSpecialist = {
  id: string;
  display_name: string;
  specialty: string;
  bio: string;
  avatar_url?: string;
  next_availability: string;
  rating: number;
  consultation_fee: number;
  languages: string[];
};

// Definición del tipo Feature
type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  available: boolean;
};

// Mock data for upcoming consultations
const upcomingConsultations: ConsultaVirtual[] = [
  {
    id: '1',
    date: '2024-12-28',
    time: '9:00 AM',
    provider_name: 'Dr. Pedro López',
    provider_type: 'VIRTUAL_SPECIALIST',
    specialty: 'Dermatología',
    status: 'CONFIRMED',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    start_time: new Date(new Date().getTime() + 5 * 60000), // 5 minutes from now
    can_join: true,
  },
  {
    id: '2',
    date: '2024-12-30',
    time: '11:30 AM',
    provider_name: 'Dra. Ana Sánchez',
    provider_type: 'VIRTUAL_SPECIALIST',
    specialty: 'Psicología',
    status: 'PENDING',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    start_time: new Date(new Date().getTime() + 24 * 60 * 60000), // 1 day from now
    can_join: false,
  },
  {
    id: '3',
    date: '2024-12-29',
    time: '2:00 PM',
    provider_name: 'Dr. Roberto Silva',
    provider_type: 'VIRTUAL_SPECIALIST',
    specialty: 'Cardiología',
    status: 'CONFIRMED',
    avatar_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    start_time: new Date(new Date().getTime() + 12 * 60 * 60000), // 12 hours from now
    can_join: false,
  },
  {
    id: '4',
    date: '2024-12-31',
    time: '10:15 AM',
    provider_name: 'Dra. Carmen Torres',
    provider_type: 'VIRTUAL_SPECIALIST',
    specialty: 'Medicina General',
    status: 'CONFIRMED',
    avatar_url: 'https://images.unsplash.com/photo-1594824047323-65b2b4e20c9e?w=150&h=150&fit=crop&crop=face',
    start_time: new Date(new Date().getTime() + 36 * 60 * 60000), // 36 hours from now
    can_join: false,
  },
  {
    id: '5',
    date: '2025-01-02',
    time: '4:30 PM',
    provider_name: 'Dr. Miguel Ramírez',
    provider_type: 'VIRTUAL_SPECIALIST',
    specialty: 'Neurología',
    status: 'CONFIRMED',
    avatar_url: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face',
    start_time: new Date(new Date().getTime() + 60 * 60 * 60000), // 60 hours from now
    can_join: false,
  },
];

// Mock data for featured specialists
const featuredSpecialists: VirtualSpecialist[] = [
  {
    id: '1',
    display_name: 'Dr. Carlos Mendoza',
    specialty: 'Cardiología',
    bio: 'Cardiólogo con 10 años de experiencia en telemedicina',
    avatar_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    next_availability: 'Hoy, 2:00 PM',
    rating: 4.8,
    consultation_fee: 750,
    languages: ['Español', 'Inglés']
  },
  {
    id: '2',
    display_name: 'Dra. María Fernández',
    specialty: 'Medicina General',
    bio: 'Especialista en medicina familiar virtual',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    next_availability: 'Mañana, 10:00 AM',
    rating: 4.9,
    consultation_fee: 600,
    languages: ['Español']
  }
];

// Login color palette
const PRIMARY_COLOR = '#00A0B0';
const PRIMARY_LIGHT = '#33b5c2';
const PRIMARY_DARK = '#006070';
const ACCENT_COLOR = '#70D0E0';

// Beneficios de la telemedicina
const telemedicineBenefits = [
  {
    id: 'access',
    title: 'Acceso desde cualquier lugar',
    description: 'Consulta con especialistas desde la comodidad de tu hogar o mientras viajas.',
    icon: 'location-outline'
  },
  {
    id: 'time',
    title: 'Ahorro de tiempo',
    description: 'Sin traslados ni salas de espera. Tu tiempo es valioso.',
    icon: 'time-outline'
  },
  {
    id: 'prescriptions',
    title: 'Prescripciones digitales',
    description: 'Recibe tus recetas médicas directamente en la app.',
    icon: 'document-text-outline'
  },
  {
    id: 'follow',
    title: 'Seguimiento continuo',
    description: 'Mantén comunicación constante con tu médico para un mejor control.',
    icon: 'analytics-outline'
  },
  {
    id: 'history',
    title: 'Historial integrado',
    description: 'Toda tu información médica en un solo lugar.',
    icon: 'folder-open-outline'
  },
  {
    id: 'privacy',
    title: 'Privacidad garantizada',
    description: 'Comunicación cifrada de extremo a extremo para proteger tus datos.',
    icon: 'shield-checkmark-outline'
  }
];

// Cómo funciona la telemedicina
const howItWorks = [
  {
    step: 1,
    title: 'Elige especialista',
    description: 'Navega por nuestro directorio de médicos certificados y elige al especialista que mejor se adapte a tus necesidades.',
    icon: 'people-outline'
  },
  {
    step: 2,
    title: 'Agenda tu cita',
    description: 'Selecciona fecha y hora que más te convenga según la disponibilidad del médico.',
    icon: 'calendar-outline'
  },
  {
    step: 3,
    title: 'Pago seguro',
    description: 'Realiza el pago de forma segura a través de nuestra plataforma.',
    icon: 'card-outline'
  },
  {
    step: 4,
    title: 'Prepárate para la consulta',
    description: 'Recibe un recordatorio y accede a la sala de espera 5 minutos antes.',
    icon: 'notifications-outline'
  },
  {
    step: 5,
    title: 'Consulta virtual',
    description: 'Conéctate con tu médico vía videollamada de alta calidad.',
    icon: 'videocam-outline'
  },
  {
    step: 6,
    title: 'Seguimiento',
    description: 'Recibe tus recetas, recomendaciones y programa seguimiento si es necesario.',
    icon: 'checkmark-circle-outline'
  }
];

export default function TelemedicinaSelectorScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user, currentLocation, setCurrentLocation } = useUser();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  const handleLocationSelect = (location: any) => {
    setCurrentLocation(location);
  };

  const features: Feature[] = [
    {
      id: 'search',
      title: 'Buscar Especialistas',
      description: 'Encuentra especialistas virtuales por especialidad e idioma',
      icon: 'search',
      route: '/consulta/telemedicina/buscar-especialistas',
      available: true
    },
    {
      id: 'appointments',
      title: 'Mis Consultas Virtuales',
      description: 'Gestiona tus citas de telemedicina programadas',
      icon: 'calendar',
      route: '/consulta/telemedicina/mis-consultas',
      available: true
    },
    {
      id: 'waiting',
      title: 'Sala de Espera Virtual',
      description: 'Prepárate para tu próxima consulta virtual',
      icon: 'hourglass',
      route: '/consulta/telemedicina/sala-espera',
      available: true
    }
  ];

  const benefits = [
    'Consulta desde cualquier lugar',
    'Especialistas certificados',
    'Prescripciones digitales',
    'Historial médico integrado',
    'Chat en tiempo real',
    'Grabación de consulta'
  ];

  const handleFeaturePress = (feature: Feature) => {
    if (!feature.available) {
      return;
    }
    router.push(feature.route as any);
  };

  const handleNewConsultation = () => {
    // TODO: Create virtual specialist search screen
    Alert.alert('Próximamente', 'La búsqueda de especialistas virtuales estará disponible próximamente');
  };

  const handleMyConsultations = () => {
    // TODO: Create telemedicine consultations screen
    Alert.alert('Próximamente', 'El historial de consultas de telemedicina estará disponible próximamente');
  };

  const handleMedicineInfo = () => {
    // TODO: Create medicine information screen
    Alert.alert('Información de Medicamentos', 'Esta función permitirá acceder a información médica y FAQs');
  };

  const handleConsultationDetails = (id: string) => {
    // TODO: Create consultation details screen
    Alert.alert('Detalles de Consulta', `Ver detalles de la consulta ${id}`);
  };

  const handleJoinCall = (consultation: ConsultaVirtual) => {
    if (consultation.can_join) {
      // Redirigir directamente a la sala de espera con parámetros
      router.push({
        pathname: '/consulta/telemedicina/sala-espera',
        params: { 
          consultationId: consultation.id,
          specialistId: consultation.provider_name,
          appointmentTime: consultation.time,
          specialistName: consultation.provider_name,
          specialty: consultation.specialty
        }
      });
    } else {
      Alert.alert(
        'Consulta no disponible',
        'La consulta aún no está disponible para unirse. Por favor, espera hasta la hora programada.'
      );
    }
  };

  const handleSpecialistPress = (specialist: VirtualSpecialist) => {
    // TODO: Create specialist details screen
    Alert.alert('Detalle del Especialista', `Ver perfil de ${specialist.display_name}`);
  };

  const isConsultationStartingSoon = (consultation: ConsultaVirtual): boolean => {
    if (!consultation.start_time) return false;
    
    const now = new Date();
    const timeDiff = consultation.start_time.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    return minutesDiff <= 10 && minutesDiff > 0;
  };

  const getStatusColor = (status: ConsultaVirtual['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return Colors.light.success;
      case 'PENDING':
        return '#f59e0b';
      case 'COMPLETED':
        return Colors.light.primary;
      case 'CANCELLED':
        return Colors.light.error;
      default:
        return Colors.light.textSecondary;
    }
  };

  const getStatusLabel = (status: ConsultaVirtual['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'PENDING':
        return 'Pendiente';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color="#fbbf24" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color="#fbbf24" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={12} color="#fbbf24" />
      );
    }

    return stars;
  };

  const renderConsultation = (consultation: ConsultaVirtual) => (
    <TouchableOpacity 
      key={consultation.id}
      style={[styles.consultationCard, { 
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
      }]}
      onPress={() => handleConsultationDetails(consultation.id)}
      activeOpacity={0.8}
    >
      <View style={styles.consultationHeader}>
        <View style={styles.consultationDoctorInfo}>
          {consultation.avatar_url ? (
            <Image 
              source={{ uri: consultation.avatar_url }} 
              style={styles.doctorAvatar} 
            />
          ) : (
            <View style={[styles.doctorAvatarPlaceholder, { backgroundColor: Colors.light.primary }]}>
              <ThemedText style={styles.doctorAvatarText}>
                {consultation.provider_name.split(' ').map(name => name[0]).join('')}
              </ThemedText>
            </View>
          )}
          
          <View style={styles.doctorInfo}>
            <ThemedText style={styles.doctorName}>{consultation.provider_name}</ThemedText>
            <ThemedText style={styles.doctorSpecialty}>{consultation.specialty}</ThemedText>
          </View>
        </View>
        

      </View>
      
      <View style={styles.consultationDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color={Colors.light.primary} />
          <ThemedText style={styles.detailText}>{consultation.date}</ThemedText>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={Colors.light.primary} />
          <ThemedText style={styles.detailText}>{consultation.time}</ThemedText>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.joinButton, { 
          opacity: consultation.can_join ? 1 : 0.5,
          backgroundColor: consultation.can_join ? Colors.light.primary : 'rgba(0, 160, 176, 0.3)',
        }]}
        onPress={() => handleJoinCall(consultation)}
        disabled={!consultation.can_join}
      >
        <Ionicons name="videocam" size={18} color="white" />
        <ThemedText style={styles.joinButtonText}>
          {consultation.can_join ? 'Unirse ahora' : 'No disponible'}
        </ThemedText>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSpecialist = (specialist: VirtualSpecialist) => (
    <TouchableOpacity 
      key={specialist.id}
      style={[styles.specialistCard, { 
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
      }]}
      onPress={() => handleSpecialistPress(specialist)}
      activeOpacity={0.8}
    >
      {specialist.avatar_url ? (
        <Image 
          source={{ uri: specialist.avatar_url }} 
          style={styles.specialistAvatar} 
        />
      ) : (
        <View style={[styles.specialistAvatarPlaceholder, { backgroundColor: Colors.light.primary }]}>
          <ThemedText style={styles.specialistAvatarText}>
            {specialist.display_name.split(' ').map(name => name[0]).join('')}
          </ThemedText>
        </View>
      )}
      
      <ThemedText style={styles.specialistName}>{specialist.display_name}</ThemedText>
      <ThemedText style={styles.specialistSpecialty}>{specialist.specialty}</ThemedText>
      
      <View style={styles.specialistRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons 
            key={`star-${star}`}
            name={star <= Math.floor(specialist.rating) ? "star" : star <= specialist.rating ? "star-half" : "star-outline"}
            size={16}
            color="#FFB800"
          />
        ))}
        <ThemedText style={styles.ratingText}>{specialist.rating.toFixed(1)}</ThemedText>
      </View>
      
      <ThemedText style={styles.nextAvailability}>
        Próxima disponibilidad: <ThemedText style={styles.nextAvailabilityTime}>{specialist.next_availability}</ThemedText>
      </ThemedText>
      
      <ThemedText style={styles.consultationFee}>
        ${specialist.consultation_fee.toFixed(2)}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header simplificado */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.userInfoContainer}
          onPress={() => setShowUserProfile(true)}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color={Colors.light.primary} />
            </View>
          </View>
          <View style={styles.userDetails}>
            <ThemedText style={styles.greeting}>Telemedicina</ThemedText>
          </View>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Sección de acciones principales */}
        <View style={styles.actionsSection}>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/consulta/telemedicina/buscar-especialistas' as any)}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="search" size={32} color={Colors.light.primary} />
              </View>
              <ThemedText style={styles.actionButtonText}>Buscar especialista</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/consulta/telemedicina/mis-consultas' as any)}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="calendar" size={32} color={Colors.light.primary} />
              </View>
              <ThemedText style={styles.actionButtonText}>Mis consultas</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/consulta/telemedicina/sala-espera' as any)}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="hourglass" size={32} color={Colors.light.primary} />
              </View>
              <ThemedText style={styles.actionButtonText}>Sala de espera</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Sección de próximas consultas */}
        {upcomingConsultations.length > 0 && (
          <View style={styles.upcomingSection}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Próximas consultas</ThemedText>
              <TouchableOpacity onPress={() => router.push('/consulta/telemedicina/mis-consultas' as any)}>
                <ThemedText style={styles.seeAllLink}>Ver todas</ThemedText>
              </TouchableOpacity>
            </View>
            
            {renderConsultation(upcomingConsultations[0])}
          </View>
        )}
        
        {/* Especialistas destacados */}
        <View style={styles.specialistsSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Especialistas destacados</ThemedText>
            <TouchableOpacity onPress={() => router.push('/consulta/telemedicina/buscar-especialistas' as any)}>
              <ThemedText style={styles.seeAllLink}>Ver todos</ThemedText>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialistsContainer}
          >
            {featuredSpecialists.map((specialist) => renderSpecialist(specialist))}
          </ScrollView>
        </View>

        {/* Botones de Beneficios y Cómo funciona al final */}
        <View style={styles.bottomActionsSection}>
          <TouchableOpacity 
            style={styles.bottomActionButton}
            onPress={() => {
              // Navegar a una pantalla de beneficios o mostrar modal
              Alert.alert('Beneficios', 'Acceso desde cualquier lugar, ahorro de tiempo, prescripciones digitales...');
            }}
          >
            <View style={[styles.bottomActionIcon, { backgroundColor: '#10B981' }]}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
            </View>
            <View style={styles.bottomActionContent}>
              <ThemedText style={styles.bottomActionTitle}>Beneficios de Telemedicina</ThemedText>
              <ThemedText style={styles.bottomActionSubtitle}>Conoce todas las ventajas</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.bottomActionButton}
            onPress={() => {
              // Navegar a una pantalla de cómo funciona o mostrar modal
              Alert.alert('Cómo funciona', 'Elige especialista → Agenda → Pago → Consulta virtual');
            }}
          >
            <View style={[styles.bottomActionIcon, { backgroundColor: '#8B5CF6' }]}>
              <Ionicons name="information-circle" size={20} color="white" />
            </View>
            <View style={styles.bottomActionContent}>
              <ThemedText style={styles.bottomActionTitle}>¿Cómo funciona?</ThemedText>
              <ThemedText style={styles.bottomActionSubtitle}>Proceso paso a paso</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 45,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  userDetails: {
    flex: 1,
    marginLeft: 8,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  servicesHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    backgroundColor: 'white',
    gap: 4,
    flex: 1,
    minHeight: 32,
  },
  navButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  navButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.light.primary,
    textAlign: 'center',
  },
  navButtonTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  contentContainer: {
    padding: 12,
    paddingBottom: 24,
  },
  tabContent: {
    flex: 1,
  },
  actionsSection: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.text,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    color: Colors.light.text,
  },
  actionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  consultationsSection: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  consultationCard: {
    backgroundColor: '#F8FBFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  consultationStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 60,
  },
  consultationDoctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 160, 176, 0.2)',
  },
  doctorAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
  },
  doctorAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    color: Colors.light.text,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  consultationDetails: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 6,
    backgroundColor: Colors.light.primary,
  },
  joinButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  specialistsSection: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllLink: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  specialistsContainer: {
    paddingBottom: 8,
    gap: 12,
  },
  specialistCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 12,
    width: 160,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  specialistAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(0, 160, 176, 0.15)',
  },
  specialistAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: Colors.light.primary,
  },
  specialistAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  specialistName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
    color: Colors.light.text,
  },
  specialistSpecialty: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 6,
  },
  specialistRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: '#FFB800',
  },
  nextAvailability: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.light.textSecondary,
  },
  nextAvailabilityTime: {
    fontWeight: '600',
    color: Colors.light.text,
  },
  consultationFee: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  // Estilos para sección de beneficios
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  benefitCard: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
  },
  benefitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
  },
  benefitCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: Colors.light.text,
  },
  benefitCardDescription: {
    fontSize: 11,
    textAlign: 'center',
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  // Estilos para sección de funcionamiento
  howItWorksContainer: {
    gap: 12,
  },
  stepCardCompact: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
  },
  stepCardContent: {
    flex: 1,
  },
  stepCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.light.text,
  },
  stepCardDescription: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  upcomingSection: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bottomActionsSection: {
    marginTop: 16,
    gap: 12,
  },
  bottomActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 8,
  },
  bottomActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bottomActionContent: {
    flex: 1,
  },
  bottomActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 2,
  },
  bottomActionSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});


