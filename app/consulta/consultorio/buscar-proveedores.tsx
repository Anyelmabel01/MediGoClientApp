import { BottomNavbar } from '@/components/BottomNavbar';
import { LocationSelector } from '@/components/LocationSelector';
import { ThemedView } from '@/components/ThemedView';
import { UserProfile } from '@/components/UserProfile';
import { Colors } from '@/constants/Colors';
import { UserLocation } from '@/constants/UserModel';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Tipos para proveedores médicos
type ProviderType = 'ALL' | 'GENERAL_DOCTOR' | 'CARDIOLOGIST' | 'DERMATOLOGIST' | 'PEDIATRICIAN' | 'NEUROLOGIST' | 'PSYCHIATRIST';

type Provider = {
  id: string;
  display_name: string;
  provider_type: ProviderType;
  organization_name?: string;
  avatar_url?: string;
  rating: number;
  total_reviews: number;
  next_availability: string;
  consultation_fee: number;
  location: string;
  distance?: string;
};

type FilterOption = {
  id: ProviderType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const providerTypeLabels: Record<ProviderType, string> = {
  'ALL': 'Todos',
  'GENERAL_DOCTOR': 'Médico General',
  'CARDIOLOGIST': 'Cardiólogo',
  'DERMATOLOGIST': 'Dermatólogo',
  'PEDIATRICIAN': 'Pediatra',
  'NEUROLOGIST': 'Neurólogo',
  'PSYCHIATRIST': 'Psiquiatra'
};

const filterOptions: FilterOption[] = [
  { id: 'ALL', label: 'Todos', icon: 'medical-outline' },
  { id: 'CARDIOLOGIST', label: 'Cardiología', icon: 'heart-outline' },
  { id: 'GENERAL_DOCTOR', label: 'General', icon: 'person-outline' },
  { id: 'DERMATOLOGIST', label: 'Dermatología', icon: 'body-outline' },
  { id: 'PEDIATRICIAN', label: 'Pediatría', icon: 'happy-outline' },
];

const mockProviders: Provider[] = [
  {
    id: '1',
    display_name: 'Dr. María González',
    provider_type: 'CARDIOLOGIST',
    organization_name: 'Centro Médico Integral',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    total_reviews: 127,
    next_availability: 'Hoy, 3:00 PM',
    consultation_fee: 120,
    location: 'Altamira, Caracas',
    distance: '1.2 km'
  },
  {
    id: '2',
    display_name: 'Dr. Carlos Ramírez',
    provider_type: 'GENERAL_DOCTOR',
    organization_name: 'Clínica San Miguel',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    rating: 4.7,
    total_reviews: 89,
    next_availability: 'Mañana, 10:00 AM',
    consultation_fee: 80,
    location: 'Las Mercedes, Caracas',
    distance: '2.1 km'
  },
  {
    id: '3',
    display_name: 'Dra. Ana Martínez',
    provider_type: 'DERMATOLOGIST',
    organization_name: 'Instituto Dermatológico',
    avatar_url: 'https://images.unsplash.com/photo-1594824047323-65b2b4e20c9e?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    total_reviews: 156,
    next_availability: 'Viernes, 2:30 PM',
    consultation_fee: 100,
    location: 'Chacao, Caracas',
    distance: '3.5 km'
  },
  {
    id: '4',
    display_name: 'Dr. Luis Hernández',
    provider_type: 'PEDIATRICIAN',
    organization_name: 'Hospital Infantil',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
    rating: 4.6,
    total_reviews: 203,
    next_availability: 'Lunes, 9:00 AM',
    consultation_fee: 75,
    location: 'El Valle, Caracas',
    distance: '4.2 km'
  }
];

// Estilos para la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingBottom: Platform.OS === 'ios' ? 80 : 60,
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: Colors.light.text,
  },
  filtersContainer: {
    paddingVertical: 8,
  },
  filtersList: {
    paddingHorizontal: 16,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary + '20',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  filterOptionSelected: {
    backgroundColor: Colors.light.primary,
  },
  filterText: {
    marginLeft: 6,
    fontSize: 13,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  filterTextSelected: {
    color: Colors.light.white,
  },
  providersList: {
    padding: 16,
    paddingBottom: 100,
  },
  providerCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 2,
  },
  providerType: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  cardDetails: {
    marginTop: 8,
    marginBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.primary + '20',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  detailText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginLeft: 4,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.primary + '20',
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  quickBookButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  quickBookText: {
    color: Colors.light.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default function BuscarProveedoresScreen() {
  const router = useRouter();
  const { user, currentLocation, setCurrentLocation } = useUser();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ProviderType>('ALL');

  const handleLocationSelect = (location: UserLocation) => {
    setCurrentLocation(location);
  };

  const filteredProviders = mockProviders.filter(provider => {
    const matchesSearch = provider.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         providerTypeLabels[provider.provider_type].toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'ALL' || provider.provider_type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleProviderSelect = (provider: Provider) => {
    router.push({
      pathname: '/consulta/consultorio/perfil-proveedor',
      params: { providerId: provider.id }
    });
  };

  const renderStarRating = (rating: number, size: number = 11) => {
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

    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={size} color="#d1d5db" />
      );
    }

    return stars;
  };

  const renderProvider = ({ item }: { item: Provider }) => (
    <TouchableOpacity 
      style={styles.providerCard}
      onPress={() => handleProviderSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Image 
          source={{ uri: item.avatar_url || 'https://via.placeholder.com/50' }}
          style={styles.providerAvatar}
        />
        <View style={styles.providerInfo}>
          <Text style={styles.providerName} numberOfLines={1}>
            {item.display_name}
          </Text>
          <Text style={styles.providerType} numberOfLines={1}>
            {providerTypeLabels[item.provider_type]}
          </Text>
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {renderStarRating(item.rating)}
            </View>
            <Text style={styles.ratingText}>
              {item.rating} ({item.total_reviews})
            </Text>
          </View>
        </View>
        <View style={styles.priceColumn}>
          <Text style={styles.price}>
            Bs. {item.consultation_fee}
          </Text>
          <Text style={styles.priceLabel}>
            consulta
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={12} color="#4CAF50" />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.next_availability}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={12} color={Colors.light.primary} />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.location} • {item.distance}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={styles.quickBookButton}
          onPress={(e) => {
            e.stopPropagation();
            router.push({
              pathname: '/consulta/consultorio/agendar-cita',
              params: { 
                providerId: item.id,
                selectedDate: 'today',
                selectedTime: '3:00 PM'
              }
            });
          }}
        >
          <Text style={styles.quickBookText}>Agendar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFilter = ({ item }: { item: FilterOption }) => (
    <TouchableOpacity
      style={[
        styles.filterOption,
        selectedFilter === item.id ? styles.filterOptionSelected : null,
      ]}
      onPress={() => setSelectedFilter(item.id)}
    >
      <Ionicons
        name={item.icon}
        size={16}
        color={selectedFilter === item.id ? Colors.light.white : Colors.light.primary}
      />
      <Text
        style={[
          styles.filterText,
          selectedFilter === item.id ? styles.filterTextSelected : null,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Buscar Proveedores</Text>
      </View>
      
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={18} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o especialidad"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.textSecondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros horizontales */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={filterOptions}
          renderItem={renderFilter}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Lista de proveedores */}
      <FlatList
        data={filteredProviders}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.providersList}
        showsVerticalScrollIndicator={false}
      />

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
