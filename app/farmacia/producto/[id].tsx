import { BottomNavbar } from '@/components/BottomNavbar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserProfile } from '@/components/UserProfile';
import { Colors } from '@/constants/Colors';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

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
  '9': {
    id: '9',
    name: 'Amoxicilina 500mg',
    presentation: 'Caja con 21 cápsulas',
    price: 250,
    description: 'Antibiótico de amplio espectro',
    category: '2',
    prescription: true,
    composition: 'Amoxicilina trihidratada 500mg',
    uses: 'Tratamiento de infecciones bacterianas como sinusitis, bronquitis, neumonía, infecciones del tracto urinario y de la piel.',
    recommendedDose: 'Adultos: 1 cápsula cada 8 horas por 7-10 días según prescripción médica.',
    sideEffects: 'Diarrea, náuseas, vómitos, erupciones cutáneas. Puede causar reacciones alérgicas graves.',
    pharmacies: [
      { id: 'f1', name: 'Farmacia Central', contact: '555-1234', availability: true },
    ],
  },
  '12': {
    id: '12',
    name: 'Diclofenaco 50mg',
    presentation: 'Caja con 20 tabletas',
    price: 140,
    description: 'Antiinflamatorio no esteroideo potente',
    category: '3',
    prescription: false,
    composition: 'Diclofenaco sódico 50mg',
    uses: 'Tratamiento del dolor e inflamación en artritis, lesiones deportivas, dolor dental y postoperatorio.',
    recommendedDose: 'Adultos: 1 tableta 2-3 veces al día con alimentos.',
    sideEffects: 'Malestar estomacal, úlceras, problemas cardiovasculares en uso prolongado.',
    pharmacies: [
      { id: 'f2', name: 'Farmacia Salud', contact: '555-5678', availability: true },
    ],
  },
  '14': {
    id: '14',
    name: 'Dipirona 500mg',
    presentation: 'Caja con 20 tabletas',
    price: 95,
    description: 'Analgésico y antipirético potente',
    category: '1',
    prescription: false,
    composition: 'Metamizol sódico 500mg',
    uses: 'Alivio del dolor intenso y reducción de la fiebre alta que no responde a otros medicamentos.',
    recommendedDose: 'Adultos: 1-2 tabletas cada 6-8 horas según necesidad.',
    sideEffects: 'Riesgo raro pero grave de agranulocitosis. Náuseas, mareos.',
    pharmacies: [
      { id: 'f2', name: 'Farmacia Salud', contact: '555-5678', availability: true },
    ],
  },
  '16': {
    id: '16',
    name: 'Fexofenadina 120mg',
    presentation: 'Caja con 10 tabletas',
    price: 160,
    description: 'Antihistamínico no sedante',
    category: '4',
    prescription: false,
    composition: 'Fexofenadina clorhidrato 120mg',
    uses: 'Alivio de síntomas de rinitis alérgica y urticaria crónica sin causar somnolencia.',
    recommendedDose: 'Adultos y niños mayores de 12 años: 1 tableta diaria.',
    sideEffects: 'Dolor de cabeza leve, náuseas ocasionales. No causa somnolencia.',
    pharmacies: [
      { id: 'f2', name: 'Farmacia Salud', contact: '555-5678', availability: true },
    ],
  },
  '18': {
    id: '18',
    name: 'Vitamina D3 2000 UI',
    presentation: 'Frasco con 60 cápsulas',
    price: 240,
    description: 'Suplemento de vitamina D para huesos fuertes',
    category: '5',
    prescription: false,
    composition: 'Colecalciferol (Vitamina D3) 2000 UI',
    uses: 'Prevención y tratamiento de deficiencia de vitamina D, fortalecimiento de huesos y sistema inmune.',
    recommendedDose: '1 cápsula diaria con alimentos que contengan grasa.',
    sideEffects: 'En dosis excesivas: hipercalcemia, náuseas, debilidad.',
    pharmacies: [
      { id: 'f2', name: 'Farmacia Salud', contact: '555-5678', availability: true },
    ],
  },
  '19': {
    id: '19',
    name: 'Omega 3 1000mg',
    presentation: 'Frasco con 30 cápsulas',
    price: 320,
    description: 'Suplemento de ácidos grasos esenciales',
    category: '5',
    prescription: false,
    composition: 'Aceite de pescado con EPA 300mg y DHA 200mg',
    uses: 'Apoyo cardiovascular, cerebral y antiinflamatorio. Reducción de triglicéridos.',
    recommendedDose: '1-2 cápsulas diarias con las comidas.',
    sideEffects: 'Sabor a pescado, malestar estomacal leve, eructos.',
    pharmacies: [
      { id: 'f1', name: 'Farmacia Central', contact: '555-1234', availability: true },
    ],
  },
  '21': {
    id: '21',
    name: 'Crema Hidrocortisona 1%',
    presentation: 'Tubo de 30g',
    price: 85,
    description: 'Crema antiinflamatoria para piel',
    category: '6',
    prescription: false,
    composition: 'Hidrocortisona 1%',
    uses: 'Tratamiento de eczema, dermatitis, picazón, irritación cutánea leve.',
    recommendedDose: 'Aplicar una capa fina 2-3 veces al día en la zona afectada.',
    sideEffects: 'Adelgazamiento de la piel con uso prolongado, irritación local.',
    pharmacies: [
      { id: 'f1', name: 'Farmacia Central', contact: '555-1234', availability: true },
    ],
  },
  '25': {
    id: '25',
    name: 'Protector Solar FPS 50+',
    presentation: 'Frasco de 60ml',
    price: 280,
    description: 'Protección solar de amplio espectro',
    category: '6',
    prescription: false,
    composition: 'Óxido de zinc, Dióxido de titanio, Octinoxato',
    uses: 'Protección contra rayos UVA y UVB, prevención de quemaduras solares y envejecimiento prematuro.',
    recommendedDose: 'Aplicar generosamente 30 minutos antes de la exposición. Reaplicar cada 2 horas.',
    sideEffects: 'Irritación cutánea en pieles sensibles, comedogénico en algunos casos.',
    pharmacies: [
      { id: 'f1', name: 'Farmacia Central', contact: '555-1234', availability: true },
    ],
  },
  '26': {
    id: '26',
    name: 'Suero Oral Electrolitos',
    presentation: 'Caja con 4 sobres',
    price: 45,
    description: 'Rehidratante oral para diarrea y vómitos',
    category: '5',
    prescription: false,
    composition: 'Cloruro de sodio, Citrato de sodio, Cloruro de potasio, Glucosa',
    uses: 'Rehidratación en casos de diarrea, vómitos, sudoración excesiva o deshidratación leve.',
    recommendedDose: 'Disolver 1 sobre en 200ml de agua. Tomar según tolerancia.',
    sideEffects: 'Náuseas si se consume muy rápido. Sabor salado.',
    pharmacies: [
      { id: 'f2', name: 'Farmacia Salud', contact: '555-5678', availability: true },
    ],
  },
  '27': {
    id: '27',
    name: 'Probióticos Multicepa',
    presentation: 'Frasco con 30 cápsulas',
    price: 350,
    description: 'Suplemento de bacterias beneficiosas',
    category: '5',
    prescription: false,
    composition: 'Lactobacillus acidophilus, Bifidobacterium bifidum, Lactobacillus casei',
    uses: 'Restauración de la flora intestinal, mejora de la digestión, fortalecimiento del sistema inmune.',
    recommendedDose: '1 cápsula diaria con el estómago vacío o según indicación médica.',
    sideEffects: 'Gases o distensión abdominal leve al inicio del tratamiento.',
    pharmacies: [
      { id: 'f1', name: 'Farmacia Central', contact: '555-1234', availability: true },
    ],
  },
  '28': {
    id: '28',
    name: 'Ibuprofeno Gel 5%',
    presentation: 'Tubo de 50g',
    price: 135,
    description: 'Gel antiinflamatorio de uso tópico',
    category: '3',
    prescription: false,
    composition: 'Ibuprofeno 5%',
    uses: 'Alivio tópico del dolor e inflamación en músculos, articulaciones y lesiones deportivas.',
    recommendedDose: 'Aplicar 3-4 veces al día masajeando suavemente hasta absorción.',
    sideEffects: 'Irritación cutánea local, enrojecimiento, picazón en el sitio de aplicación.',
    pharmacies: [
      { id: 'f2', name: 'Farmacia Salud', contact: '555-5678', availability: true },
    ],
  },
  '30': {
    id: '30',
    name: 'Ranitidina 150mg',
    presentation: 'Caja con 20 tabletas',
    price: 120,
    description: 'Antiácido para úlceras y gastritis',
    category: '1',
    prescription: false,
    composition: 'Ranitidina clorhidrato 150mg',
    uses: 'Tratamiento de úlceras gástricas, gastritis, reflujo gastroesofágico y exceso de acidez.',
    recommendedDose: '1 tableta 2 veces al día, preferiblemente con las comidas.',
    sideEffects: 'Dolor de cabeza, mareos, estreñimiento o diarrea ocasional.',
    pharmacies: [
      { id: 'f2', name: 'Farmacia Salud', contact: '555-5678', availability: true },
    ],
  },
};

