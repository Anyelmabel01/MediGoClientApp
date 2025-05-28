import { BottomNavbar } from '@/components/BottomNavbar';
import { LocationSelector } from '@/components/LocationSelector';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserProfile } from '@/components/UserProfile';
import { Colors } from '@/constants/Colors';
import { UserLocation } from '@/constants/UserModel';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NursingService = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  price: number;
  category: 'home-care' | 'injections' | 'wound-care';
};

const nursingServices: NursingService[] = [
  // Injections
  {
    id: '1',
    name: 'Aplicación de inyecciones',
    icon: 'medical',
    description: 'Administración de medicamentos vía intramuscular o intravenosa por personal capacitado',
    price: 250,
    category: 'injections',
  },
  {
    id: '5',
    name: 'Canalización intravenosa',
    icon: 'water',
    description: 'Colocación de catéter para administración de medicamentos o sueros',
    price: 400,
    category: 'injections',
  },
  // Wound care
  {
    id: '2',
    name: 'Curación de heridas',
    icon: 'bandage',
    description: 'Limpieza y cuidado profesional de heridas, cambio de vendajes',
    price: 350,
    category: 'wound-care',
  },
  {
    id: '6',
    name: 'Sonda vesical',
    icon: 'flask',
    description: 'Colocación o cambio de sonda vesical por personal especializado',
    price: 500,
    category: 'wound-care',
  },
  // Home care
  {
    id: '3',
    name: 'Toma de signos vitales',
    icon: 'pulse',
    description: 'Monitoreo de presión arterial, temperatura, frecuencia cardíaca y respiratoria',
    price: 200,
    category: 'home-care',
  },
  {
    id: '4',
    name: 'Cuidado de adulto mayor',
    icon: 'people',
    description: 'Asistencia especializada para adultos mayores en casa',
    price: 450,
    category: 'home-care',
  },
];

type FilterOption = 'all' | 'home-care' | 'injections' | 'wound-care';

