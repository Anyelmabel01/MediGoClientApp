import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';

// Tipos
interface Medicine {
  id: string;
  name: string;
  presentation: string;
  price: number;
  description: string;
  category: string;
  prescription: boolean;
  available: boolean;
  pharmacy: string;
}

// Datos de ejemplo
const medicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    presentation: 'Caja con 20 tabletas',
    price: 120,
    description: 'Para aliviar el dolor leve a moderado y reducir la fiebre',
    category: '1',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '2',
    name: 'Ibuprofeno 400mg',
    presentation: 'Caja con 10 tabletas',
    price: 150,
    description: 'Antiinflamatorio no esteroideo para dolor y fiebre',
    category: '3',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '3',
    name: 'Complejo B',
    presentation: 'Frasco con 30 tabletas',
    price: 180,
    description: 'Suplemento vitamínico para mejorar la energía',
    category: '5',
    prescription: false,
    available: false,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '4',
    name: 'Loratadina 10mg',
    presentation: 'Caja con 10 tabletas',
    price: 130,
    description: 'Antihistamínico para alergias',
    category: '4',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '5',
    name: 'Aspirina 500mg',
    presentation: 'Caja con 20 tabletas',
    price: 110,
    description: 'Analgésico y antiinflamatorio',
    category: '1',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '6',
    name: 'Naproxeno 550mg',
    presentation: 'Caja con 10 tabletas',
    price: 160,
    description: 'Antiinflamatorio de acción prolongada',
    category: '3',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '7',
    name: 'Cetirizina 10mg',
    presentation: 'Caja con 10 tabletas',
    price: 140,
    description: 'Antihistamínico de segunda generación',
    category: '4',
    prescription: false,
    available: false,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '8',
    name: 'Vitamina C 1000mg',
    presentation: 'Frasco con 30 tabletas',
    price: 200,
    description: 'Suplemento vitamínico para el sistema inmune',
    category: '5',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '9',
    name: 'Amoxicilina 500mg',
    presentation: 'Caja con 21 cápsulas',
    price: 250,
    description: 'Antibiótico de amplio espectro',
    category: '2',
    prescription: true,
    available: true,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '10',
    name: 'Ciprofloxacina 500mg',
    presentation: 'Caja con 14 tabletas',
    price: 280,
    description: 'Antibiótico fluoroquinolona',
    category: '2',
    prescription: true,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '11',
    name: 'Azitromicina 500mg',
    presentation: 'Caja con 3 tabletas',
    price: 180,
    description: 'Antibiótico macrólido',
    category: '2',
    prescription: true,
    available: false,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '12',
    name: 'Diclofenaco 50mg',
    presentation: 'Caja con 20 tabletas',
    price: 140,
    description: 'Antiinflamatorio no esteroideo potente',
    category: '3',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '13',
    name: 'Meloxicam 15mg',
    presentation: 'Caja con 14 tabletas',
    price: 190,
    description: 'Antiinflamatorio selectivo COX-2',
    category: '3',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '14',
    name: 'Dipirona 500mg',
    presentation: 'Caja con 20 tabletas',
    price: 95,
    description: 'Analgésico y antipirético potente',
    category: '1',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '15',
    name: 'Tramadol 50mg',
    presentation: 'Caja con 20 tabletas',
    price: 220,
    description: 'Analgésico opioide para dolor moderado a severo',
    category: '1',
    prescription: true,
    available: true,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '16',
    name: 'Fexofenadina 120mg',
    presentation: 'Caja con 10 tabletas',
    price: 160,
    description: 'Antihistamínico no sedante',
    category: '4',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '17',
    name: 'Desloratadina 5mg',
    presentation: 'Caja con 10 tabletas',
    price: 175,
    description: 'Antihistamínico de tercera generación',
    category: '4',
    prescription: false,
    available: false,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '18',
    name: 'Vitamina D3 2000 UI',
    presentation: 'Frasco con 60 cápsulas',
    price: 240,
    description: 'Suplemento de vitamina D para huesos fuertes',
    category: '5',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '19',
    name: 'Omega 3 1000mg',
    presentation: 'Frasco con 30 cápsulas',
    price: 320,
    description: 'Suplemento de ácidos grasos esenciales',
    category: '5',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '20',
    name: 'Magnesio 400mg',
    presentation: 'Frasco con 60 tabletas',
    price: 210,
    description: 'Suplemento mineral para músculos y nervios',
    category: '5',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '21',
    name: 'Crema Hidrocortisona 1%',
    presentation: 'Tubo de 30g',
    price: 85,
    description: 'Crema antiinflamatoria para piel',
    category: '6',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '22',
    name: 'Clotrimazol Crema 1%',
    presentation: 'Tubo de 20g',
    price: 110,
    description: 'Antimicótico tópico para hongos',
    category: '6',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '23',
    name: 'Ketoconazol Champú 2%',
    presentation: 'Frasco de 120ml',
    price: 195,
    description: 'Champú antimicótico para caspa y seborrea',
    category: '6',
    prescription: false,
    available: false,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '24',
    name: 'Betametasona Crema 0.05%',
    presentation: 'Tubo de 15g',
    price: 125,
    description: 'Corticoide tópico potente',
    category: '6',
    prescription: true,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '25',
    name: 'Protector Solar FPS 50+',
    presentation: 'Frasco de 60ml',
    price: 280,
    description: 'Protección solar de amplio espectro',
    category: '6',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '26',
    name: 'Suero Oral Electrolitos',
    presentation: 'Caja con 4 sobres',
    price: 45,
    description: 'Rehidratante oral para diarrea y vómitos',
    category: '5',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '27',
    name: 'Probióticos Multicepa',
    presentation: 'Frasco con 30 cápsulas',
    price: 350,
    description: 'Suplemento de bacterias beneficiosas',
    category: '5',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '28',
    name: 'Ibuprofeno Gel 5%',
    presentation: 'Tubo de 50g',
    price: 135,
    description: 'Gel antiinflamatorio de uso tópico',
    category: '3',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
  {
    id: '29',
    name: 'Codeína + Paracetamol',
    presentation: 'Caja con 20 tabletas',
    price: 185,
    description: 'Analgésico combinado para dolor moderado',
    category: '1',
    prescription: true,
    available: false,
    pharmacy: 'Farmacia Central',
  },
  {
    id: '30',
    name: 'Ranitidina 150mg',
    presentation: 'Caja con 20 tabletas',
    price: 120,
    description: 'Antiácido para úlceras y gastritis',
    category: '1',
    prescription: false,
    available: true,
    pharmacy: 'Farmacia Salud',
  },
];

