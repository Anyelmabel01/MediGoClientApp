import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapboxMap } from '../../components/MapboxMap';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const { height } = Dimensions.get('window');

type Laboratory = {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  tests: number;
  latitude: number;
  longitude: number;
  phone: string;
  hours: string;
  homeCollection: boolean;
};

const labs: Laboratory[] = [
  { 
    id: '1', 
    name: 'Laboratorio Central Plaza', 
    address: 'Av. Insurgentes Sur 1234, Col. Del Valle',
    distance: '1.2 km', 
    rating: 4.7, 
    tests: 120,
    latitude: 8.9700,
    longitude: -79.5200,
    phone: '+507 6789-0123',
    hours: 'Lun-Vie: 7:00-19:00, Sáb: 8:00-14:00',
    homeCollection: true
  },
  { 
    id: '2', 
    name: 'Clínica Norte Especializada', 
    address: 'Av. Universidad 567, Col. Narvarte',
    distance: '2.5 km', 
    rating: 4.5, 
    tests: 80,
    latitude: 8.9824,
    longitude: -79.5199,
    phone: '+507 6789-0124',
    hours: 'Lun-Vie: 6:30-18:00, Sáb: 7:00-13:00',
    homeCollection: true
  },
  { 
    id: '3', 
    name: 'Centro Médico Sur', 
    address: 'Calz. de Tlalpan 890, Col. Vértiz Narvarte',
    distance: '3.8 km', 
    rating: 4.3, 
    tests: 95,
    latitude: 8.9650,
    longitude: -79.5150,
    phone: '+507 6789-0125',
    hours: 'Lun-Vie: 8:00-18:00, Sáb: 9:00-12:00',
    homeCollection: false
  },
];