export default function EnfermeriaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user, currentLocation, setCurrentLocation } = useUser();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');
  const insets = useSafeAreaInsets();

  const handleLocationSelect = (location: UserLocation) => {
    setCurrentLocation(location);
  };

  const handleServicePress = (serviceId: string) => {
    router.push('/enfermeria/buscar-enfermera' as any);
  };

  const handleNurseSearch = () => {
    router.push('/enfermeria/buscar-enfermera' as any);
  };

  const handleMyServices = () => {
    router.push('/enfermeria/mis-servicios' as any);
  };

  const filteredServices = nursingServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || service.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getFilterLabel = (filter: FilterOption) => {
    switch (filter) {
      case 'all': return 'Todos';
      case 'home-care': return 'Cuidado en Casa';
      case 'injections': return 'Inyecciones';
      case 'wound-care': return 'Cuidado de Heridas';
    }
  };

  const getFilterIcon = (filter: FilterOption) => {
    switch (filter) {
      case 'all': return 'apps';
      case 'home-care': return 'home';
      case 'injections': return 'medical';
      case 'wound-care': return 'bandage';
    }
  };

  const renderFilterChip = (filter: FilterOption) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterChip,
        {
          backgroundColor: selectedFilter === filter 
            ? Colors.light.primary 
            : (isDarkMode ? Colors.dark.border : Colors.light.white),
        }
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Ionicons 
        name={getFilterIcon(filter)} 
        size={16} 
        color={selectedFilter === filter ? 'white' : (isDarkMode ? Colors.dark.textSecondary : Colors.light.primary)}
        style={{ marginRight: 6 }}
      />
      <ThemedText style={[
        styles.filterChipText,
        { 
          color: selectedFilter === filter ? 'white' : (isDarkMode ? Colors.dark.textSecondary : Colors.light.primary)
        }
      ]}>
        {getFilterLabel(filter)}
      </ThemedText>
    </TouchableOpacity>
  );

  const renderServiceItem = ({ item, index }: { item: NursingService; index: number }) => (
    <TouchableOpacity 
      style={[styles.serviceCard, { 
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
        width: (SCREEN_WIDTH - 48) / 2,
      }]}
      onPress={() => handleServicePress(item.id)}
    >
      <View style={[styles.serviceIconContainer, { 
        backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.15)' : 'rgba(0, 160, 176, 0.1)'
      }]}>
        <Ionicons name={item.icon} size={24} color={Colors.light.primary} />
      </View>
      <View style={styles.serviceContent}>
        <ThemedText style={styles.serviceName} numberOfLines={2}>{item.name}</ThemedText>
        <ThemedText style={[styles.servicePrice, { color: Colors.light.primary }]}>
          ${item.price}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfoContainer}
          onPress={() => setShowUserProfile(true)}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {user.nombre.charAt(0)}{user.apellido.charAt(0)}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.greetingContainer}>
            <ThemedText style={styles.greeting}>
              Enfermería
            </ThemedText>
            <View style={styles.editProfileIndicator}>
              <Ionicons name="pulse" size={14} color={Colors.light.primary} />
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.locationContainer}
          onPress={() => setShowLocationSelector(true)}
        >
          <View style={styles.locationIcon}>
            <Ionicons name="location" size={18} color={Colors.light.primary} />
          </View>
          <ThemedText style={styles.locationText} numberOfLines={1}>
            {currentLocation.direccion}
          </ThemedText>
          <Ionicons name="chevron-down" size={16} color={Colors.light.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.servicesHeaderContainer}>
        <ThemedText style={styles.subtitle}>Servicios de enfermería a domicilio</ThemedText>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
      >
        <View style={[styles.infoBox, { 
          backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.1)' : '#E3F2FD',
          borderColor: isDarkMode ? 'rgba(45, 127, 249, 0.2)' : '#BBDEFB'
        }]}>
          <Ionicons name="information-circle" size={24} color={Colors.light.primary} />
          <ThemedText style={[styles.infoText, { color: Colors.light.primary }]}>
            Servicios de enfermería profesional en la comodidad de tu hogar
          </ThemedText>
        </View>

        {/* Search Section */}
        <View style={[styles.searchContainer, {
          backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <Ionicons name="search" size={20} color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} />
          <TextInput
            style={[styles.searchInput, {
              color: isDarkMode ? Colors.dark.text : Colors.light.text,
            }]}
            placeholder="Buscar servicios de enfermería..."
            placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={[styles.nurseSearchButton, { backgroundColor: Colors.light.primary }]}
          onPress={handleNurseSearch}
        >
          <Ionicons name="people" size={20} color="white" />
          <ThemedText style={styles.nurseSearchText}>Buscar Enfermera</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {(['all', 'home-care', 'injections', 'wound-care'] as FilterOption[]).map(renderFilterChip)}
        </ScrollView>
        
        <ThemedText style={styles.sectionTitle}>
          {selectedFilter === 'all' ? 'Servicios disponibles' : `${getFilterLabel(selectedFilter)}`}
        </ThemedText>
        
        <View style={styles.servicesList}>
          {filteredServices.map((item, index) => (
            <View key={item.id}>
              {renderServiceItem({ item, index })}
            </View>
          ))}
        </View>
      </ScrollView>
      
      <BottomNavbar />
      
      <UserProfile 
        isVisible={showUserProfile} 
        onClose={() => setShowUserProfile(false)}
      />
      
      <LocationSelector 
        isVisible={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onLocationSelect={handleLocationSelect}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingBottom: Platform.OS === 'ios' ? 80 : 60,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  editProfileIndicator: {
    backgroundColor: Colors.light.white,
    borderRadius: 10,
    padding: 3,
    marginLeft: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  locationIcon: {
    marginRight: 5,
  },
  locationText: {
    flex: 1,
    color: Colors.light.white,
    fontSize: 13,
    marginRight: 4,
  },
  servicesHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  infoBox: {
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  infoText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    minHeight: 28,
  },
  nurseSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  nurseSearchText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  filtersContainer: {
    marginBottom: 12,
  },
  filtersContent: {
    paddingRight: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.light.primary,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  serviceCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'center',
  },
  serviceContent: {
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.light.primary,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 18,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.primary,
    textAlign: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.light.primary,
  },
  servicesSection: {
    marginBottom: 16,
  },
});