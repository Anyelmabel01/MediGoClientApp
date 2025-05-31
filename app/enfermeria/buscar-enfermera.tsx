import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Dimensions, FlatList, Image, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Nurse = {
  id: string;
  name: string;
  photo: string;
  experience: number;
  specialties: string[];
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  nextAvailable: string;
  baseRate: number;
};

const nurses: Nurse[] = [
  {
    id: '1',
    name: 'Ana María González',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    experience: 8,
    specialties: ['Geriatría', 'Cuidados intensivos', 'Heridas'],
    rating: 4.9,
    reviewsCount: 127,
    isAvailable: true,
    nextAvailable: 'Hoy',
    baseRate: 350,
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    experience: 12,
    specialties: ['Administración de medicamentos', 'Rehabilitación'],
    rating: 4.8,
    reviewsCount: 203,
    isAvailable: false,
    nextAvailable: 'Mañana 09:00',
    baseRate: 400,
  },
  {
    id: '3',
    name: 'María Fernanda López',
    photo: 'https://images.unsplash.com/photo-1594824047323-65b2b4e20c9e?w=150&h=150&fit=crop&crop=face',
    experience: 5,
    specialties: ['Pediatría', 'Vacunación', 'Cuidados domiciliarios'],
    rating: 4.7,
    reviewsCount: 89,
    isAvailable: true,
    nextAvailable: 'Hoy',
    baseRate: 300,
  },
  {
    id: '4',
    name: 'Roberto Hernández',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    experience: 15,
    specialties: ['Cardiología', 'Diabetes', 'Hipertensión'],
    rating: 4.9,
    reviewsCount: 156,
    isAvailable: true,
    nextAvailable: 'Hoy',
    baseRate: 450,
  },
];

type SpecialtyFilter = 'all' | 'geriatria' | 'pediatria' | 'cardiologia' | 'heridas' | 'medicamentos';
type AvailabilityFilter = 'all' | 'available' | 'today' | 'tomorrow';

