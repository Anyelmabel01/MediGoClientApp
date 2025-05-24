import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
    Alert,
    Dimensions,
    Image,
    Linking,
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
    avatar_url: 'https://images.unsplash.com/photo-1594824047323-65b2b4e20c9e?w=150&h=150&fit=crop&crop=face',
    start_time: new Date(new Date().getTime() + 24 * 60 * 60000), // 1 day from now
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
      // TODO: Create virtual waiting room
      Alert.alert(
        'Unirse a Videollamada',
        `¿Estás listo para unirte a la consulta con ${consultation.provider_name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Unirse', onPress: () => Alert.alert('Conectando...', 'Entrando a la sala de espera virtual') }
        ]
      );
    } else {
      Alert.alert(
        'Consulta no disponible',
        'La consulta aún no está disponible para unirse. Por favor, espera hasta la hora programada.'
      );
    }
  };

  const handleSpecialistPress = (specialist: VirtualSpecialist) => {
    // TODO: Create specialist profile screen
    Alert.alert(
      `${specialist.display_name}`,
      `${specialist.specialty}\n${specialist.bio}\n\nTarifa: $${specialist.consultation_fee}\nDisponible: ${specialist.next_availability}`
    );
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

  const renderConsultation = ({ item }: { item: ConsultaVirtual }) => (
    <TouchableOpacity 
      style={[styles.consultationCard, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}
      onPress={() => handleConsultationDetails(item.id)}
    >
      <View style={styles.consultationHeader}>
        <Image 
          source={{ uri: item.avatar_url || 'https://via.placeholder.com/50' }}
          style={styles.providerAvatar}
        />
        <View style={styles.consultationInfo}>
          <ThemedText style={styles.providerName}>{item.provider_name}</ThemedText>
          <ThemedText style={[styles.specialty, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            {item.specialty}
          </ThemedText>
          <ThemedText style={[styles.dateTime, { color: Colors.light.primary }]}>
            {item.date} • {item.time}
          </ThemedText>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <ThemedText style={styles.statusText}>{getStatusLabel(item.status)}</ThemedText>
          </View>
          {isConsultationStartingSoon(item) && item.can_join && (
            <TouchableOpacity 
              style={styles.joinButton}
              onPress={() => handleJoinCall(item)}
            >
              <Ionicons name="videocam" size={16} color="white" />
              <ThemedText style={styles.joinButtonText}>Unirse</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSpecialist = ({ item }: { item: VirtualSpecialist }) => (
    <TouchableOpacity 
      style={[styles.specialistCard, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}
      onPress={() => handleSpecialistPress(item)}
    >
      <Image 
        source={{ uri: item.avatar_url || 'https://via.placeholder.com/60' }}
        style={styles.specialistAvatar}
      />
      <View style={styles.specialistInfo}>
        <ThemedText style={styles.specialistName}>{item.display_name}</ThemedText>
        <ThemedText style={[styles.specialistSpecialty, {
          color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
        }]}>
          {item.specialty}
        </ThemedText>
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {renderStarRating(item.rating)}
          </View>
          <ThemedText style={[styles.ratingText, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            {item.rating}
          </ThemedText>
        </View>
        <ThemedText style={[styles.availability, {
          color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
        }]}>
          Disponible: {item.next_availability}
        </ThemedText>
      </View>
      <View style={styles.specialistAction}>
        <ThemedText style={[styles.price, { color: Colors.light.primary }]}>
          ${item.consultation_fee}
        </ThemedText>
        <TouchableOpacity 
          style={[styles.viewProfileButton, { backgroundColor: Colors.light.primary }]}
          onPress={() => handleSpecialistPress(item)}
        >
          <ThemedText style={styles.viewProfileText}>Ver perfil</ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={[PRIMARY_COLOR, PRIMARY_LIGHT]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <ThemedText style={styles.headerTitle}>Telemedicina</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Consultas virtuales con especialistas
            </ThemedText>
          </View>
          
          <View style={styles.headerIcon}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <Ionicons name="videocam" size={32} color="white" />
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Features Grid */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Servicios Disponibles</ThemedText>
          <View style={styles.featuresGrid}>
            {features.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                    borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                    opacity: feature.available ? 1 : 0.6
                  }
                ]}
                onPress={() => handleFeaturePress(feature)}
                disabled={!feature.available}
              >
                <View style={[styles.featureIconContainer, { 
                  backgroundColor: feature.available ? PRIMARY_COLOR + '20' : Colors.light.textSecondary + '20' 
                }]}>
                  <Ionicons 
                    name={feature.icon as any} 
                    size={24} 
                    color={feature.available ? PRIMARY_COLOR : Colors.light.textSecondary} 
                  />
                </View>
                <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
                <ThemedText style={[styles.featureDescription, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  {feature.description}
                </ThemedText>
                {!feature.available && (
                  <View style={[styles.comingSoonBadge, { backgroundColor: Colors.light.textSecondary }]}>
                    <ThemedText style={styles.comingSoonText}>Próximamente</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Benefits Section */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <View style={styles.benefitsHeader}>
            <Ionicons name="checkmark-circle" size={24} color={PRIMARY_COLOR} />
            <ThemedText style={styles.sectionTitle}>Beneficios de la Telemedicina</ThemedText>
          </View>
          <View style={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark" size={16} color="#10b981" />
                <ThemedText style={[styles.benefitText, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  {benefit}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* How it Works */}
        <View style={[styles.section, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ThemedText style={styles.sectionTitle}>¿Cómo Funciona?</ThemedText>
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: PRIMARY_COLOR }]}>
                <ThemedText style={styles.stepNumberText}>1</ThemedText>
              </View>
              <View style={styles.stepContent}>
                <ThemedText style={styles.stepTitle}>Busca tu Especialista</ThemedText>
                <ThemedText style={[styles.stepDescription, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  Filtra por especialidad, idioma y disponibilidad
                </ThemedText>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: PRIMARY_COLOR }]}>
                <ThemedText style={styles.stepNumberText}>2</ThemedText>
              </View>
              <View style={styles.stepContent}>
                <ThemedText style={styles.stepTitle}>Agenda tu Cita</ThemedText>
                <ThemedText style={[styles.stepDescription, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  Selecciona el horario que mejor se adapte a ti
                </ThemedText>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: PRIMARY_COLOR }]}>
                <ThemedText style={styles.stepNumberText}>3</ThemedText>
              </View>
              <View style={styles.stepContent}>
                <ThemedText style={styles.stepTitle}>Únete a la Consulta</ThemedText>
                <ThemedText style={[styles.stepDescription, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  Ingresa a la sala de espera y conecta con tu doctor
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Support Section */}
        <View style={[styles.section, {
          backgroundColor: ACCENT_COLOR + '20',
          borderColor: ACCENT_COLOR + '50',
        }]}>
          <View style={styles.supportHeader}>
            <Ionicons name="help-circle" size={24} color={PRIMARY_COLOR} />
            <ThemedText style={[styles.sectionTitle, { color: PRIMARY_COLOR }]}>
              ¿Necesitas Ayuda?
            </ThemedText>
          </View>
          <ThemedText style={[styles.supportText, {
            color: isDarkMode ? Colors.dark.text : Colors.light.text
          }]}>
            Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier consulta técnica.
          </ThemedText>
          <TouchableOpacity 
            style={[styles.supportButton, { backgroundColor: PRIMARY_COLOR }]}
            onPress={() => {
              Alert.alert(
                'Soporte 24/7',
                'Llámanos para asistencia técnica inmediata:\n\n📞 +1 (800) 123-4567\n\nHorario: 24 horas, todos los días',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { 
                    text: 'Llamar Ahora', 
                    onPress: () => Linking.openURL('tel:+18001234567')
                  }
                ]
              );
            }}
          >
            <Ionicons name="call" size={20} color="white" />
            <ThemedText style={styles.supportButtonText}>Llamar Soporte: (800) 123-4567</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerIcon: {
    marginLeft: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: width < 400 ? '100%' : '48%',
    minHeight: 140,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  comingSoonText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    fontSize: 14,
    flex: 1,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  supportText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  supportButtonText: {
    color: 'white',
    fontSize: width < 400 ? 12 : 14,
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 1,
  },
  consultationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  consultationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  consultationInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  specialty: {
    fontSize: 13,
    marginBottom: 2,
  },
  dateTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  specialistCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  specialistAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  specialistInfo: {
    flex: 1,
  },
  specialistName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  specialistSpecialty: {
    fontSize: 13,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    fontSize: 12,
  },
  availability: {
    fontSize: 12,
  },
  specialistAction: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  viewProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewProfileText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
}); 