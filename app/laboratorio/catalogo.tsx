import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

import { useMemo, useState } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const { width } = Dimensions.get('window');

type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  count: number;
};

type Test = {
  id: string;
  name: string;
  description: string;
  price: number;
  preparationRequired: boolean;
  category: string;
  sampleType: string;
  resultTime: string;
  popularityScore: number;
  homeCollection: boolean;
  tags: string[];
};

const categories: Category[] = [
  { id: 'all', name: 'Todos', icon: 'apps', color: '#00A0B0', count: 0 },
  { id: 'blood', name: 'Sangre', icon: 'water', color: '#e74c3c', count: 25 },
  { id: 'urine', name: 'Orina', icon: 'flask', color: '#f39c12', count: 8 },
  { id: 'imaging', name: 'Imagen', icon: 'scan', color: '#9b59b6', count: 12 },
  { id: 'special', name: 'Especiales', icon: 'star', color: '#e91e63', count: 15 },
  { id: 'packages', name: 'Paquetes', icon: 'albums', color: '#27ae60', count: 6 },
];

const allTests: Test[] = [
  // Pruebas de Sangre
  {
    id: '1',
    name: 'Glucosa en Ayunas',
    description: 'Mide el nivel de glucosa en sangre después del ayuno para detectar diabetes.',
    price: 120,
    preparationRequired: true,
    category: 'blood',
    sampleType: 'Sangre venosa',
    resultTime: '24 horas',
    popularityScore: 95,
    homeCollection: true,
    tags: ['diabetes', 'ayuno', 'glucosa', 'sangre']
  },
  {
    id: '2',
    name: 'Perfil Lipídico Completo',
    description: 'Evalúa colesterol total, HDL, LDL y triglicéridos para riesgo cardiovascular.',
    price: 280,
    preparationRequired: true,
    category: 'blood',
    sampleType: 'Sangre venosa',
    resultTime: '24-48 horas',
    popularityScore: 88,
    homeCollection: true,
    tags: ['colesterol', 'corazón', 'lipidos', 'cardiovascular']
  },
  {
    id: '3',
    name: 'Biometría Hemática Completa',
    description: 'Análisis completo de células sanguíneas: glóbulos rojos, blancos y plaquetas.',
    price: 180,
    preparationRequired: false,
    category: 'blood',
    sampleType: 'Sangre venosa',
    resultTime: '6-24 horas',
    popularityScore: 92,
    homeCollection: true,
    tags: ['sangre', 'hemoglobina', 'leucocitos', 'plaquetas']
  },
  {
    id: '4',
    name: 'Función Tiroidea (TSH, T3, T4)',
    description: 'Evalúa el funcionamiento de la glándula tiroides.',
    price: 350,
    preparationRequired: false,
    category: 'blood',
    sampleType: 'Sangre venosa',
    resultTime: '24-48 horas',
    popularityScore: 78,
    homeCollection: true,
    tags: ['tiroides', 'tsh', 't3', 't4', 'hormona']
  },
  {
    id: '5',
    name: 'Química Sanguínea 6 elementos',
    description: 'Glucosa, urea, creatinina, ácido úrico, colesterol y triglicéridos.',
    price: 220,
    preparationRequired: true,
    category: 'blood',
    sampleType: 'Sangre venosa',
    resultTime: '24 horas',
    popularityScore: 85,
    homeCollection: true,
    tags: ['glucosa', 'urea', 'creatinina', 'riñón']
  },
  // Pruebas de Orina
  {
    id: '6',
    name: 'Examen General de Orina',
    description: 'Análisis físico, químico y microscópico de la orina.',
    price: 80,
    preparationRequired: false,
    category: 'urine',
    sampleType: 'Orina',
    resultTime: '6-12 horas',
    popularityScore: 90,
    homeCollection: false,
    tags: ['orina', 'infección', 'riñón', 'proteínas']
  },
  {
    id: '7',
    name: 'Urocultivo',
    description: 'Detecta bacterias en orina para diagnóstico de infecciones urinarias.',
    price: 150,
    preparationRequired: false,
    category: 'urine',
    sampleType: 'Orina estéril',
    resultTime: '48-72 horas',
    popularityScore: 75,
    homeCollection: false,
    tags: ['infección', 'bacteria', 'urinaria', 'cultivo']
  },
  // Pruebas de Imagen
  {
    id: '8',
    name: 'Radiografía de Tórax',
    description: 'Evaluación de pulmones, corazón y estructuras torácicas.',
    price: 200,
    preparationRequired: false,
    category: 'imaging',
    sampleType: 'Imagen',
    resultTime: '2-4 horas',
    popularityScore: 82,
    homeCollection: false,
    tags: ['radiografía', 'pulmones', 'tórax', 'corazón']
  },
  {
    id: '9',
    name: 'Ultrasonido Abdominal',
    description: 'Evaluación de órganos abdominales: hígado, vesícula, riñones, páncreas.',
    price: 450,
    preparationRequired: true,
    category: 'imaging',
    sampleType: 'Imagen',
    resultTime: '2-6 horas',
    popularityScore: 70,
    homeCollection: false,
    tags: ['ultrasonido', 'abdomen', 'hígado', 'riñón']
  },
  // Pruebas Especiales
  {
    id: '10',
    name: 'Antígeno Prostático (PSA)',
    description: 'Marcador para detección temprana de cáncer de próstata.',
    price: 320,
    preparationRequired: false,
    category: 'special',
    sampleType: 'Sangre venosa',
    resultTime: '24-48 horas',
    popularityScore: 65,
    homeCollection: true,
    tags: ['próstata', 'psa', 'cáncer', 'hombre']
  },
  {
    id: '11',
    name: 'Papanicolaou',
    description: 'Detección de células anormales en el cuello uterino.',
    price: 180,
    preparationRequired: false,
    category: 'special',
    sampleType: 'Citología',
    resultTime: '3-5 días',
    popularityScore: 80,
    homeCollection: false,
    tags: ['papanicolaou', 'cuello uterino', 'mujer', 'cáncer']
  },
  // Paquetes
  {
    id: '12',
    name: 'Chequeo Ejecutivo Completo',
    description: 'Incluye biometría, química sanguínea, función tiroidea, lipídos y más.',
    price: 890,
    preparationRequired: true,
    category: 'packages',
    sampleType: 'Múltiple',
    resultTime: '48-72 horas',
    popularityScore: 95,
    homeCollection: true,
    tags: ['paquete', 'completo', 'ejecutivo', 'preventivo']
  },
  {
    id: '13',
    name: 'Perfil Femenino',
    description: 'Paquete diseñado para la salud integral de la mujer.',
    price: 650,
    preparationRequired: true,
    category: 'packages',
    sampleType: 'Múltiple',
    resultTime: '48-72 horas',
    popularityScore: 88,
    homeCollection: false,
    tags: ['mujer', 'femenino', 'hormona', 'preventivo']
  }
];

