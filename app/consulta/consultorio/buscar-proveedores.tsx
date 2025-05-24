import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';

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
  next_availability: string;
  consultation_fee: number;
  location: string;
};

const mockProviders: Provider[] = [
  {
    id: '1',
    display_name: 'Dr. María González',
    provider_type: 'CARDIOLOGIST',
    organization_name: 'Centro Médico Integral',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    license_number: 'CDL12345',
    bio: 'Cardióloga con 15 años de experiencia en diagnóstico y tratamiento de enfermedades cardiovasculares.',
    rating: 4.9,
    next_availability: 'Hoy, 3:00 PM',
    consultation_fee: 800,
    location: 'Col. Roma Norte, CDMX'
  },
  {
    id: '2',
    display_name: 'Dr. Carlos Ramírez',
    provider_type: 'GENERAL_DOCTOR',
    organization_name: 'Clínica San Miguel',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    license_number: 'GDL67890',
    bio: 'Médico general especializado en medicina familiar y atención primaria.',
    rating: 4.7,
    next_availability: 'Mañana, 10:00 AM',
    consultation_fee: 600,
    location: 'Col. Condesa, CDMX'
  },
  {
    id: '3',
    display_name: 'Dra. Ana Martínez',
    provider_type: 'DERMATOLOGIST',
    organization_name: 'Instituto Dermatológico',
    avatar_url: 'https://images.unsplash.com/photo-1594824047323-65b2b4e20c9e?w=150&h=150&fit=crop&crop=face',
    license_number: 'DRM54321',
    bio: 'Dermatóloga certificada con especialización en dermatología estética y médica.',
    rating: 4.8,
    next_availability: 'Viernes, 2:30 PM',
    consultation_fee: 750,
    location: 'Col. Polanco, CDMX'
  },
  {
    id: '4',
    display_name: 'Dr. Roberto Silva',
    provider_type: 'PEDIATRICIAN',
    organization_name: 'Hospital Infantil',
    avatar_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    license_number: 'PDT98765',
    bio: 'Pediatra con amplia experiencia en atención infantil y adolescente.',
    rating: 4.9,
    next_availability: 'Lunes, 9:00 AM',
    consultation_fee: 650,
    location: 'Col. Del Valle, CDMX'
  }
];

const providerTypeLabels: Record<ProviderType, string> = {
  'GENERAL_DOCTOR': 'Médico General',
  'CARDIOLOGIST': 'Cardiólogo',
  'DERMATOLOGIST': 'Dermatólogo',
  'PEDIATRICIAN': 'Pediatra',
  'NEUROLOGIST': 'Neurólogo',
  'PSYCHIATRIST': 'Psiquiatra'
};

