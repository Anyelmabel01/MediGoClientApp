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

// Login color palette
const PRIMARY_COLOR = '#00A0B0';
const PRIMARY_LIGHT = '#33b5c2';
const PRIMARY_DARK = '#006070';
const ACCENT_COLOR = '#70D0E0';

type SpecialtyType = 'CARDIOLOGY' | 'DERMATOLOGY' | 'GENERAL_MEDICINE' | 'PSYCHOLOGY' | 'NEUROLOGY' | 'PEDIATRICS';
type LanguageType = 'SPANISH' | 'ENGLISH' | 'FRENCH';

type VirtualSpecialist = {
  id: string;
  display_name: string;
  specialty: SpecialtyType;
  bio: string;
  avatar_url?: string;
  next_availability: string;
  rating: number;
  consultation_fee: number;
  languages: LanguageType[];
  available_today: boolean;
  years_experience: number;
};

const specialtyLabels: Record<SpecialtyType, string> = {
  'CARDIOLOGY': 'Cardiología',
  'DERMATOLOGY': 'Dermatología',
  'GENERAL_MEDICINE': 'Medicina General',
  'PSYCHOLOGY': 'Psicología',
  'NEUROLOGY': 'Neurología',
  'PEDIATRICS': 'Pediatría'
};

const languageLabels: Record<LanguageType, string> = {
  'SPANISH': 'Español',
  'ENGLISH': 'Inglés',
  'FRENCH': 'Francés'
};

const mockSpecialists: VirtualSpecialist[] = [
  {
    id: '1',
    display_name: 'Dr. Carlos Mendoza',
    specialty: 'CARDIOLOGY',
    bio: 'Cardiólogo con 10 años de experiencia en telemedicina y diagnóstico cardiovascular',
    avatar_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    next_availability: 'Hoy, 2:00 PM',
    rating: 4.8,
    consultation_fee: 750,
    languages: ['SPANISH', 'ENGLISH'],
    available_today: true,
    years_experience: 10
  },
  {
    id: '2',
    display_name: 'Dra. María Fernández',
    specialty: 'GENERAL_MEDICINE',
    bio: 'Especialista en medicina familiar virtual con enfoque en atención primaria',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    next_availability: 'Mañana, 10:00 AM',
    rating: 4.9,
    consultation_fee: 600,
    languages: ['SPANISH'],
    available_today: false,
    years_experience: 8
  },
  {
    id: '3',
    display_name: 'Dr. Roberto Silva',
    specialty: 'DERMATOLOGY',
    bio: 'Dermatólogo especializado en consultas virtuales y diagnóstico por imagen',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    next_availability: 'Hoy, 4:30 PM',
    rating: 4.7,
    consultation_fee: 700,
    languages: ['SPANISH', 'ENGLISH'],
    available_today: true,
    years_experience: 12
  },
  {
    id: '4',
    display_name: 'Dra. Ana López',
    specialty: 'PSYCHOLOGY',
    bio: 'Psicóloga clínica especializada en terapia online y salud mental',
    avatar_url: 'https://images.unsplash.com/photo-1594824047323-65b2b4e20c9e?w=150&h=150&fit=crop&crop=face',
    next_availability: 'Hoy, 6:00 PM',
    rating: 4.9,
    consultation_fee: 550,
    languages: ['SPANISH', 'FRENCH'],
    available_today: true,
    years_experience: 7
  },
  {
    id: '5',
    display_name: 'Dr. Miguel Torres',
    specialty: 'NEUROLOGY',
    bio: 'Neurólogo con experiencia en consultas virtuales y diagnóstico neurológico',
    avatar_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    next_availability: 'Mañana, 3:00 PM',
    rating: 4.6,
    consultation_fee: 800,
    languages: ['SPANISH', 'ENGLISH'],
    available_today: false,
    years_experience: 15
  }
];

