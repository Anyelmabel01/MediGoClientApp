import { BottomNavbar } from '@/components/BottomNavbar';
import { LocationSelector } from '@/components/LocationSelector';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserProfile } from '@/components/UserProfile';
import { Colors } from '@/constants/Colors';
import { UserLocation } from '@/constants/UserModel';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Get screen dimensions for responsive layout
const { width, height } = Dimensions.get('window');
const itemWidth = (width - 40) / 2; // Account for padding and gap

type MedicineCategory = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Medicine = {
  id: string;
  name: string;
  presentation: string;
  price: number;
  description: string;
  category: string;
  prescription: boolean;
  available: boolean;
  pharmacy: string;
  quantity?: number;
};

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  isIconMaterial?: boolean;
  isFontAwesome?: boolean;
};

type DeliveryMethod = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  price: number;
};

const categories: MedicineCategory[] = [
  { id: '1', name: 'Analgésicos', icon: 'medkit' },
  { id: '2', name: 'Antibióticos', icon: 'medical' },
  { id: '3', name: 'Antiinflamatorios', icon: 'fitness' },
  { id: '4', name: 'Antihistamínicos', icon: 'leaf' },
  { id: '5', name: 'Vitaminas', icon: 'sunny' },
  { id: '6', name: 'Dermatológicos', icon: 'color-fill' },
];

const paymentMethods: PaymentMethod[] = [
  { id: '1', name: 'Tarjeta de crédito', icon: 'credit-card', isIconMaterial: true },
  { id: '2', name: 'Tarjeta de débito', icon: 'card', isIconMaterial: false },
];

const deliveryMethods: DeliveryMethod[] = [
  { id: '1', name: 'A domicilio', icon: 'home', price: 50 },
];