export default function BuscarProveedoresScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [selectedProviderType, setSelectedProviderType] = useState<ProviderType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filteredProviders, setFilteredProviders] = useState(mockProviders);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    let filtered = mockProviders;

    if (searchText) {
      filtered = filtered.filter(provider => 
        provider.display_name.toLowerCase().includes(searchText.toLowerCase()) ||
        provider.organization_name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedProviderType) {
      filtered = filtered.filter(provider => provider.provider_type === selectedProviderType);
    }

    if (selectedLocation) {
      filtered = filtered.filter(provider => 
        provider.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredProviders(filtered);
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedProviderType(null);
    setSelectedLocation('');
    setFilteredProviders(mockProviders);
  };

  const handleProviderSelect = (provider: Provider) => {
    router.push({
      pathname: '/consulta/consultorio/perfil-proveedor',
      params: { providerId: provider.id }
    });
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={14} color="#fbbf24" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={14} color="#fbbf24" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#fbbf24" />
      );
    }

    return stars;
  };

  const renderProvider = ({ item }: { item: Provider }) => (
    <TouchableOpacity 
      style={[styles.providerCard, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}
      onPress={() => handleProviderSelect(item)}
    >
      <View style={styles.providerHeader}>
        <Image 
          source={{ uri: item.avatar_url || 'https://via.placeholder.com/60' }}
          style={styles.avatar}
        />
        <View style={styles.providerInfo}>
          <ThemedText style={styles.providerName}>{item.display_name}</ThemedText>
          <ThemedText style={[styles.providerType, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            {providerTypeLabels[item.provider_type]}
          </ThemedText>
          {item.organization_name && (
            <ThemedText style={[styles.organizationName, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              {item.organization_name}
            </ThemedText>
          )}
        </View>
        <View style={styles.priceContainer}>
          <ThemedText style={[styles.price, { color: Colors.light.primary }]}>
            ${item.consultation_fee}
          </ThemedText>
        </View>
      </View>

      <View style={styles.providerDetails}>
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {renderStarRating(item.rating)}
          </View>
          <ThemedText style={[styles.ratingText, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            {item.rating} ({Math.floor(Math.random() * 50) + 10} reseñas)
          </ThemedText>
        </View>

        <View style={styles.availabilityContainer}>
          <Ionicons name="time-outline" size={16} color={Colors.light.primary} />
          <ThemedText style={[styles.availability, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            Disponible: {item.next_availability}
          </ThemedText>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={Colors.light.primary} />
          <ThemedText style={[styles.location, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            {item.location}
          </ThemedText>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.viewProfileButton, { backgroundColor: Colors.light.primary }]}
          onPress={() => handleProviderSelect(item)}
        >
          <ThemedText style={styles.viewProfileText}>Ver perfil</ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Buscar Proveedores</ThemedText>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}>
        <Ionicons name="search" size={20} color={Colors.light.primary} />
        <TextInput
          style={[styles.searchInput, {
            color: isDarkMode ? Colors.dark.text : Colors.light.text
          }]}
          placeholder="Buscar por nombre o clínica..."
          placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={[styles.filtersContainer, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterChip, {
                  backgroundColor: selectedProviderType === null ? Colors.light.primary : 'transparent',
                  borderColor: Colors.light.primary
                }]}
                onPress={() => setSelectedProviderType(null)}
              >
                <ThemedText style={[styles.filterChipText, {
                  color: selectedProviderType === null ? 'white' : Colors.light.primary
                }]}>
                  Todos
                </ThemedText>
              </TouchableOpacity>
              
              {Object.entries(providerTypeLabels).map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.filterChip, {
                    backgroundColor: selectedProviderType === key ? Colors.light.primary : 'transparent',
                    borderColor: Colors.light.primary
                  }]}
                  onPress={() => setSelectedProviderType(key as ProviderType)}
                >
                  <ThemedText style={[styles.filterChipText, {
                    color: selectedProviderType === key ? 'white' : Colors.light.primary
                  }]}>
                    {label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <ThemedText style={[styles.searchButtonText, { color: Colors.light.primary }]}>
                Buscar
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <ThemedText style={[styles.clearButtonText, { color: Colors.light.textSecondary }]}>
                Limpiar
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Results */}
      <View style={styles.resultsHeader}>
        <ThemedText style={styles.resultsCount}>
          {filteredProviders.length} proveedores encontrados
        </ThemedText>
      </View>

      <FlatList
        data={filteredProviders}
        renderItem={renderProvider}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.providersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={Colors.light.textSecondary} />
            <ThemedText style={[styles.emptyTitle, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              No se encontraron proveedores
            </ThemedText>
            <ThemedText style={[styles.emptyText, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              Intenta ajustar los filtros de búsqueda
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersContainer: {
    borderWidth: 1,
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  searchButton: {
    padding: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  providersList: {
    padding: 16,
    paddingTop: 8,
  },
  providerCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  providerType: {
    fontSize: 14,
    marginBottom: 2,
  },
  organizationName: {
    fontSize: 13,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  providerDetails: {
    gap: 8,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    fontSize: 13,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  availability: {
    fontSize: 13,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 13,
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  viewProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewProfileText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
}); 