import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

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

type FilterOption = {
  id: SpecialtyType | 'ALL';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
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

const filterOptions: FilterOption[] = [
  { id: 'ALL', label: 'Todos', icon: 'medical-outline' },
  { id: 'CARDIOLOGY', label: 'Cardiología', icon: 'heart-outline' },
  { id: 'GENERAL_MEDICINE', label: 'Medicina General', icon: 'person-outline' },
  { id: 'DERMATOLOGY', label: 'Dermatología', icon: 'body-outline' },
  { id: 'PSYCHOLOGY', label: 'Psicología', icon: 'fitness-outline' },
];

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
  const [searchText, setSearchText] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyType | 'ALL'>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType | null>(null);
  const [availableToday, setAvailableToday] = useState(false);

  const filteredSpecialists = mockSpecialists.filter(specialist => {
    // Aplicar filtro de búsqueda por texto
    const matchesSearch = searchText ? 
      specialist.display_name.toLowerCase().includes(searchText.toLowerCase()) ||
      specialist.bio.toLowerCase().includes(searchText.toLowerCase()) ||
      specialtyLabels[specialist.specialty].toLowerCase().includes(searchText.toLowerCase())
      : true;
    
    // Aplicar filtro de especialidad
    const matchesSpecialty = selectedSpecialty === 'ALL' || specialist.specialty === selectedSpecialty;
    
    // Aplicar filtro de idioma
    const matchesLanguage = selectedLanguage ? specialist.languages.includes(selectedLanguage) : true;
    
    // Aplicar filtro de disponibilidad hoy
    const matchesAvailability = availableToday ? specialist.available_today : true;
    
    return matchesSearch && matchesSpecialty && matchesLanguage && matchesAvailability;
  });

  const handleSpecialistPress = (specialist: VirtualSpecialist) => {
    router.push({
      pathname: '/consulta/telemedicina/perfil-especialista',
      params: { specialistId: specialist.id }
    });
  };

  const renderStarRating = (rating: number, size: number = 14) => {
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

  const renderFilterOption = ({ item }: { item: FilterOption }) => (
    <TouchableOpacity
      style={[
        styles.filterOption,
        selectedSpecialty === item.id ? styles.filterOptionSelected : null,
      ]}
      onPress={() => setSelectedSpecialty(item.id)}
    >
      <Ionicons
        name={item.icon}
        size={20}
        color={selectedSpecialty === item.id ? Colors.light.white : Colors.light.primary}
      />
      <Text
        style={[
          styles.filterText,
          selectedSpecialty === item.id ? styles.filterTextSelected : null,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderSpecialist = ({ item }: { item: VirtualSpecialist }) => (
    <TouchableOpacity 
      style={styles.specialistCard}
      onPress={() => handleSpecialistPress(item)}
    >
      <View style={styles.specialistHeader}>
        <Image 
          source={{ uri: item.avatar_url || 'https://via.placeholder.com/80' }}
          style={styles.specialistAvatar}
        />
        <View style={styles.specialistInfo}>
          <ThemedText style={styles.specialistName}>{item.display_name}</ThemedText>
          <ThemedText style={styles.specialty}>
            {specialtyLabels[item.specialty]}
          </ThemedText>
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {renderStarRating(item.rating, 12)}
            </View>
            <ThemedText style={styles.rating}>
              {item.rating} ({item.years_experience} años exp.)
            </ThemedText>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <ThemedText style={styles.price}>
            ${item.consultation_fee}
          </ThemedText>
          <ThemedText style={styles.priceLabel}>
            consulta
          </ThemedText>
        </View>
      </View>

      <ThemedText style={styles.bio} numberOfLines={2}>
        {item.bio}
      </ThemedText>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={14} color={Colors.light.success} />
          <ThemedText style={styles.detailText}>
            {item.next_availability}
          </ThemedText>
          {item.available_today && (
            <View style={styles.availableBadge}>
              <ThemedText style={styles.availableText}>Hoy</ThemedText>
            </View>
          )}
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="language-outline" size={14} color={Colors.light.primary} />
          <ThemedText style={styles.detailText}>
            {item.languages.map(lang => languageLabels[lang]).join(', ')}
          </ThemedText>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={styles.consultButton}
          onPress={(e) => {
            e.stopPropagation();
            router.push({
              pathname: '/consulta/telemedicina/sala-espera',
              params: { specialistId: item.id }
            });
          }}
        >
          <ThemedText style={styles.consultButtonText}>Consultar Ahora</ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header simplificado con botón de atrás */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Buscar Especialistas</ThemedText>
        </View>
      </View>
      
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o especialidad"
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={Colors.light.textSecondary}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros horizontales */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={filterOptions}
          renderItem={renderFilterOption}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Lista de especialistas */}
      <FlatList
        data={filteredSpecialists}
        renderItem={renderSpecialist}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.specialistsList}
        showsVerticalScrollIndicator={false}
      />
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
    paddingTop: 45,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.white,
    marginLeft: 16,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
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
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  filterOptionSelected: {
    backgroundColor: Colors.light.primary,
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.light.primary,
  },
  filterTextSelected: {
    color: Colors.light.white,
  },
  specialistsList: {
    padding: 16,
    paddingBottom: 100,
  },
  specialistCard: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  specialistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  specialistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  specialistInfo: {
    flex: 1,
  },
  specialistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 2,
  },
  specialty: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 4,
  },
  rating: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  bio: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  detailsContainer: {
    marginTop: 8,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  availableBadge: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  availableText: {
    color: Colors.light.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 12,
    alignItems: 'flex-end',
  },
  consultButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  consultButtonText: {
    color: Colors.light.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 