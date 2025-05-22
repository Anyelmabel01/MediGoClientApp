import { Colors } from '@/constants/Colors';
import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';

// Tipos
interface Pharmacy {
  id: string;
  name: string;
  contact: string;
  availability: boolean;
}

interface Medicine {
  id: string;
  name: string;
  presentation: string;
  price: number;
  description: string;
  category: string;
  prescription: boolean;
  composition: string;
  uses: string;
  recommendedDose: string;
  sideEffects: string;
  pharmacies: Pharmacy[];
}

// Datos de ejemplo
const medicinesData: Record<string, Medicine> = {
  '1': {
    id: '1',
    name: 'Paracetamol 500mg',
    presentation: 'Caja con 20 tabletas',
    price: 120,
    description: 'Para aliviar el dolor leve a moderado y reducir la fiebre',
    category: '1',
    prescription: false,
    composition: 'Paracetamol (acetaminofén) 500mg',
    uses: 'Alivio del dolor leve a moderado como dolores de cabeza, musculares, menstruales, de dientes. Reducción de la fiebre.',
    recommendedDose: 'Adultos y niños mayores de 12 años: 1-2 tabletas cada 4-6 horas según sea necesario. Máximo 8 tabletas en 24 horas.',
    sideEffects: 'Náuseas, erupciones cutáneas. En dosis altas puede causar daño hepático.',
    pharmacies: [
      { id: 'f1', name: 'Farmacia Central', contact: '555-1234', availability: true },
      { id: 'f2', name: 'Farmacia Salud', contact: '555-5678', availability: true },
    ],
  },
  '2': {
    id: '2',
    name: 'Ibuprofeno 400mg',
    presentation: 'Caja con 10 tabletas',
    price: 150,
    description: 'Antiinflamatorio no esteroideo para dolor y fiebre',
    category: '3',
    prescription: false,
    composition: 'Ibuprofeno 400mg',
    uses: 'Alivio del dolor, inflamación y fiebre. Eficaz para dolores de cabeza, musculares, articulares y menstruales.',
    recommendedDose: 'Adultos y niños mayores de 12 años: 1 tableta cada 8 horas con alimentos.',
    sideEffects: 'Problemas gastrointestinales como dolor de estómago, acidez, náuseas. Mareos, reacciones alérgicas.',
    pharmacies: [
      { id: 'f2', name: 'Farmacia Salud', contact: '555-5678', availability: true },
    ],
  },
  '3': {
    id: '3',
    name: 'Complejo B',
    presentation: 'Frasco con 30 tabletas',
    price: 180,
    description: 'Suplemento vitamínico para mejorar la energía',
    category: '5',
    prescription: false,
    composition: 'Vitaminas B1, B2, B6, B12, ácido fólico y niacina',
    uses: 'Suplemento de vitaminas del complejo B para prevenir deficiencias, mejorar el metabolismo energético y apoyar la función nerviosa.',
    recommendedDose: '1 tableta diaria con alimentos.',
    sideEffects: 'Coloración amarilla de la orina, náuseas leves en algunas personas.',
    pharmacies: [
      { id: 'f1', name: 'Farmacia Central', contact: '555-1234', availability: false },
    ],
  },
  '4': {
    id: '4',
    name: 'Loratadina 10mg',
    presentation: 'Caja con 10 tabletas',
    price: 130,
    description: 'Antihistamínico para alergias',
    category: '4',
    prescription: false,
    composition: 'Loratadina 10mg',
    uses: 'Alivio de síntomas de alergias como rinitis, estornudos, picazón nasal y ocular, urticaria.',
    recommendedDose: 'Adultos y niños mayores de 12 años: 1 tableta diaria.',
    sideEffects: 'Somnolencia (menos que otros antihistamínicos), sequedad bucal, dolor de cabeza.',
    pharmacies: [
      { id: 'f1', name: 'Farmacia Central', contact: '555-1234', availability: true },
      { id: 'f2', name: 'Farmacia Salud', contact: '555-5678', availability: true },
    ],
  },
};

export default function ProductoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  // Obtener datos del medicamento
  const medicine = medicinesData[id as string];
  
  if (!medicine) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Producto no encontrado</ThemedText>
        </View>
      </ThemedView>
    );
  }
  
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  const handleAddToCart = () => {
    if (!medicine) return;
    addToCart({
      id: medicine.id,
      name: medicine.name,
      presentation: medicine.presentation,
      price: medicine.price,
      description: medicine.description,
      category: medicine.category,
      prescription: medicine.prescription,
      available: true, // o puedes poner la lógica real
      pharmacy: medicine.pharmacies[0]?.name || '',
      quantity,
    });
    // Opcional: feedback visual, cerrar modal, navegar, etc.
    router.back(); // O puedes mostrar un toast, etc.
  };
  
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Detalle del producto</ThemedText>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.productHeader}>
          <View style={styles.productImageContainer}>
            <Ionicons name="medical" size={80} color={Colors.light.primary} />
          </View>
          <ThemedText style={styles.productName}>{medicine.name}</ThemedText>
          <ThemedText style={styles.productPresentation}>{medicine.presentation}</ThemedText>
          <ThemedText style={styles.productPrice}>${medicine.price.toFixed(2)}</ThemedText>
          
          {medicine.prescription && (
            <View style={styles.prescriptionBadge}>
              <Ionicons name="alert-circle" size={16} color="#fff" />
              <ThemedText style={styles.prescriptionText}>Requiere receta médica</ThemedText>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Composición</ThemedText>
          <ThemedText style={styles.sectionContent}>{medicine.composition}</ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Usos</ThemedText>
          <ThemedText style={styles.sectionContent}>{medicine.uses}</ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Dosis recomendada</ThemedText>
          <ThemedText style={styles.sectionContent}>{medicine.recommendedDose}</ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Efectos secundarios</ThemedText>
          <ThemedText style={styles.sectionContent}>{medicine.sideEffects}</ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Disponibilidad en farmacias</ThemedText>
          {medicine.pharmacies.map(pharmacy => (
            <View key={pharmacy.id} style={styles.pharmacyItem}>
              <View style={styles.pharmacyInfo}>
                <ThemedText style={styles.pharmacyName}>{pharmacy.name}</ThemedText>
                <View style={styles.contactRow}>
                  <Ionicons name="call-outline" size={14} color="#555" />
                  <ThemedText style={styles.pharmacyContact}>{pharmacy.contact}</ThemedText>
                </View>
              </View>
              <ThemedText 
                style={[
                  styles.availabilityText, 
                  { color: pharmacy.availability ? '#4CAF50' : '#F44336' }
                ]}
              >
                {pharmacy.availability ? 'Disponible' : 'Agotado'}
              </ThemedText>
            </View>
          ))}
        </View>
        
        <View style={styles.quantitySection}>
          <ThemedText style={styles.quantityLabel}>Cantidad:</ThemedText>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={decreaseQuantity}
            >
              <Ionicons name="remove" size={20} color={Colors.light.primary} />
            </TouchableOpacity>
            <ThemedText style={styles.quantityValue}>{quantity}</ThemedText>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={increaseQuantity}
            >
              <Ionicons name="add" size={20} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart" size={24} color="#fff" />
          <ThemedText style={styles.addToCartText}>Agregar al carrito</ThemedText>
        </TouchableOpacity>
      </ScrollView>
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
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  productHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  productImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  productPresentation: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  prescriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  prescriptionText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  pharmacyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pharmacyContact: {
    marginLeft: 6,
    color: '#555',
  },
  availabilityText: {
    fontWeight: 'bold',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 10,
    marginBottom: 32,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 12,
  },
}); 