export default function BuscarEnfermeraScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyFilter>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityFilter>('all');

  const filteredNurses = nurses.filter(nurse => {
    const matchesSearch = nurse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nurse.specialties.some(specialty => specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === 'all' || 
                           nurse.specialties.some(specialty => {
                             switch (selectedSpecialty) {
                               case 'geriatria': return specialty.includes('Geriatría');
                               case 'pediatria': return specialty.includes('Pediatría');
                               case 'cardiologia': return specialty.includes('Cardiología');
                               case 'heridas': return specialty.includes('Heridas');
                               case 'medicamentos': return specialty.includes('medicamentos');
                               default: return true;
                             }
                           });

    const matchesAvailability = selectedAvailability === 'all' ||
                               (selectedAvailability === 'available' && nurse.isAvailable) ||
                               (selectedAvailability === 'today' && nurse.nextAvailable === 'Hoy') ||
                               (selectedAvailability === 'tomorrow' && nurse.nextAvailable.includes('Mañana'));

    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  const handleNursePress = (nurseId: string) => {
    router.push(`/enfermeria/perfil-enfermera/${nurseId}` as any);
  };

  const getSpecialtyLabel = (specialty: SpecialtyFilter) => {
    switch (specialty) {
      case 'all': return 'Todas';
      case 'geriatria': return 'Geriatría';
      case 'pediatria': return 'Pediatría';
      case 'cardiologia': return 'Cardiología';
      case 'heridas': return 'Heridas';
      case 'medicamentos': return 'Medicamentos';
    }
  };

  const getAvailabilityLabel = (availability: AvailabilityFilter) => {
    switch (availability) {
      case 'all': return 'Cualquier momento';
      case 'available': return 'Disponible ahora';
      case 'today': return 'Hoy';
      case 'tomorrow': return 'Mañana';
    }
  };

  const renderSpecialtyChip = (specialty: SpecialtyFilter) => (
    <TouchableOpacity
      key={specialty}
      style={[
        styles.filterChip,
        {
          backgroundColor: selectedSpecialty === specialty 
            ? Colors.light.primary 
            : (isDarkMode ? Colors.dark.border : Colors.light.border),
          borderColor: selectedSpecialty === specialty 
            ? Colors.light.primary 
            : (isDarkMode ? Colors.dark.border : Colors.light.border),
        }
      ]}
      onPress={() => setSelectedSpecialty(specialty)}
    >
      <ThemedText style={[
        styles.filterChipText,
        { 
          color: selectedSpecialty === specialty ? 'white' : (isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary)
        }
      ]}>
        {getSpecialtyLabel(specialty)}
      </ThemedText>
    </TouchableOpacity>
  );

  const renderAvailabilityChip = (availability: AvailabilityFilter) => (
    <TouchableOpacity
      key={availability}
      style={[
        styles.filterChip,
        {
          backgroundColor: selectedAvailability === availability 
            ? Colors.light.primary 
            : (isDarkMode ? Colors.dark.border : Colors.light.border),
          borderColor: selectedAvailability === availability 
            ? Colors.light.primary 
            : (isDarkMode ? Colors.dark.border : Colors.light.border),
        }
      ]}
      onPress={() => setSelectedAvailability(availability)}
    >
      <ThemedText style={[
        styles.filterChipText,
        { 
          color: selectedAvailability === availability ? 'white' : (isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary)
        }
      ]}>
        {getAvailabilityLabel(availability)}
      </ThemedText>
    </TouchableOpacity>
  );

  const renderNurseItem = ({ item }: { item: Nurse }) => (
    <TouchableOpacity 
      style={[styles.nurseCard, { 
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}
      onPress={() => handleNursePress(item.id)}
    >
      <Image source={{ uri: item.photo }} style={styles.nursePhoto} />
      <View style={styles.nurseInfo}>
        <View style={styles.nurseHeader}>
          <ThemedText style={styles.nurseName} numberOfLines={2}>{item.name}</ThemedText>
          <View style={styles.availabilityBadge}>
            <View style={[styles.availabilityDot, { 
              backgroundColor: item.isAvailable ? Colors.light.success : Colors.light.error 
            }]} />
            <ThemedText style={[styles.availabilityText, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]} numberOfLines={1}>{item.nextAvailable}</ThemedText>
          </View>
        </View>
        
        <View style={styles.experienceRatingContainer}>
          <ThemedText style={[styles.experience, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]} numberOfLines={1}>{item.experience} años de experiencia</ThemedText>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
            <ThemedText style={[styles.reviewsCount, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]} numberOfLines={1}>({item.reviewsCount})</ThemedText>
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.specialtiesContainer}
        >
          {item.specialties.map((specialty, index) => (
            <View key={index} style={[styles.specialtyTag, {
              backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.15)' : 'rgba(45, 127, 249, 0.1)'
            }]}>
              <ThemedText style={[styles.specialtyText, { color: Colors.light.primary }]}>
                {specialty}
              </ThemedText>
            </View>
          ))}
        </ScrollView>

        <View style={styles.priceContainer}>
          <ThemedText style={[styles.priceLabel, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>Desde</ThemedText>
          <ThemedText style={[styles.price, { color: Colors.light.primary }]}>
            ${item.baseRate}/hora
          </ThemedText>
        </View>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
      />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      
      {/* Header with blue background like main screen */}
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
                  {user?.nombre?.charAt(0) || 'U'}{user?.apellido?.charAt(0) || 'S'}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.greetingContainer}>
              <ThemedText style={styles.greeting}>
                Buscar Enfermera
              </ThemedText>
              <View style={styles.editProfileIndicator}>
                <Ionicons name="search" size={14} color={Colors.light.primary} />
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* Search Section */}
        <View style={[styles.searchContainer, {
          backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.white,
        }]}>
          <Ionicons name="search" size={20} color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} />
          <TextInput
            style={[styles.searchInput, {
              color: isDarkMode ? Colors.dark.text : Colors.light.text,
            }]}
            placeholder="Buscar por nombre o especialidad..."
            placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Specialty Filters */}
        <ThemedText style={styles.filterTitle}>Especialidad</ThemedText>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {(['all', 'geriatria', 'pediatria', 'cardiologia', 'heridas', 'medicamentos'] as SpecialtyFilter[]).map(renderSpecialtyChip)}
        </ScrollView>

        {/* Availability Filters */}
        <ThemedText style={styles.filterTitle}>Disponibilidad</ThemedText>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {(['all', 'available', 'today', 'tomorrow'] as AvailabilityFilter[]).map(renderAvailabilityChip)}
        </ScrollView>
        
        <View style={styles.resultsHeader}>
          <ThemedText style={styles.resultsCount}>
            {filteredNurses.length} enfermera{filteredNurses.length !== 1 ? 's' : ''} encontrada{filteredNurses.length !== 1 ? 's' : ''}
          </ThemedText>
        </View>
        
        <FlatList
          data={filteredNurses}
          renderItem={renderNurseItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.nursesList}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    minHeight: 32,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.primary,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
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
  resultsHeader: {
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  nursesList: {
    paddingBottom: 20,
  },
  nurseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.light.white,
  },
  nursePhoto: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 16,
  },
  nurseInfo: {
    flex: 1,
  },
  nurseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  nurseName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  experienceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  experience: {
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviewsCount: {
    fontSize: 14,
    marginLeft: 4,
  },
  specialtiesContainer: {
    marginBottom: 8,
    maxHeight: 35,
  },
  specialtyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  specialtyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 13,
    marginRight: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
  },
}); 