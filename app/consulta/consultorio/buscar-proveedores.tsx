import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  icon: string;
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
    consultation_fee: 800,
    location: 'Col. Roma Norte',
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
    consultation_fee: 600,
    location: 'Col. Condesa',
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
    consultation_fee: 750,
    location: 'Col. Polanco',
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
    consultation_fee: 550,
    location: 'Col. Del Valle',
    distance: '4.2 km'
  }
];

export default function BuscarProveedoresScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ProviderType>('ALL');

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

  const renderStarRating = (rating: number, size: number = 12) => {
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

  const renderProvider = ({ item }: { item: Provider }) => (
    <TouchableOpacity 
      style={styles.providerCard}
      onPress={() => handleProviderSelect(item)}
      activeOpacity={0.7}
    >
      {/* Header compacto */}
      <View style={styles.cardHeader}>
        <Image 
          source={{ uri: item.avatar_url || 'https://via.placeholder.com/50' }}
          style={styles.avatar}
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
            ${item.consultation_fee}
          </Text>
          <Text style={styles.priceLabel}>
            consulta
          </Text>
        </View>
      </View>

      {/* Detalles compactos */}
      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={14} color={COLORS.success} />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.next_availability}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={14} color={COLORS.primary} />
          <Text style={styles.detailText} numberOfLines={1}>
            {item.location} • {item.distance}
          </Text>
        </View>
      </View>

      {/* Footer compacto */}
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
          <Ionicons name="calendar" size={14} color="white" />
          <Text style={styles.quickBookText}>
            Agendar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => handleProviderSelect(item)}
        >
          <Text style={styles.profileButtonText}>
            Ver perfil
          </Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFilter = ({ item }: { item: FilterOption }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedFilter === item.id && styles.selectedFilterChip
      ]}
      onPress={() => setSelectedFilter(item.id)}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={item.icon as any} 
        size={16} 
        color={selectedFilter === item.id ? COLORS.white : COLORS.primary} 
      />
      <Text style={[
        styles.filterText,
        { color: selectedFilter === item.id ? COLORS.white : COLORS.primary }
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header compacto */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Buscar Proveedores</Text>
        <TouchableOpacity style={styles.filterToggle}>
          <Ionicons name="options-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda compacta */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar médico o especialidad..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros horizontales compactos */}
      <View style={styles.filtersSection}>
        <FlatList
          data={filterOptions}
          renderItem={renderFilter}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        />
      </View>

      {/* Resultados */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredProviders.length} proveedores encontrados
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="swap-vertical" size={16} color={COLORS.primary} />
          <Text style={styles.sortText}>Ordenar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de proveedores */}
      <FlatList
        data={filteredProviders}
        renderItem={renderProvider}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.providersList}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>
              No se encontraron proveedores
            </Text>
            <Text style={styles.emptyText}>
              Intenta cambiar los filtros o términos de búsqueda
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  filterToggle: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  filtersSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filtersContainer: {
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    gap: 4,
  },
  selectedFilterChip: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  providersList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  providerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    color: COLORS.textPrimary,
  },
  providerType: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  priceLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  cardDetails: {
    gap: 4,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  quickBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  quickBookText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profileButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
