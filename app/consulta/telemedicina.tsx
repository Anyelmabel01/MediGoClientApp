import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('inicio');

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

  // Renderizado de diferentes tabs
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'beneficios':
        return (
          <View style={styles.tabContent}>
            <View style={styles.benefitsGrid}>
              {telemedicineBenefits.map((benefit, index) => (
                <View key={benefit.id} style={styles.benefitCard}>
                  <View style={[styles.benefitIconContainer, { backgroundColor: Colors.light.primary }]}>
                    <Ionicons name={benefit.icon as any} size={24} color="white" />
                  </View>
                  <ThemedText style={styles.benefitCardTitle}>{benefit.title}</ThemedText>
                  <ThemedText style={styles.benefitCardDescription}>{benefit.description}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        );
      case 'funcionamiento':
        return (
          <View style={styles.tabContent}>
            <View style={styles.howItWorksContainer}>
              {howItWorks.map((step) => (
                <View key={`step-${step.step}`} style={styles.stepCard}>
                  <View style={styles.stepNumberContainer}>
                    <ThemedText style={styles.stepNumber}>{step.step}</ThemedText>
                  </View>
                  <View style={[styles.stepIconContainer, { backgroundColor: Colors.light.primary }]}>
                    <Ionicons name={step.icon as any} size={24} color="white" />
                  </View>
                  <View style={styles.stepCardContent}>
                    <ThemedText style={styles.stepCardTitle}>{step.title}</ThemedText>
                    <ThemedText style={styles.stepCardDescription}>{step.description}</ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.tabContent}>
            {/* Sección de acciones principales */}
            <View style={styles.actionsSection}>
              
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push('/consulta/telemedicina/buscar-especialistas' as any)}
                >
                  <View style={[styles.actionIconContainer, { backgroundColor: Colors.light.primary }]}>
                    <Ionicons name="search" size={24} color="white" />
                  </View>
                  <ThemedText style={styles.actionButtonText}>Buscar especialista</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push('/consulta/telemedicina/mis-consultas' as any)}
                >
                  <View style={[styles.actionIconContainer, { backgroundColor: Colors.light.success }]}>
                    <Ionicons name="calendar" size={24} color="white" />
                  </View>
                  <ThemedText style={styles.actionButtonText}>Mis consultas</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push('/consulta/telemedicina/sala-espera' as any)}
                >
                  <View style={[styles.actionIconContainer, { backgroundColor: '#6366F1' }]}>
                    <Ionicons name="hourglass" size={24} color="white" />
                  </View>
                  <ThemedText style={styles.actionButtonText}>Sala de espera</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Sección de próximas consultas */}
            {upcomingConsultations.length > 0 && (
              <View style={styles.upcomingSection}>
                <ThemedText style={styles.sectionTitle}>Próximas consultas</ThemedText>
                
                {upcomingConsultations.map((consultation) => renderConsultation(consultation))}
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
          </View>
        );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header con gradiente mejorado */}
      <LinearGradient
        colors={['#00A0B0', '#70D0E0']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Telemedicina</ThemedText>
        </View>
      </LinearGradient>
      

      
      {/* Navegación con botones */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={[
            styles.navButton, 
            selectedTab === 'inicio' && styles.navButtonActive
          ]}
          onPress={() => setSelectedTab('inicio')}
        >
          <Ionicons 
            name="home" 
            size={18} 
            color={selectedTab === 'inicio' ? 'white' : '#00A0B0'} 
          />
          <ThemedText style={[
            styles.navButtonText,
            selectedTab === 'inicio' && styles.navButtonTextActive
          ]}>Inicio</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.navButton, 
            selectedTab === 'beneficios' && styles.navButtonActive
          ]}
          onPress={() => setSelectedTab('beneficios')}
        >
          <Ionicons 
            name="checkmark-circle" 
            size={18} 
            color={selectedTab === 'beneficios' ? 'white' : '#00A0B0'} 
          />
          <ThemedText style={[
            styles.navButtonText,
            selectedTab === 'beneficios' && styles.navButtonTextActive
          ]}>Beneficios</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.navButton, 
            selectedTab === 'funcionamiento' && styles.navButtonActive
          ]}
          onPress={() => setSelectedTab('funcionamiento')}
        >
          <Ionicons 
            name="information-circle" 
            size={18} 
            color={selectedTab === 'funcionamiento' ? 'white' : '#00A0B0'} 
          />
                      <ThemedText style={[
              styles.navButtonText,
              selectedTab === 'funcionamiento' && styles.navButtonTextActive
            ]}>Funciona</ThemedText>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderTabContent()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 70,
    paddingTop: 30,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    backgroundColor: '#F7F9FA',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#00A0B0',
    backgroundColor: 'white',
    gap: 4,
    flex: 1,
    minHeight: 36,
  },
  navButtonActive: {
    backgroundColor: '#00A0B0',
    borderColor: '#00A0B0',
  },
  navButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00A0B0',
    textAlign: 'center',
    flexShrink: 1,
  },
  navButtonTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  tabContent: {
    flex: 1,
  },
  actionsSection: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#00303B',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: width / 3.5,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
  },
  upcomingSection: {
    marginBottom: 24,
  },
  consultationCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 3,
  },
  consultationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  consultationDoctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(0, 160, 176, 0.2)',
  },
  doctorAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00A0B0',
  },
  doctorAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#00303B',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#506066',
  },

  consultationDetails: {
    flexDirection: 'row',
    marginBottom: 18,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#506066',
    fontWeight: '500',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  joinButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
  specialistsSection: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllLink: {
    fontSize: 14,
    color: '#00A0B0',
    fontWeight: '700',
  },
  specialistsContainer: {
    paddingBottom: 16,
    gap: 16,
  },
  specialistCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 16,
    width: 200,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  specialistAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(0, 160, 176, 0.15)',
  },
  specialistAvatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#00A0B0',
  },
  specialistAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  specialistName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
    color: '#00303B',
  },
  specialistSpecialty: {
    fontSize: 14,
    color: '#506066',
    textAlign: 'center',
    marginBottom: 8,
  },
  specialistRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    color: '#FFB800',
  },
  nextAvailability: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
    color: '#506066',
  },
  nextAvailabilityTime: {
    fontWeight: '700',
    color: '#00303B',
  },
  consultationFee: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00A0B0',
  },
  // Estilos para sección de beneficios
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  benefitCard: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  benefitIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  benefitCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    color: '#00303B',
  },
  benefitCardDescription: {
    fontSize: 13,
    textAlign: 'center',
    color: '#506066',
  },
  // Estilos para sección de funcionamiento
  howItWorksContainer: {
    gap: 20,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  stepNumberContainer: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  stepIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  stepCardContent: {
    flex: 1,
  },
  stepCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#00303B',
  },
  stepCardDescription: {
    fontSize: 14,
    color: '#506066',
  },
});