export default function CatalogoScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popularity'>('popularity');
  const [showFilters, setShowFilters] = useState(false);

  // Actualizar conteos por categoría
  const categoriesWithCounts = useMemo(() => {
    return categories.map(category => ({
      ...category,
      count: category.id === 'all' 
        ? allTests.length 
        : allTests.filter(test => test.category === category.id).length
    }));
  }, []);

  const filteredTests = useMemo(() => {
    let filtered = allTests.filter(test => {
      // Filtro por categoría
      const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
      
      // Filtro por búsqueda
      const matchesSearch = searchQuery === '' || 
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'popularity':
          return b.popularityScore - a.popularityScore;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleTestPress = (test: Test) => {
    router.push({
      pathname: '/laboratorio/detallesPrueba',
      params: { testId: test.id, nombrePrueba: test.name }
    });
  };

  const handleBookTest = (test: Test) => {
    router.push({
      pathname: '/laboratorio/solicitar',
      params: { testId: test.id, nombrePrueba: test.name }
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('popularity');
  };

  const handleBackPress = () => {
    router.push('/laboratorio');
  };

  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
            </TouchableOpacity>
            
            <View style={styles.greetingContainer}>
              <ThemedText style={styles.greeting}>
                Catálogo de Pruebas
              </ThemedText>
              <View style={styles.editProfileIndicator}>
                <Ionicons name="flask" size={14} color={Colors.light.primary} />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons name="filter" size={20} color={Colors.light.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Búsqueda */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { 
            backgroundColor: colors.background, 
            borderColor: colors.border 
          }]}>
            <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Buscar prueba, examen o síntoma"
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categorías en grid */}
        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesGrid}>
            {categoriesWithCounts.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  { 
                    backgroundColor: selectedCategory === category.id ? category.color : colors.background,
                    borderColor: selectedCategory === category.id ? category.color : colors.border
                  }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={[
                  styles.categoryIconContainer,
                  { backgroundColor: selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : `${category.color}15` }
                ]}>
                  <Ionicons 
                    name={category.icon} 
                    size={20} 
                    color={selectedCategory === category.id ? '#fff' : category.color} 
                  />
                </View>
                <ThemedText style={[
                  styles.categoryLabel,
                  { color: selectedCategory === category.id ? '#fff' : colors.text }
                ]}>
                  {category.name}
                </ThemedText>
                {category.id !== 'all' && (
                  <ThemedText style={[
                    styles.categoryCount,
                    { color: selectedCategory === category.id ? '#fff' : colors.textSecondary }
                  ]}>
                    {category.count}
                  </ThemedText>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Resultados */}
        <View style={styles.resultsHeader}>
          <ThemedText style={styles.resultsCount}>
            {filteredTests.length} prueba{filteredTests.length !== 1 ? 's' : ''} encontrada{filteredTests.length !== 1 ? 's' : ''}
          </ThemedText>
        </View>

        {/* Lista de pruebas */}
        <FlatList
          data={filteredTests}
          keyExtractor={(item: Test) => item.id}
          contentContainerStyle={{ 
            paddingHorizontal: 16, 
            paddingBottom: insets.bottom + 20,
            flexGrow: filteredTests.length === 0 ? 1 : undefined
          }}
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          renderItem={({ item }: { item: Test }) => (
            <TouchableOpacity 
              style={[styles.testCard, { 
                backgroundColor: colors.background,
                borderColor: colors.border 
              }]}
              onPress={() => handleTestPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.testCardHeader}>
                <View style={styles.testInfo}>
                  <View style={styles.testTitleRow}>
                    <View style={styles.testIconContainer}>
                      <Ionicons 
                        name={item.category === 'blood' ? 'water' : 
                              item.category === 'urine' ? 'flask' :
                              item.category === 'imaging' ? 'scan' :
                              item.category === 'special' ? 'star' :
                              item.category === 'packages' ? 'albums' : 'medical'} 
                        size={18} 
                        color={Colors.light.primary} 
                      />
                    </View>
                    <ThemedText style={styles.testName}>{item.name}</ThemedText>
                  </View>
                  <ThemedText style={[styles.testDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                    {item.description}
                  </ThemedText>
                </View>
                <View style={styles.testMeta}>
                  <ThemedText style={[styles.testPrice, { color: colors.primary }]}>
                    Bs {item.price.toLocaleString()} VED
                  </ThemedText>
                  {item.preparationRequired && (
                    <View style={styles.preparationIndicator}>
                      <Ionicons name="alert-circle-outline" size={12} color="#f39c12" />
                      <ThemedText style={[styles.preparationText, { color: '#f39c12' }]}>
                        Preparación
                      </ThemedText>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.testCardDetails}>
                <View style={styles.testAttributes}>
                  <View style={styles.testAttribute}>
                    <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                    <ThemedText style={[styles.attributeText, { color: colors.textSecondary }]}>
                      {item.resultTime}
                    </ThemedText>
                  </View>
                  <View style={styles.testAttribute}>
                    <Ionicons name="flask-outline" size={12} color={colors.textSecondary} />
                    <ThemedText style={[styles.attributeText, { color: colors.textSecondary }]}>
                      {item.sampleType}
                    </ThemedText>
                  </View>
                  {item.homeCollection && (
                    <View style={styles.testAttribute}>
                      <Ionicons name="home-outline" size={12} color={colors.success} />
                      <ThemedText style={[styles.attributeText, { color: colors.success }]}>
                        A domicilio
                      </ThemedText>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.bookButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleBookTest(item)}
                >
                  <Ionicons name="calendar-outline" size={14} color="#fff" />
                  <ThemedText style={styles.bookButtonText}>Agendar</ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          style={styles.testsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color={colors.textSecondary} />
              <ThemedText style={[styles.emptyStateTitle, { color: colors.text }]}>
                No se encontraron pruebas
              </ThemedText>
              <ThemedText style={[styles.emptyStateMessage, { color: colors.textSecondary }]}>
                Intenta ajustar tus filtros de búsqueda o explora diferentes categorías
              </ThemedText>
              <TouchableOpacity
                style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
                onPress={clearFilters}
              >
                <ThemedText style={styles.emptyStateButtonText}>Limpiar filtros</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        />
      </ThemedView>
    </>
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
  filterButton: {
    padding: 8,
    marginLeft: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    paddingVertical: 0,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginTop: 2,
    marginBottom: 2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    width: '48%',
    minHeight: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 10,
    fontWeight: '500',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  testsList: {
    flex: 1,
  },
  testCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  testCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  testInfo: {
    flex: 1,
    marginRight: 12,
  },
  testTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  testIconContainer: {
    marginRight: 8,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    padding: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  testName: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  testDescription: {
    fontSize: 11,
    lineHeight: 14,
  },
  testMeta: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  testPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'right',
  },
  preparationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preparationText: {
    fontSize: 9,
    marginLeft: 2,
    fontWeight: '500',
  },
  testCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  testAttributes: {
    flex: 1,
  },
  testAttribute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  attributeText: {
    fontSize: 10,
    marginLeft: 3,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 