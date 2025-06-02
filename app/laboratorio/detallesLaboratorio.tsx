import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapboxMap } from '../../components/MapboxMap';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const { height } = Dimensions.get('window');

type Laboratory = {
  id: string;
  nombre: string;
  direccion: string;
  contacto: string;
  telefono: string;
  email: string;
  horario: string;
  latitude: number;
  longitude: number;
  acreditaciones: string[];
  servicios: string[];
  tomaDomicilio: boolean;
  rating: number;
  reviews: Review[];
  especialidades: string[];
  segurosMedicos: string[];
};

type Review = {
  user: string;
  comment: string;
  rating: number;
};

const mockLaboratories: { [key: string]: Laboratory } = {
  '1': {
    id: '1',
    nombre: 'Laboratorio Central Plaza',
    direccion: 'Av. Insurgentes Sur 1234, Col. Del Valle, Ciudad de Panamá',
    contacto: 'Tel: +507 6789-0123',
    telefono: '+507 6789-0123',
    email: 'contacto@labcentral.com.pa',
    horario: 'Lunes a Viernes: 7:00 AM - 7:00 PM | Sábados: 8:00 AM - 2:00 PM',
    latitude: 8.9700,
    longitude: -79.5200,
    acreditaciones: ['ISO 15189', 'CAP Accredited', 'MINSA Autorizado'],
    servicios: [
      'Análisis de Sangre Completo',
      'Urinálisis y Coprocultivo',
      'Pruebas COVID-19 (PCR y Antígeno)',
      'Marcadores Tumorales',
      'Perfil Lipídico',
      'Hemograma Completo',
      'Química Sanguínea',
      'Hormonas Tiroideas',
      'Marcadores Cardíacos',
      'Cultivos Microbiológicos'
    ],
    tomaDomicilio: true,
    rating: 4.8,
    reviews: [
      { user: 'Ana Pérez', comment: 'Excelente servicio y atención rápida. Los resultados llegaron a tiempo.', rating: 5 },
      { user: 'Carlos Mendoza', comment: 'Muy profesionales, instalaciones limpias y modernas.', rating: 5 },
      { user: 'María González', comment: 'Personal amable y procesos eficientes. Recomendado.', rating: 4 },
      { user: 'Luis Rodríguez', comment: 'Buenos precios y calidad en el servicio.', rating: 4 },
    ],
    especialidades: ['Hematología', 'Bioquímica Clínica', 'Microbiología', 'Inmunología'],
    segurosMedicos: ['Seguro Social', 'ASSA', 'Mapfre', 'Universal']
  },
  '2': {
    id: '2',
    nombre: 'Clínica Norte Especializada',
    direccion: 'Av. Universidad 567, Col. Narvarte, Ciudad de Panamá',
    contacto: 'Tel: +507 6789-0124',
    telefono: '+507 6789-0124',
    email: 'info@clinicanorte.com.pa',
    horario: 'Lunes a Viernes: 6:30 AM - 6:00 PM | Sábados: 7:00 AM - 1:00 PM',
    latitude: 8.9824,
    longitude: -79.5199,
    acreditaciones: ['ISO 9001', 'MINSA Certificado'],
    servicios: [
      'Análisis Clínicos Especializados',
      'Pruebas Genéticas',
      'Marcadores Oncológicos',
      'Estudios Hormonales'
    ],
    tomaDomicilio: true,
    rating: 4.6,
    reviews: [
      { user: 'Sandra López', comment: 'Especialistas muy competentes, resultados confiables.', rating: 5 },
      { user: 'Diego Vargas', comment: 'Buena atención al cliente y rapidez en la entrega.', rating: 4 },
    ],
    especialidades: ['Endocrinología', 'Oncología', 'Genética'],
    segurosMedicos: ['Seguro Social', 'ASSA', 'Banistmo']
  }
};