export default function BuscarEspecialistasScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyType | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType | null>(null);
  const [availableToday, setAvailableToday] = useState(false);
  const [filteredSpecialists, setFilteredSpecialists] = useState(mockSpecialists);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    let filtered = mockSpecialists;

    if (searchText) {
      filtered = filtered.filter(specialist => 
        specialist.display_name.toLowerCase().includes(searchText.toLowerCase()) ||
        specialist.bio.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(specialist => specialist.specialty === selectedSpecialty);
    }

    if (selectedLanguage) {
      filtered = filtered.filter(specialist => specialist.languages.includes(selectedLanguage));
    }

    if (availableToday) {
      filtered = filtered.filter(specialist => specialist.available_today);
    }

    setFilteredSpecialists(filtered);
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedSpecialty(null);
    setSelectedLanguage(null);
    setAvailableToday(false);
    setFilteredSpecialists(mockSpecialists);
  };

  const handleSpecialistPress = (specialist: VirtualSpecialist) => {
    router.push({
      pathname: '/consulta/telemedicina/perfil-especialista',
      params: { specialistId: specialist.id }
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

  const renderSpecialist = ({ item }: { item: VirtualSpecialist }) => (
    <TouchableOpacity 
      style={[styles.specialistCard, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}
      onPress={() => handleSpecialistPress(item)}
    >
      <View style={styles.specialistHeader}>
        <Image 
          source={{ uri: item.avatar_url || 'https://via.placeholder.com/80' }}
          style={styles.avatar}
        />
        <View style={styles.specialistInfo}>
          <View style={styles.nameRow}>
            <ThemedText style={styles.specialistName}>{item.display_name}</ThemedText>
            {item.available_today && (
              <View style={[styles.availableBadge, { backgroundColor: Colors.light.success }]}>
                <ThemedText style={styles.availableText}>Disponible hoy</ThemedText>
              </View>
            )}
          </View>
          <ThemedText style={[styles.specialty, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            {specialtyLabels[item.specialty]}
          </ThemedText>
          <ThemedText style={[styles.experience, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            {item.years_experience} años de experiencia
          </ThemedText>
        </View>
        <View style={styles.priceContainer}>
          <ThemedText style={[styles.price, { color: PRIMARY_COLOR }]}>
            ${item.consultation_fee}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={[styles.bio, {
        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
      }]} numberOfLines={2}>
        {item.bio}
      </ThemedText>

      <View style={styles.detailsRow}>
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

        <View style={styles.languagesContainer}>
          {item.languages.map((lang, index) => (
            <View key={index} style={[styles.languageChip, { backgroundColor: ACCENT_COLOR + '30' }]}>
              <ThemedText style={[styles.languageText, { color: PRIMARY_DARK }]}>
                {languageLabels[lang]}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.availabilityRow}>
        <View style={styles.availabilityInfo}>
          <Ionicons name="time-outline" size={16} color={PRIMARY_COLOR} />
          <ThemedText style={[styles.availabilityText, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            Próxima disponibilidad: {item.next_availability}
          </ThemedText>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.viewProfileButton, { backgroundColor: PRIMARY_COLOR }]}
          onPress={() => handleSpecialistPress(item)}
        >
          <ThemedText style={styles.viewProfileText}>Ver perfil completo</ThemedText>
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
          <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Buscar Especialistas</ThemedText>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, {
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}>
        <Ionicons name="search" size={20} color={PRIMARY_COLOR} />
        <TextInput
          style={[styles.searchInput, {
            color: isDarkMode ? Colors.dark.text : Colors.light.text
          }]}
          placeholder="Buscar por nombre o especialidad..."
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
          <ThemedText style={styles.filterTitle}>Filtros</ThemedText>
          
          {/* Specialty Filter */}
          <View style={styles.filterSection}>
            <ThemedText style={styles.filterLabel}>Especialidad</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={[styles.filterChip, {
                    backgroundColor: selectedSpecialty === null ? PRIMARY_COLOR : 'transparent',
                    borderColor: PRIMARY_COLOR
                  }]}
                  onPress={() => setSelectedSpecialty(null)}
                >
                  <ThemedText style={[styles.filterChipText, {
                    color: selectedSpecialty === null ? 'white' : PRIMARY_COLOR
                  }]}>
                    Todas
                  </ThemedText>
                </TouchableOpacity>
                
                {Object.entries(specialtyLabels).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.filterChip, {
                      backgroundColor: selectedSpecialty === key ? PRIMARY_COLOR : 'transparent',
                      borderColor: PRIMARY_COLOR
                    }]}
                    onPress={() => setSelectedSpecialty(key as SpecialtyType)}
                  >
                    <ThemedText style={[styles.filterChipText, {
                      color: selectedSpecialty === key ? 'white' : PRIMARY_COLOR
                    }]}>
                      {label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Language Filter */}
          <View style={styles.filterSection}>
            <ThemedText style={styles.filterLabel}>Idioma</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={[styles.filterChip, {
                    backgroundColor: selectedLanguage === null ? PRIMARY_COLOR : 'transparent',
                    borderColor: PRIMARY_COLOR
                  }]}
                  onPress={() => setSelectedLanguage(null)}
                >
                  <ThemedText style={[styles.filterChipText, {
                    color: selectedLanguage === null ? 'white' : PRIMARY_COLOR
                  }]}>
                    Todos
                  </ThemedText>
                </TouchableOpacity>
                
                {Object.entries(languageLabels).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.filterChip, {
                      backgroundColor: selectedLanguage === key ? PRIMARY_COLOR : 'transparent',
                      borderColor: PRIMARY_COLOR
                    }]}
                    onPress={() => setSelectedLanguage(key as LanguageType)}
                  >
                    <ThemedText style={[styles.filterChipText, {
                      color: selectedLanguage === key ? 'white' : PRIMARY_COLOR
                    }]}>
                      {label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Availability Filter */}
          <View style={styles.filterSection}>
            <TouchableOpacity 
              style={styles.availabilityFilter}
              onPress={() => setAvailableToday(!availableToday)}
            >
              <Ionicons 
                name={availableToday ? "checkbox" : "square-outline"} 
                size={20} 
                color={PRIMARY_COLOR} 
              />
              <ThemedText style={styles.availabilityFilterText}>
                Solo disponibles hoy
              </ThemedText>
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <ThemedText style={[styles.searchButtonText, { color: PRIMARY_COLOR }]}>
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
          {filteredSpecialists.length} especialistas encontrados
        </ThemedText>
      </View>

      <FlatList
        data={filteredSpecialists}
        renderItem={renderSpecialist}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.specialistsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={Colors.light.textSecondary} />
            <ThemedText style={[styles.emptyTitle, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              No se encontraron especialistas
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
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
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
  availabilityFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityFilterText: {
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
  specialistsList: {
    padding: 16,
    paddingTop: 8,
  },
  specialistCard: {
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
  specialistHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  specialistInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  specialistName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  availableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  availableText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  specialty: {
    fontSize: 14,
    marginBottom: 2,
  },
  experience: {
    fontSize: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  detailsRow: {
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    fontSize: 13,
  },
  languagesContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  languageChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  languageText: {
    fontSize: 11,
    fontWeight: '600',
  },
  availabilityRow: {
    marginBottom: 16,
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  availabilityText: {
    fontSize: 13,
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  viewProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
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