// Datos de categorías
const categories: Record<string, string> = {
  '1': 'Analgésicos',
  '2': 'Antibióticos',
  '3': 'Antiinflamatorios',
  '4': 'Antihistamínicos',
  '5': 'Vitaminas',
  '6': 'Dermatológicos',
};

export default function CategoriaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [availability, setAvailability] = useState<'all' | 'available'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  const categoryId = id as string;
  const categoryName = categories[categoryId] || 'Categoría';
  
  // Filtrar medicamentos por categoría y otros filtros
  const filteredMedicines = medicines.filter(med => {
    const matchesCategory = med.category === categoryId;
    const matchesSearch = searchQuery === '' || med.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailability = availability === 'all' || med.available;
    const matchesPrice = med.price >= priceRange[0] && med.price <= priceRange[1];
    
    return matchesCategory && matchesSearch && matchesAvailability && matchesPrice;
  });
  
  const handleMedicineSelect = (medicineId: string) => {
    router.push(`/farmacia/producto/${medicineId}` as any);
  };
  
  const handleCartPress = () => {
    router.push('/farmacia/carrito' as any);
  };
  
  const renderMedicineItem = ({ item }: { item: Medicine }) => (
    <TouchableOpacity 
      style={styles.medicineCard}
      onPress={() => handleMedicineSelect(item.id)}
    >
      <View style={styles.medicineImageContainer}>
        <Ionicons name="medical" size={50} color={Colors.light.primary} />
      </View>
      <ThemedText style={styles.medicineName}>{item.name}</ThemedText>
      <ThemedText style={styles.medicinePresentation}>{item.presentation}</ThemedText>
      <ThemedText style={styles.medicinePrice}>${item.price.toFixed(2)}</ThemedText>
      <ThemedText style={[
        styles.medicineAvailability,
        { color: item.available ? '#4CAF50' : '#F44336' }
      ]}>
        {item.available ? 'Disponible' : 'Agotado'}
      </ThemedText>
      <ThemedText style={styles.medicinePharmacy}>Farmacia: {item.pharmacy}</ThemedText>
      <TouchableOpacity 
        style={[styles.addButton, !item.available && styles.disabledButton]}
        onPress={item.available ? handleCartPress : undefined}
        disabled={!item.available}
      >
        <Ionicons name="add-circle" size={28} color={item.available ? Colors.light.primary : '#ccc'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>{categoryName}</ThemedText>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={handleCartPress}
        >
          <Ionicons name="cart" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color="#777" 
          style={styles.searchIcon} 
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar medicamentos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.filtersRow}>
        <TouchableOpacity 
          style={[styles.filterBtn, availability === 'all' && styles.selectedFilter]} 
          onPress={() => setAvailability('all')}
        >
          <ThemedText style={availability === 'all' ? styles.selectedFilterText : null}>
            Todos
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterBtn, availability === 'available' && styles.selectedFilter]} 
          onPress={() => setAvailability('available')}
        >
          <ThemedText style={availability === 'available' ? styles.selectedFilterText : null}>
            Disponibles
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.filterBtn} 
          onPress={() => setPriceRange([0, 500])}
        >
          <ThemedText>Hasta Bs 500</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.filterBtn} 
          onPress={() => setPriceRange([0, 1000])}
        >
          <ThemedText>Todos los precios</ThemedText>
        </TouchableOpacity>
      </View>
      
      <ThemedText style={styles.resultsText}>
        {filteredMedicines.length} resultados encontrados
      </ThemedText>
      
      <FlatList
        data={filteredMedicines}
        renderItem={renderMedicineItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.medicineRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.medicinesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              No se encontraron medicamentos
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
    backgroundColor: Colors.light.background,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  header: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  cartButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.white,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 8,
  },
  selectedFilter: {
    backgroundColor: Colors.light.primary,
  },
  selectedFilterText: {
    color: '#fff',
  },
  resultsText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
  },
  medicinesList: {
    paddingBottom: 20,
  },
  medicineRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  medicineCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  medicineImageContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  medicinePresentation: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  medicinePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  medicineAvailability: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  medicinePharmacy: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    marginTop: 12,
  },
}); 