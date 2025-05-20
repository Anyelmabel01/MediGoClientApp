import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

type MedicineCategory = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Medicine = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  prescription: boolean;
};

const categories: MedicineCategory[] = [
  { id: '1', name: 'Analgésicos', icon: 'medkit' },
  { id: '2', name: 'Antibióticos', icon: 'medical' },
  { id: '3', name: 'Antiinflamatorios', icon: 'fitness' },
  { id: '4', name: 'Antihistamínicos', icon: 'leaf' },
  { id: '5', name: 'Vitaminas', icon: 'sunny' },
  { id: '6', name: 'Dermatológicos', icon: 'color-fill' },
];

const featuredMedicines: Medicine[] = [
  { 
    id: '1', 
    name: 'Paracetamol 500mg', 
    price: 120, 
    description: 'Para aliviar el dolor leve a moderado y reducir la fiebre', 
    category: '1',
    prescription: false 
  },
  { 
    id: '2', 
    name: 'Ibuprofeno 400mg', 
    price: 150, 
    description: 'Antiinflamatorio no esteroideo para dolor y fiebre', 
    category: '3',
    prescription: false 
  },
  { 
    id: '3', 
    name: 'Complejo B', 
    price: 180, 
    description: 'Suplemento vitamínico para mejorar la energía', 
    category: '5',
    prescription: false 
  },
  { 
    id: '4', 
    name: 'Loratadina 10mg', 
    price: 130, 
    description: 'Antihistamínico para alergias', 
    category: '4',
    prescription: false 
  },
];

export default function FarmaciaScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode } = useTheme();

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/farmacia/categoria/${categoryId}` as any);
  };

  const handleMedicineSelect = (medicineId: string) => {
    router.push(`/farmacia/producto/${medicineId}` as any);
  };

  const handleCartPress = () => {
    router.push('/farmacia/carrito' as any);
  };

  const renderCategoryItem = ({ item }: { item: MedicineCategory }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => handleCategorySelect(item.id)}
    >
      <View style={[styles.categoryIcon, { 
        backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.15)' : 'rgba(45, 127, 249, 0.1)'
      }]}>
        <Ionicons name={item.icon} size={24} color={Colors.light.primary} />
      </View>
      <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
    </TouchableOpacity>
  );

  const renderMedicineItem = ({ item }: { item: Medicine }) => (
    <TouchableOpacity 
      style={[styles.medicineCard, { 
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        borderWidth: 1
      }]}
      onPress={() => handleMedicineSelect(item.id)}
    >
      <View style={styles.medicineImageContainer}>
        <Ionicons name="medical" size={50} color={Colors.light.primary} />
      </View>
      <ThemedText style={styles.medicineName}>{item.name}</ThemedText>
      <ThemedText style={[styles.medicinePrice, { 
        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
      }]}>${item.price.toFixed(2)}</ThemedText>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {/* Agregar al carrito */}}
      >
        <Ionicons name="add-circle" size={28} color={Colors.light.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Farmacia</ThemedText>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={handleCartPress}
        >
          <Ionicons name="cart" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.searchContainer, { 
        backgroundColor: isDarkMode ? Colors.dark.background : '#f0f0f0',
        borderColor: isDarkMode ? Colors.dark.border : 'transparent',
        borderWidth: 1
      }]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={isDarkMode ? Colors.dark.textSecondary : '#777'} 
          style={styles.searchIcon} 
        />
        <TextInput
          style={[styles.searchInput, { 
            color: isDarkMode ? Colors.dark.text : Colors.light.text 
          }]}
          placeholder="Buscar medicamentos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
        />
      </View>
      
      <ThemedText style={styles.sectionTitle}>Categorías</ThemedText>
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />
      
      <ThemedText style={styles.sectionTitle}>Medicamentos destacados</ThemedText>
      <FlatList
        data={featuredMedicines}
        renderItem={renderMedicineItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.medicineRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.medicinesList}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  cartButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoriesList: {
    paddingVertical: 8,
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
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
    borderRadius: 12,
    padding: 12,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
  medicinePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
});