export default function DetallesLaboratorioScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const { labId } = useLocalSearchParams();
  
  // Obtener datos del laboratorio (en una app real vendría de API)
  const lab = mockLaboratories[labId as string] || mockLaboratories['1'];

  const handleCallLab = () => {
    console.log('Llamando al laboratorio:', lab.telefono);
  };

  const handleGetDirections = () => {
    console.log('Obteniendo direcciones a:', lab.nombre);
  };

  const handleScheduleTest = () => {
    router.push('/laboratorio/catalogo' as any);
  };

  const handleAddToFavorites = () => {
    console.log('Agregando a favoritos:', lab.nombre);
  };

  const handleEmailLab = () => {
    console.log('Enviando email a:', lab.email);
  };

  // Marcador para el mapa
  const mapMarkers = [{
    id: lab.id,
    latitude: lab.latitude,
    longitude: lab.longitude,
    color: Colors.light.primary,
    title: lab.nombre
  }];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
            </TouchableOpacity>
            
            <View style={styles.greetingContainer}>
              <ThemedText style={styles.greeting} numberOfLines={1}>
                Detalles del Laboratorio
              </ThemedText>
              <View style={styles.editProfileIndicator}>
                <Ionicons name="business" size={14} color={Colors.light.primary} />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => console.log('Añadir laboratorio a favoritos')}
            >
              <Ionicons name="heart-outline" size={20} color={Colors.light.white} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        >
          {/* Información principal */}
          <View style={[styles.mainInfoCard, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            <View style={styles.labHeader}>
              <ThemedText style={[styles.labName, {
                color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
              }]}>
                {lab.nombre}
              </ThemedText>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#ffc107" />
                <ThemedText style={[styles.rating, {
                  color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
                }]}>
                  {lab.rating}
                </ThemedText>
                <ThemedText style={[styles.reviewCount, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  ({lab.reviews.length} reseñas)
                </ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location" size={18} color={Colors.light.primary} />
              <ThemedText style={[styles.infoText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {lab.direccion}
              </ThemedText>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time" size={18} color={Colors.light.primary} />
              <ThemedText style={[styles.infoText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                {lab.horario}
              </ThemedText>
            </View>

            {lab.tomaDomicilio && (
              <View style={[styles.homeCollectionBadge, { backgroundColor: Colors.light.success + '20' }]}>
                <Ionicons name="home-outline" size={16} color={Colors.light.success} />
                <ThemedText style={[styles.homeCollectionText, { color: Colors.light.success }]}>
                  Servicio a domicilio disponible
                </ThemedText>
              </View>
            )}
          </View>

          {/* Mapa Grande */}
          <View style={[styles.mapCard, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            <ThemedText style={[styles.cardTitle, { color: Colors.light.primary }]}>
              Ubicación
            </ThemedText>
            <View style={styles.mapContainer}>
              <MapboxMap
                latitude={lab.latitude}
                longitude={lab.longitude}
                zoom={15}
                markers={mapMarkers}
                showCurrentLocation={true}
                interactive={true}
                style={styles.map}
              />
            </View>
            <TouchableOpacity 
              style={[styles.directionsButton, { backgroundColor: Colors.light.primary }]}
              onPress={handleGetDirections}
            >
              <Ionicons name="navigate" size={18} color="white" />
              <ThemedText style={styles.directionsButtonText}>Obtener Direcciones</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Servicios */}
          <View style={[styles.card, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            <ThemedText style={[styles.cardTitle, { color: Colors.light.primary }]}>
              Servicios Ofrecidos
            </ThemedText>
            <View style={styles.servicesGrid}>
              {lab.servicios.slice(0, 6).map((servicio, index) => (
                <View key={index} style={[styles.serviceItem, {
                  backgroundColor: Colors.light.primary + '10',
                  borderColor: Colors.light.primary + '30'
                }]}>
                  <Ionicons name="medical" size={16} color={Colors.light.primary} />
                  <ThemedText style={[styles.serviceText, {
                    color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
                  }]}>
                    {servicio}
                  </ThemedText>
                </View>
              ))}
              {lab.servicios.length > 6 && (
                <View style={[styles.serviceItem, {
                  backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.border
                }]}>
                  <ThemedText style={[styles.moreServicesText, {
                    color: Colors.light.primary
                  }]}>
                    +{lab.servicios.length - 6} más...
                  </ThemedText>
                </View>
              )}
            </View>
          </View>

          {/* Especialidades */}
          <View style={[styles.card, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            <ThemedText style={[styles.cardTitle, { color: Colors.light.primary }]}>
              Especialidades
            </ThemedText>
            <View style={styles.specialtiesRow}>
              {lab.especialidades.map((especialidad, index) => (
                <View key={index} style={[styles.specialtyChip, {
                  backgroundColor: Colors.light.primary + '20',
                  borderColor: Colors.light.primary
                }]}>
                  <ThemedText style={[styles.specialtyText, { color: Colors.light.primary }]}>
                    {especialidad}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Acreditaciones */}
          <View style={[styles.card, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            <ThemedText style={[styles.cardTitle, { color: Colors.light.primary }]}>
              Acreditaciones y Certificaciones
            </ThemedText>
            {lab.acreditaciones.map((acreditacion, index) => (
              <View key={index} style={styles.accreditationItem}>
                <Ionicons name="shield-checkmark" size={16} color={Colors.light.success} />
                <ThemedText style={[styles.accreditationText, {
                  color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
                }]}>
                  {acreditacion}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* Seguros Médicos */}
          <View style={[styles.card, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            <ThemedText style={[styles.cardTitle, { color: Colors.light.primary }]}>
              Seguros Médicos Aceptados
            </ThemedText>
            <View style={styles.insuranceRow}>
              {lab.segurosMedicos.map((seguro, index) => (
                <View key={index} style={[styles.insuranceChip, {
                  backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.border
                }]}>
                  <Ionicons name="shield-outline" size={14} color={Colors.light.primary} />
                  <ThemedText style={[styles.insuranceText, {
                    color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
                  }]}>
                    {seguro}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Reseñas */}
          <View style={[styles.card, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            <ThemedText style={[styles.cardTitle, { color: Colors.light.primary }]}>
              Reseñas de Usuarios
            </ThemedText>
            {lab.reviews.slice(0, 3).map((review, index) => (
              <View key={index} style={[styles.reviewCard, {
                backgroundColor: isDarkMode ? Colors.dark.border + '30' : Colors.light.border + '30',
                borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
              }]}>
                <View style={styles.reviewHeader}>
                  <ThemedText style={[styles.reviewUser, {
                    color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
                  }]}>
                    {review.user}
                  </ThemedText>
                  <View style={styles.reviewRating}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons 
                        key={i}
                        name="star" 
                        size={12} 
                        color={i < review.rating ? '#ffc107' : '#e0e0e0'} 
                      />
                    ))}
                  </View>
                </View>
                <ThemedText style={[styles.reviewComment, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  &ldquo;{review.comment}&rdquo;
                </ThemedText>
              </View>
            ))}
            {lab.reviews.length > 3 && (
              <TouchableOpacity style={styles.seeAllReviews}>
                <ThemedText style={[styles.seeAllText, { color: Colors.light.primary }]}>
                  Ver todas las reseñas ({lab.reviews.length})
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {/* Botones de acción */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.primaryActionButton, { backgroundColor: Colors.light.primary }]}
              onPress={handleScheduleTest}
            >
              <Ionicons name="calendar" size={20} color="white" />
              <ThemedText style={styles.primaryActionText}>Agendar Prueba Aquí</ThemedText>
            </TouchableOpacity>

            <View style={styles.secondaryActionsRow}>
              <TouchableOpacity 
                style={[styles.secondaryActionButton, {
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                  borderColor: Colors.light.primary
                }]}
                onPress={handleCallLab}
              >
                <Ionicons name="call" size={18} color={Colors.light.primary} />
                <ThemedText style={[styles.secondaryActionText, { color: Colors.light.primary }]}>
                  Llamar
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.secondaryActionButton, {
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                  borderColor: Colors.light.primary
                }]}
                onPress={handleEmailLab}
              >
                <Ionicons name="mail" size={18} color={Colors.light.primary} />
                <ThemedText style={[styles.secondaryActionText, { color: Colors.light.primary }]}>
                  Email
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </>
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
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexWrap: 'nowrap',
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
  favoriteButton: {
    padding: 8,
    marginLeft: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
  },
  mainInfoCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    backgroundColor: Colors.light.white,
    borderColor: Colors.light.border,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labHeader: {
    marginBottom: 16,
  },
  labName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  reviewCount: {
    fontSize: 14,
    marginLeft: 4,
    color: Colors.light.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
    color: Colors.light.textSecondary,
  },
  homeCollectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: Colors.light.success + '20',
  },
  homeCollectionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: Colors.light.success,
  },
  mapCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: Colors.light.white,
    borderColor: Colors.light.border,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 12,
    color: Colors.light.primary,
  },
  mapContainer: {
    height: height * 0.35,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
  },
  directionsButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    backgroundColor: Colors.light.white,
    borderColor: Colors.light.border,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
    minWidth: '47%',
  },
  serviceText: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },
  moreServicesText: {
    fontSize: 12,
    fontWeight: '600',
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  accreditationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  accreditationText: {
    fontSize: 14,
    marginLeft: 8,
  },
  insuranceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  insuranceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  insuranceText: {
    fontSize: 12,
    marginLeft: 4,
  },
  reviewCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  seeAllReviews: {
    marginTop: 8,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: Colors.light.primary,
  },
  primaryActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
}); 