export default function ProductoScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { id } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  // Obtener datos del medicamento
  const medicine = medicinesData[id as string];

  if (!medicine) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style="auto" />
        
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <ThemedText style={styles.headerTitle}>Producto no encontrado</ThemedText>
              <View style={styles.productIndicator}>
                <Ionicons name="close-circle" size={14} color={Colors.light.primary} />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.userAvatarButton}
              onPress={() => setShowUserProfile(true)}
            >
              <View style={styles.headerAvatar}>
                <ThemedText style={styles.headerAvatarText}>
                  {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <BottomNavbar />
        
        <UserProfile 
          isVisible={showUserProfile} 
          onClose={() => setShowUserProfile(false)}
        />
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
      <StatusBar style="auto" />
      
      {/* Header adaptado al diseño estándar pero para detalles */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <ThemedText style={styles.headerTitle}>Producto</ThemedText>
            <View style={styles.productIndicator}>
              <Ionicons name="medical" size={14} color={Colors.light.primary} />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.userAvatarButton}
            onPress={() => setShowUserProfile(true)}
          >
            <View style={styles.headerAvatar}>
              <ThemedText style={styles.headerAvatarText}>
                {user.nombre.charAt(0)}{user.apellido.charAt(0)}
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.servicesHeaderContainer}>
        <ThemedText style={styles.subtitle}>{medicine.name}</ThemedText>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
      
      <BottomNavbar />
      
      <UserProfile 
        isVisible={showUserProfile} 
        onClose={() => setShowUserProfile(false)}
      />
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
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  productIndicator: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 4,
    marginLeft: 8,
  },
  userAvatarButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerAvatarText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  servicesHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
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