const featuredMedicines: Medicine[] = [
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

export default function FarmaciaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user, currentLocation, setCurrentLocation } = useUser();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const { cartItems, addToCart, removeFromCart, setCartItems } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [availability, setAvailability] = useState<'all' | 'available'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('home');
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? '' : categoryId);
  };

  const handleMedicineSelect = (medicineId: string) => {
    router.push(`/farmacia/producto/${medicineId}` as any);
  };

  const handleCartPress = () => {
    setShowCart(true);
  };
  
  const handleRecetasPress = () => {
    router.push('/farmacia/recetas' as any);
  };
  
  const handleAddToCart = (medicine: Medicine) => {
    console.log('Adding to cart:', medicine);
    addToCart({ ...medicine, quantity: 1 });
  };
  
  const handleRemoveFromCart = (medicineId: string) => {
    // Si hay más de 1, solo resta 1; si hay 1, elimina el producto
    const item = cartItems.find(ci => ci.id === medicineId);
    if (item && (item.quantity || 1) > 1) {
      setCartItems(prev => prev.map(ci => ci.id === medicineId ? { ...ci, quantity: (ci.quantity || 1) - 1 } : ci));
    } else {
      removeFromCart(medicineId);
    }
  };
  
  const handleCheckout = () => {
    setShowPaymentModal(true);
  };
  
  const handlePaymentSelect = (paymentId: string) => {
    setSelectedPaymentMethod(paymentId);
  };
  
  const isPaymentFormValid = () => {
    if (cartItems.length === 0) return false;
    return !!selectedPaymentMethod && !!selectedDeliveryMethod;
  };
  
  const handleDeliverySelect = (deliveryId: string) => {
    setSelectedDeliveryMethod(deliveryId);
  };
  
  const handlePaymentConfirm = () => {
    // Navegar a la pantalla de seguimiento ya que siempre es entrega a domicilio
    router.push('/farmacia/seguimiento' as any);
    setShowPaymentModal(false);
    setCartItems([]); // Limpiar carrito global
  };
  
  // Filtrar medicamentos
  const filteredMedicines = featuredMedicines.filter(med => {
    const matchesSearch = searchQuery === '' || med.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || med.category === selectedCategory;
    const matchesAvailability = availability === 'all' || med.available;
    const matchesPrice = med.price >= priceRange[0] && med.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesAvailability && matchesPrice;
  });

  const renderCategoryItem = ({ item }: { item: MedicineCategory }) => (
    <TouchableOpacity 
      style={[styles.categoryItem, selectedCategory === item.id && styles.selectedCategoryItem]}
      onPress={() => handleCategorySelect(item.id)}
    >
      <View style={[styles.categoryIcon, { 
        backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.15)' : 'rgba(45, 127, 249, 0.1)'
      }]}>
        <Ionicons name={item.icon} size={20} color={Colors.light.primary} />
      </View>
      <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
    </TouchableOpacity>
  );

  const renderMedicineItem = ({ item }: { item: Medicine }) => (
    <TouchableOpacity 
      style={[styles.medicineCard, { 
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        borderWidth: 1,
        width: itemWidth,
      }]}
      onPress={() => handleMedicineSelect(item.id)}
    >
      <View style={styles.medicineImageContainer}>
        <Ionicons name="medical" size={40} color={Colors.light.primary} />
      </View>
      <ThemedText style={styles.medicineName}>{item.name}</ThemedText>
      <ThemedText style={styles.medicinePresentation}>{item.presentation}</ThemedText>
      <ThemedText style={[styles.medicinePrice, {
        color: isDarkMode ? Colors.dark.text : Colors.light.text
      }]}>Bs {item.price.toFixed(2)}</ThemedText>
      <ThemedText style={[styles.medicineAvailability, {
        color: item.available ? '#2D7FF9' : '#ff3b30'
      }]}>
        {item.available ? 'Disponible' : 'Agotado'}
      </ThemedText>
      <ThemedText style={styles.medicinePharmacy}>Farmacia: {item.pharmacy}</ThemedText>
      {item.available && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Ionicons name="add-circle" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
  
  const renderPaymentMethodItem = ({ item }: { item: PaymentMethod }) => (
    <TouchableOpacity 
      style={[styles.paymentMethodItem, selectedPaymentMethod === item.id && styles.selectedPaymentMethod]}
      onPress={() => handlePaymentSelect(item.id)}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={styles.paymentMethodContent}>
        <ThemedText style={[styles.paymentMethodName, selectedPaymentMethod === item.id && styles.selectedPaymentMethodText]}>
          {item.name}
        </ThemedText>
        <ThemedText style={styles.paymentMethodDescription}>
          {item.id === '1' ? '**** **** **** 1234' : '**** **** **** 5678'}
        </ThemedText>
      </View>
      {selectedPaymentMethod === item.id && (
        <View style={styles.checkmarkContainer}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.light.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
  
  const renderDeliveryMethodItem = ({ item }: { item: DeliveryMethod }) => (
    <TouchableOpacity 
      style={[styles.deliveryMethodItem, selectedDeliveryMethod === item.id && styles.selectedDeliveryMethod]}
      onPress={() => handleDeliverySelect(item.id)}
    >
      <Ionicons name={item.icon} size={24} color={Colors.light.primary} />
      <View style={styles.deliveryMethodInfo}>
        <ThemedText style={styles.deliveryMethodName}>{item.name}</ThemedText>
        <ThemedText style={styles.deliveryMethodPrice}>
          {item.price > 0 ? `Bs ${item.price.toFixed(2)}` : 'Gratis'}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };
  
  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };
  
  const getDeliveryFee = () => {
    return deliveryMethods[0].price; // Siempre hay tarifa de entrega a domicilio
  };
  
  const getCartTotal = () => {
    return getCartSubtotal() + getDeliveryFee();
  };

  const handleLocationSelect = (location: UserLocation) => {
    setCurrentLocation(location);
  };

  const renderHeader = () => (
    <>
      <View style={[styles.searchContainer, { 
        backgroundColor: isDarkMode ? Colors.dark.background : '#f0f0f0',
        borderColor: isDarkMode ? Colors.dark.border : 'transparent',
        borderWidth: 1
      }]}>
        <Ionicons 
          name="search" 
          size={18} 
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
      
      <View style={styles.filtersRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={[styles.filterBtn, availability === 'all' && styles.selectedFilter]} onPress={() => setAvailability('all')}>
            <ThemedText style={availability === 'all' ? styles.selectedFilterText : undefined}>Todos</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterBtn, availability === 'available' && styles.selectedFilter]} onPress={() => setAvailability('available')}>
            <ThemedText style={availability === 'available' ? styles.selectedFilterText : undefined}>Disponibles</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setPriceRange([0, 130])}>
            <ThemedText>Hasta Bs 130</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setPriceRange([0, 1000])}>
            <ThemedText>Todos los precios</ThemedText>
          </TouchableOpacity>
        </ScrollView>
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
      
      <ThemedText style={styles.sectionTitle}>Medicamentos disponibles</ThemedText>
    </>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header igual al diseño principal */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfoContainer}
          onPress={() => setShowUserProfile(true)}
        >
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {user?.nombre?.charAt(0) || 'U'}{user?.apellido?.charAt(0) || 'S'}
                </ThemedText>
              </View>
            )}
          </View>
          
          <View style={styles.greetingContainer}>
            <ThemedText style={styles.greeting}>
              Farmacia
            </ThemedText>
            <View style={styles.editProfileIndicator}>
              <Ionicons name="medical" size={14} color={Colors.light.primary} />
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleRecetasPress}
          >
            <Ionicons name="document-text" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleCartPress}
          >
            <View>
              <Ionicons name="cart" size={20} color="white" />
              {getCartItemCount() > 0 && (
                <View style={styles.cartBadge}>
                  <ThemedText style={styles.cartBadgeText}>{getCartItemCount()}</ThemedText>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.locationContainer}
          onPress={() => setShowLocationSelector(true)}
        >
          <View style={styles.locationIcon}>
            <Ionicons name="location" size={18} color={Colors.light.primary} />
          </View>
          <ThemedText style={styles.locationText} numberOfLines={1}>
            {currentLocation.direccion}
          </ThemedText>
          <Ionicons name="chevron-down" size={16} color={Colors.light.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.servicesHeaderContainer}>
        <ThemedText style={styles.subtitle}>Medicamentos y productos de salud</ThemedText>
      </View>
      
      <FlatList
        data={filteredMedicines}
        renderItem={renderMedicineItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.medicineRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.medicinesList, { paddingHorizontal: 16 }]}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              No se encontraron medicamentos
            </ThemedText>
          </View>
        }
      />
      
      {/* Cart Modal */}
      <Modal
        visible={showCart}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCart(false)}
        statusBarTranslucent={true}
      >
        <StatusBar style="light" translucent />
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background
          }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Carrito de compras</ThemedText>
              <TouchableOpacity onPress={() => setShowCart(false)}>
                <Ionicons name="close" size={24} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>
            
            {cartItems.length === 0 ? (
              <View style={styles.emptyCartContainer}>
                <Ionicons name="cart" size={64} color="#ccc" />
                <ThemedText style={styles.emptyCartText}>Tu carrito está vacío</ThemedText>
              </View>
            ) : (
              <>
                <FlatList
                  data={cartItems}
                  extraData={cartItems}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                      <View style={styles.cartItemImageContainer}>
                        <Ionicons name="medical" size={36} color={Colors.light.primary} />
                      </View>
                      <View style={styles.cartItemInfo}>
                        <ThemedText style={styles.cartItemName}>{item.name}</ThemedText>
                        <ThemedText style={styles.cartItemPresentation}>{item.presentation}</ThemedText>
                        <ThemedText style={styles.cartItemPrice}>Bs {item.price.toFixed(2)}</ThemedText>
                      </View>
                      <View style={styles.cartItemQuantityContainer}>
                        <TouchableOpacity 
                          style={styles.quantityButton} 
                          onPress={() => handleRemoveFromCart(item.id)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Ionicons name="remove" size={18} color={Colors.light.primary} />
                        </TouchableOpacity>
                        <ThemedText style={styles.quantityText}>{item.quantity || 1}</ThemedText>
                        <TouchableOpacity 
                          style={styles.quantityButton} 
                          onPress={() => handleAddToCart(item)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Ionicons name="add" size={18} color={Colors.light.primary} />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={{ marginLeft: 10 }}
                        onPress={() => {
                          // Eliminar el producto completamente del carrito
                          removeFromCart(item.id);
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="trash" size={20} color="#ff3b30" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
                
                <View style={styles.cartSummary}>
                  <View style={styles.summaryRow}>
                    <ThemedText style={styles.summaryLabel}>Subtotal:</ThemedText>
                    <ThemedText style={styles.summaryValue}>Bs {getCartSubtotal().toFixed(2)}</ThemedText>
                  </View>
                  <View style={styles.divider} />
                </View>
                
                <TouchableOpacity 
                  style={styles.checkoutButton}
                  onPress={handleCheckout}
                >
                  <ThemedText style={styles.checkoutButtonText}>Proceder al pago</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
        statusBarTranslucent={true}
      >
        <StatusBar style="light" translucent />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            maxHeight: '90%'
          }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Método de pago</ThemedText>
                <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                  <Ionicons name="close" size={24} color={Colors.light.primary} />
                </TouchableOpacity>
              </View>
              
              <ThemedText style={styles.sectionTitle}>Resumen del pedido</ThemedText>
              <View style={styles.orderSummary}>
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryLabel}>Productos ({getCartItemCount()}):</ThemedText>
                  <ThemedText style={styles.summaryValue}>Bs {getCartSubtotal().toFixed(2)}</ThemedText>
                </View>
              </View>
              
              <ThemedText style={styles.sectionTitle}>Selecciona un método de pago</ThemedText>
              {paymentMethods.map(item => (
                <View key={item.id} style={styles.paymentMethodWrapper}>
                  {renderPaymentMethodItem({ item })}
                </View>
              ))}
              
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryLabel}>Subtotal:</ThemedText>
                  <ThemedText style={styles.summaryValue}>Bs {getCartSubtotal().toFixed(2)}</ThemedText>
                </View>
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryLabel}>Envío:</ThemedText>
                  <ThemedText style={styles.summaryValue}>Bs {getDeliveryFee().toFixed(2)}</ThemedText>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.totalText}>Total:</ThemedText>
                  <ThemedText style={styles.totalPrice}>Bs {getCartTotal().toFixed(2)}</ThemedText>
                </View>
              </View>
              
              <TouchableOpacity 
                style={[styles.checkoutButton, 
                  (!isPaymentFormValid()) && styles.disabledButton
                ]}
                onPress={handlePaymentConfirm}
                disabled={!isPaymentFormValid()}
              >
                <ThemedText style={styles.checkoutButtonText}>Confirmar pago</ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      
      <BottomNavbar />
      
      <UserProfile 
        isVisible={showUserProfile} 
        onClose={() => setShowUserProfile(false)}
      />
      
      <LocationSelector 
        isVisible={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onLocationSelect={handleLocationSelect}
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: Colors.light.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  editProfileIndicator: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 4,
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 16,
    top: 64,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
    marginLeft: 8,
  },
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  locationIcon: {
    marginRight: 6,
  },
  locationText: {
    flex: 1,
    color: Colors.light.white,
    fontSize: 14,
    marginRight: 4,
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
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  filtersRow: {
    marginBottom: 12,
  },
  filterBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFilter: {
    backgroundColor: Colors.light.primary,
  },
  selectedFilterText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoriesList: {
    paddingVertical: 4,
    marginBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 12,
    width: 70,
  },
  selectedCategoryItem: {
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    borderRadius: 8,
    padding: 2,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    textAlign: 'center',
  },
  medicinesList: {
    paddingBottom: 16,
  },
  medicineRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  medicineCard: {
    borderRadius: 10,
    padding: 10,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
    marginBottom: 10,
  },
  medicineImageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  medicineName: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  medicinePresentation: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  medicinePrice: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  medicineAvailability: {
    fontSize: 12,
    marginBottom: 2,
  },
  medicinePharmacy: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
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
  
  // Cart Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyCartText: {
    fontSize: 16,
    marginTop: 12,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartItemImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemPresentation: {
    fontSize: 14,
    color: '#555',
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  cartItemQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  
  // Cart Summary Styles
  cartSummary: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  
  // Order Summary
  orderSummary: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 10,
  },
  summaryContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  
  // Payment Modal Styles
  paymentList: {
    marginBottom: 20,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: Colors.light.white,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedPaymentMethod: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(45, 127, 249, 0.05)',
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.2,
  },
  paymentMethodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedPaymentMethodIcon: {
    backgroundColor: Colors.light.primary,
  },
  paymentMethodContent: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
  },
  selectedPaymentMethodText: {
    color: Colors.light.primary,
  },
  paymentMethodDescription: {
    fontSize: 12,
    color: '#555',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  
  checkoutButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  deliveryMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedDeliveryMethod: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
  },
  deliveryMethodInfo: {
    marginLeft: 12,
    flex: 1,
  },
  deliveryMethodName: {
    fontSize: 16,
  },
  deliveryMethodPrice: {
    fontSize: 14,
    color: '#555',
  },
  paymentMethodWrapper: {
    marginBottom: 10,
  },
  deliveryMethodWrapper: {
    marginBottom: 10,
  },
});