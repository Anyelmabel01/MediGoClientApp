import { Colors } from '@/constants/Colors';
import { useAppointments } from '@/context/AppointmentsContext';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
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

export default function TelemedicinaSelectorScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user, currentLocation, setCurrentLocation } = useUser();
  const { telemedicineAppointments } = useAppointments();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);

  // Filtrar citas próximas
  const upcomingConsultations = telemedicineAppointments.filter(apt => {
    const today = new Date();
    const appointmentDate = new Date(apt.date);
    return appointmentDate >= today && (apt.status === 'CONFIRMED' || apt.status === 'PENDING');
  }).map(apt => ({
    id: apt.id,
    date: apt.date,
    time: apt.time,
    provider_name: apt.specialist_name,
    provider_type: 'VIRTUAL_SPECIALIST' as const,
    specialty: apt.specialty,
    status: apt.status as 'CONFIRMED' | 'PENDING',
    avatar_url: apt.avatar_url,
    start_time: new Date(), // You can calculate this based on date and time if needed
    can_join: apt.can_join || false,
  }));

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
    router.push('/consulta/telemedicina/buscar-especialistas');
  };

  const handleMyConsultations = () => {
    router.push('/consulta/telemedicina/mis-consultas');
  };

  const handleMedicineInfo = () => {
    // TODO: Create medicine information screen
    console.log('Información de Medicamentos');
  };

  const handleConsultationDetails = (id: string) => {
    // TODO: Create consultation details screen
    console.log(`Ver detalles de la consulta ${id}`);
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
      console.log('La consulta aún no está disponible para unirse');
    }
  };

  const handleSpecialistPress = (specialist: VirtualSpecialist) => {
    router.push({
      pathname: '/consulta/telemedicina/perfil-especialista',
      params: { specialistId: specialist.id }
    });
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
      <StatusBar style="auto" />
      
      {/* Header igual al de consultorio */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Telemedicina</ThemedText>
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
            onPress={() => setShowBenefitsModal(true)}
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
            onPress={() => setShowHowItWorksModal(true)}
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

      {/* Modal de Beneficios */}
      <Modal
        visible={showBenefitsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>
              Beneficios de Telemedicina
            </ThemedText>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowBenefitsModal(false)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {telemedicineBenefits.map((benefit) => (
              <View key={benefit.id} style={styles.benefitCard}>
                <View style={styles.benefitIconContainer}>
                  <Ionicons name={benefit.icon as any} size={28} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.benefitContent}>
                  <ThemedText style={styles.benefitTitle}>{benefit.title}</ThemedText>
                  <ThemedText style={styles.benefitDescription}>{benefit.description}</ThemedText>
                </View>
              </View>
            ))}
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCTAButton}
                onPress={() => {
                  setShowBenefitsModal(false);
                  router.push('/consulta/telemedicina/buscar-especialistas');
                }}
              >
                <ThemedText style={styles.modalCTAText}>Buscar Especialista</ThemedText>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal de Cómo Funciona */}
      <Modal
        visible={showHowItWorksModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>
              ¿Cómo funciona la Telemedicina?
            </ThemedText>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowHowItWorksModal(false)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {howItWorks.map((step) => (
              <View key={step.step} style={styles.stepCard}>
                <View style={styles.stepNumber}>
                  <ThemedText style={styles.stepNumberText}>{step.step}</ThemedText>
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Ionicons name={step.icon as any} size={24} color={PRIMARY_COLOR} />
                    <ThemedText style={styles.stepTitle}>{step.title}</ThemedText>
                  </View>
                  <ThemedText style={styles.stepDescription}>{step.description}</ThemedText>
                </View>
              </View>
            ))}
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCTAButton}
                onPress={() => {
                  setShowHowItWorksModal(false);
                  router.push('/consulta/telemedicina/buscar-especialistas');
                }}
              >
                <ThemedText style={styles.modalCTAText}>Comenzar Ahora</ThemedText>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    backgroundColor: '#F7F9FA',
  },
  contentContainer: {
    padding: 12,
    paddingBottom: 24,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.text,
  },
  seeAllLink: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '600',
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
  specialistsContainer: {
    paddingBottom: 8,
    gap: 12,
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
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  modalFooter: {
    marginTop: 16,
    alignItems: 'center',
  },
  modalCTAButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
  },
  modalCTAText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.white,
    marginRight: 8,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginLeft: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  stepFooter: {
    marginTop: 16,
    alignItems: 'center',
  },
  stepFooterText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});