export default function EncontrarLaboratorioScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  const handleNavigateToDetails = (labId: string) => {
    router.push(`/laboratorio/detallesLaboratorio?labId=${labId}` as any);
  };

  const handleCallLab = (phone: string) => {
    console.log('Llamando al laboratorio:', phone);
  };

  const handleGetDirections = (lab: Laboratory) => {
    console.log('Obteniendo direcciones a:', lab.name);
  };

  // Crear marcadores para el mapa
  const mapMarkers = labs.map(lab => ({
    id: lab.id,
    latitude: lab.latitude,
    longitude: lab.longitude,
    color: Colors.light.primary,
    title: lab.name
  }));

  // Centro del mapa (promedio de todas las ubicaciones)
  const centerLatitude = labs.reduce((sum, lab) => sum + lab.latitude, 0) / labs.length;
  const centerLongitude = labs.reduce((sum, lab) => sum + lab.longitude, 0) / labs.length;

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
          </TouchableOpacity>
          
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.greetingContainer}>
              <ThemedText style={styles.greeting}>
                Encontrar Laboratorio
              </ThemedText>
              <View style={styles.editProfileIndicator}>
                <Ionicons name="location" size={14} color={Colors.light.primary} />
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* Mapa Grande */}
        <View style={[styles.mapContainer, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
        }]}>
          <ThemedText style={[styles.mapTitle, { color: Colors.light.primary }]}>
            Laboratorios Cercanos
          </ThemedText>
          <View style={styles.mapWrapper}>
            <MapboxMap
              latitude={centerLatitude}
              longitude={centerLongitude}
              zoom={12}
              markers={mapMarkers}
              showCurrentLocation={true}
              interactive={true}
              style={styles.map}
            />
          </View>
          <View style={styles.mapLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendMarker, { backgroundColor: Colors.light.primary }]} />
              <ThemedText style={[styles.legendText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>Laboratorios</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <Ionicons name="location" size={16} color={Colors.light.error} />
              <ThemedText style={[styles.legendText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>Tu ubicación</ThemedText>
            </View>
          </View>
        </View>

        {/* Lista de Laboratorios */}
        <View style={styles.labsList}>
          <ThemedText style={[styles.sectionTitle, {
            color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
          }]}>
            Laboratorios Disponibles ({labs.length})
          </ThemedText>
          
          {labs.map(lab => (
            <TouchableOpacity 
              key={lab.id} 
              style={[styles.labCard, {
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
                borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                shadowColor: Colors.light.shadowColor
              }]}
              onPress={() => handleNavigateToDetails(lab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.labMainInfo}>
                <View style={styles.labHeader}>
                  <ThemedText style={[styles.labName, {
                    color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
                  }]}>
                    {lab.name}
                  </ThemedText>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#ffc107" />
                    <ThemedText style={[styles.rating, {
                      color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                    }]}>
                      {lab.rating}
                    </ThemedText>
                  </View>
                </View>
                
                <View style={styles.labInfoRow}>
                  <Ionicons name="location-outline" size={16} color={Colors.light.primary} />
                  <ThemedText style={[styles.labAddress, {
                    color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                  }]}>
                    {lab.address}
                  </ThemedText>
                </View>
                
                <View style={styles.labMetaRow}>
                  <View style={styles.labMeta}>
                    <Ionicons name="walk-outline" size={14} color={Colors.light.primary} />
                    <ThemedText style={[styles.labMetaText, {
                      color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                    }]}>
                      {lab.distance}
                    </ThemedText>
                  </View>
                  <View style={styles.labMeta}>
                    <Ionicons name="flask-outline" size={14} color={Colors.light.primary} />
                    <ThemedText style={[styles.labMetaText, {
                      color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                    }]}>
                      {lab.tests} pruebas
                    </ThemedText>
                  </View>
                  {lab.homeCollection && (
                    <View style={styles.labMeta}>
                      <Ionicons name="home" size={14} color={Colors.light.success} />
                      <ThemedText style={[styles.labMetaText, { color: Colors.light.success }]}>
                        A domicilio
                      </ThemedText>
                    </View>
                  )}
                </View>
                
                <View style={styles.labInfoRow}>
                  <Ionicons name="time-outline" size={16} color={Colors.light.primary} />
                  <ThemedText style={[styles.labHours, {
                    color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                  }]}>
                    {lab.hours}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.labActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: Colors.light.primary }]}
                  onPress={() => handleCallLab(lab.phone)}
                >
                  <Ionicons name="call" size={16} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, { 
                    backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                    borderColor: Colors.light.primary,
                    borderWidth: 1
                  }]}
                  onPress={() => handleGetDirections(lab)}
                >
                  <Ionicons name="map" size={16} color={Colors.light.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.chevronButton}>
                  <Ionicons name="chevron-forward" size={20} color={Colors.light.primary} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filtros rápidos */}
        <View style={styles.quickFilters}>
          <ThemedText style={[styles.filtersTitle, {
            color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
          }]}>
            Filtros rápidos
          </ThemedText>
          <View style={styles.filtersRow}>
            <TouchableOpacity style={[styles.filterChip, { 
              backgroundColor: Colors.light.primary + '20',
              borderColor: Colors.light.primary
            }]}>
              <Ionicons name="home" size={16} color={Colors.light.primary} />
              <ThemedText style={[styles.filterChipText, { color: Colors.light.primary }]}>
                A domicilio
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.filterChip, { 
              backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
              borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
            }]}>
              <Ionicons name="star" size={16} color="#ffc107" />
              <ThemedText style={[styles.filterChipText, {
                color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
              }]}>
                Mejor valorados
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.filterChip, { 
              backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
              borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
            }]}>
              <Ionicons name="flash" size={16} color={Colors.light.primary} />
              <ThemedText style={[styles.filterChipText, {
                color: isDarkMode ? Colors.dark.textPrimary : Colors.light.textPrimary
              }]}>
                Más cercanos
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 6,
    marginRight: 12,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: Colors.light.primary,
    fontSize: 17,
    fontWeight: 'bold',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  content: {
    flex: 1,
  },
  mapContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 12,
  },
  mapWrapper: {
    height: height * 0.4, // 40% de la altura de la pantalla
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  labsList: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  labCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  labMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  labHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  labName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    marginLeft: 4,
  },
  labInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  labAddress: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  labHours: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  labMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 6,
  },
  labMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labMetaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  labActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  chevronButton: {
    padding: 4,
  },
  quickFilters: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
}); 