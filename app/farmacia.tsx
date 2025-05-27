import { Colors } from '@/constants/Colors';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView from 'react-native-maps';
import { MapboxMap } from '../components/MapboxMap';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

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
  requiresCardInfo?: boolean;
};

type DeliveryMethod = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  price: number;
};

type CardInfo = {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
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
  { id: '1', name: 'Tarjeta de crédito', icon: 'credit-card', isIconMaterial: true, requiresCardInfo: true },
  { id: '2', name: 'Tarjeta de débito', icon: 'card', isIconMaterial: false, requiresCardInfo: true },
  { id: '3', name: 'PayPal', icon: 'paypal', isFontAwesome: true, requiresCardInfo: false },
  { id: '4', name: 'Efectivo', icon: 'cash', isIconMaterial: false, requiresCardInfo: false },
];

const deliveryMethods: DeliveryMethod[] = [
  { id: '1', name: 'A domicilio', icon: 'home', price: 50 },
  { id: '2', name: 'Recoger en farmacia', icon: 'storefront-outline', price: 0 },
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
];

// Simulate delivery tracking
const deliveryLocation = {
  x: 0.3, // Posiciones normalizadas entre 0 y 1
  y: 0.7,
};

const userLocation = {
  x: 0.7,
  y: 0.3,
};

// Coordenadas de farmacia simulada para seguimiento real
const pharmacyLocation = {
  latitude: 8.9700,
  longitude: -79.5200,
  name: 'Farmacia Central'
};

// Función para calcular distancia entre dos puntos
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return (distance * 1000).toFixed(0); // Convertir a metros
};

// Función para obtener la ruta de Mapbox Directions API
const getMapboxRoute = async (start: any, end: any) => {
  const MAPBOX_API_KEY = "pk.eyJ1Ijoia2V2aW5uMjMiLCJhIjoiY204Y2J0bWN1MTg5ZzJtb2xobXljODM0MiJ9.48MFADtQhp_sFuQjewLFeA";
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?geometries=geojson&access_token=${MAPBOX_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      return {
        coordinates: data.routes[0].geometry.coordinates,
        duration: data.routes[0].duration,
        distance: data.routes[0].distance
      };
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo ruta:', error);
    return null;
  }
};

export default function FarmaciaScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [availability, setAvailability] = useState<'all' | 'available'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const { isDarkMode } = useTheme();
  
  // Cart state ahora viene del contexto
  const { cartItems, addToCart, removeFromCart, setCartItems } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<string | null>(null);
  const [showDeliveryTracking, setShowDeliveryTracking] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState('Preparando pedido');
  const [courierPosition, setCourierPosition] = useState({ x: deliveryLocation.x, y: deliveryLocation.y });
  const [animatedPosition] = useState(new Animated.ValueXY({ x: deliveryLocation.x * width * 0.8, y: deliveryLocation.y * height * 0.3 }));
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<MapView | null>(null);
  const [cardInfo, setCardInfo] = useState<CardInfo>({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
  const [showCardInfo, setShowCardInfo] = useState(false);
  
  // Estados para seguimiento real con GPS
  const [userGPSLocation, setUserGPSLocation] = useState<any>(null);
  const [realDeliveryLocation, setRealDeliveryLocation] = useState(pharmacyLocation);
  const [deliveryRoute, setDeliveryRoute] = useState<any>(null);
  const [routeProgress, setRouteProgress] = useState(0);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(15);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  
  // Obtener ubicación real del usuario cuando se activa el seguimiento
  useEffect(() => {
    const getLocationPermission = async () => {
      if (!showDeliveryTracking) return;
      
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para mostrar tu posición en el mapa.');
          return;
        }

        setLocationPermission(true);
        
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const userCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        };

        setUserGPSLocation(userCoords);

        // Obtener ruta desde farmacia hasta usuario
        const routeData = await getMapboxRoute(pharmacyLocation, userCoords);
        if (routeData) {
          setDeliveryRoute(routeData);
          setEstimatedDeliveryTime(Math.ceil(routeData.duration / 60)); // Convertir a minutos
        }

      } catch (error) {
        console.error('Error obteniendo ubicación:', error);
        Alert.alert('Error', 'No se pudo obtener tu ubicación. Usando ubicación por defecto.');
        // Usar ubicación por defecto en Panama City
        setUserGPSLocation({
          latitude: 8.9824,
          longitude: -79.5199
        });
      }
    };

    getLocationPermission();
  }, [showDeliveryTracking]);

  // Simular movimiento del repartidor a lo largo de la ruta real
  useEffect(() => {
    if (!showDeliveryTracking || !deliveryRoute || !deliveryRoute.coordinates || deliveryRoute.coordinates.length === 0) return;

    const moveAlongRoute = () => {
      setRouteProgress(prevProgress => {
        const newProgress = prevProgress + 0.015; // Aumentar 1.5% cada vez
        
        if (newProgress >= 1) {
          setDeliveryStatus('Entregado');
          setEstimatedDeliveryTime(0);
          return 1;
        }

        // Calcular posición en la ruta
        const routeIndex = Math.floor(newProgress * (deliveryRoute.coordinates.length - 1));
        const routeCoord = deliveryRoute.coordinates[routeIndex];
        
        if (routeCoord) {
          setRealDeliveryLocation({
            latitude: routeCoord[1], // Lat/Lng están invertidos en GeoJSON
            longitude: routeCoord[0],
            name: 'Repartidor en ruta'
          });
        }

        // Actualizar tiempo estimado y estado
        const remainingTime = Math.ceil((1 - newProgress) * (deliveryRoute.duration / 60));
        setEstimatedDeliveryTime(remainingTime);
        
        if (newProgress > 0.8) {
          setDeliveryStatus('Llegando a tu ubicación');
        } else if (newProgress > 0.3) {
          setDeliveryStatus('En camino');
        } else {
          setDeliveryStatus('Preparando pedido');
        }

        return newProgress;
      });
    };

    const interval = setInterval(moveAlongRoute, 2500); // Actualizar cada 2.5 segundos
    return () => clearInterval(interval);
  }, [showDeliveryTracking, deliveryRoute]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
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
    addToCart({ ...medicine, quantity: 1 });
  };
  
  const handleRemoveFromCart = (medicineId: string) => {
    // Si hay más de 1, solo resta 1; si hay 1, elimina el producto
    const item = cartItems.find(ci => ci.id === medicineId);
    if (item && item.quantity > 1) {
      setCartItems(prev => prev.map(ci => ci.id === medicineId ? { ...ci, quantity: ci.quantity - 1 } : ci));
    } else {
      removeFromCart(medicineId);
    }
  };
  
  const handleCheckout = () => {
    setShowPaymentModal(true);
  };
  
  const handlePaymentSelect = (paymentId: string) => {
    setSelectedPaymentMethod(paymentId);
    
    // Check if the selected payment method requires card info
    const selectedMethod = paymentMethods.find(method => method.id === paymentId);
    setShowCardInfo(!!selectedMethod?.requiresCardInfo);
  };
  
  const handleCardInfoChange = (field: keyof CardInfo, value: string) => {
    setCardInfo(prev => ({ ...prev, [field]: value }));
  };
  
  const isPaymentFormValid = () => {
    if (cartItems.length === 0) return false;
    const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);
    if (selectedMethod?.requiresCardInfo) {
      return cardInfo.cardNumber.length >= 16 && 
             cardInfo.cardHolder.trim() !== '' &&
             cardInfo.expiryDate.length >= 5 &&
             cardInfo.cvv.length >= 3 &&
             !!selectedDeliveryMethod;
    }
    return !!selectedPaymentMethod && !!selectedDeliveryMethod;
  };
  
  const handleDeliverySelect = (deliveryId: string) => {
    setSelectedDeliveryMethod(deliveryId);
  };
  
  const handlePaymentConfirm = () => {
    if (selectedDeliveryMethod === '1') { // A domicilio
      // Reiniciar estado de seguimiento real
      setDeliveryStatus('Preparando pedido');
      setRealDeliveryLocation(pharmacyLocation);
      setDeliveryRoute(null);
      setRouteProgress(0);
      setEstimatedDeliveryTime(15);
      setUserGPSLocation(null);
      setLocationPermission(false);
      setShowDeliveryTracking(true);
    }
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
        borderWidth: 1,
        width: itemWidth,
      }]}
      onPress={() => handleMedicineSelect(item.id)}
    >
      <View style={styles.medicineImageContainer}>
        <Ionicons name="medical" size={50} color={Colors.light.primary} />
      </View>
      <ThemedText style={styles.medicineName}>{item.name}</ThemedText>
      <ThemedText style={styles.medicinePresentation}>{item.presentation}</ThemedText>
      <ThemedText style={[styles.medicinePrice, { 
        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
      }]}>${item.price.toFixed(2)}</ThemedText>
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
          <Ionicons name="add-circle" size={28} color={Colors.light.primary} />
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
      {item.isIconMaterial ? (
        <MaterialIcons name={item.icon as any} size={24} color={Colors.light.primary} />
      ) : item.isFontAwesome ? (
        <FontAwesome name={item.icon as any} size={24} color={Colors.light.primary} />
      ) : (
        <Ionicons name={item.icon as any} size={24} color={Colors.light.primary} />
      )}
      <ThemedText style={styles.paymentMethodName}>{item.name}</ThemedText>
      {selectedPaymentMethod === item.id && (
        <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} style={{ marginLeft: 8 }} />
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
          {item.price > 0 ? `$${item.price.toFixed(2)}` : 'Gratis'}
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
    return selectedDeliveryMethod === '1' ? deliveryMethods[0].price : 0;
  };
  
  const getCartTotal = () => {
    return getCartSubtotal() + getDeliveryFee();
  };

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
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleRecetasPress}
          >
            <Ionicons name="document-text" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleCartPress}
          >
            <View>
              <Ionicons name="cart" size={24} color={Colors.light.primary} />
              {getCartItemCount() > 0 && (
                <View style={styles.cartBadge}>
                  <ThemedText style={styles.cartBadgeText}>{getCartItemCount()}</ThemedText>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
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
      
      <View style={styles.filtersRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={[styles.filterBtn, availability === 'all' && styles.selectedFilter]} onPress={() => setAvailability('all')}>
            <ThemedText style={availability === 'all' ? styles.selectedFilterText : undefined}>Todos</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterBtn, availability === 'available' && styles.selectedFilter]} onPress={() => setAvailability('available')}>
            <ThemedText style={availability === 'available' ? styles.selectedFilterText : undefined}>Disponibles</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setPriceRange([0, 130])}>
            <ThemedText>Hasta $130</ThemedText>
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
      
      {/* Cart Modal */}
      <Modal
        visible={showCart}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCart(false)}
      >
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
                        <ThemedText style={styles.cartItemPrice}>${item.price.toFixed(2)}</ThemedText>
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
                          setCartItems(cartItems.filter(ci => ci.id !== item.id));
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
                    <ThemedText style={styles.summaryValue}>${getCartSubtotal().toFixed(2)}</ThemedText>
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
      >
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
                  <ThemedText style={styles.summaryValue}>${getCartSubtotal().toFixed(2)}</ThemedText>
                </View>
              </View>
              
              <ThemedText style={styles.sectionTitle}>Selecciona un método de pago</ThemedText>
              <FlatList
                data={paymentMethods}
                extraData={selectedPaymentMethod}
                keyExtractor={item => item.id}
                renderItem={renderPaymentMethodItem}
                style={styles.paymentList}
              />
              
              {/* Credit Card Info Form */}
              {showCardInfo && (
                <View style={styles.cardInfoContainer}>
                  <View style={styles.cardPreview}>
                    <View style={styles.cardHeader}>
                      <ThemedText style={styles.cardType}>Tarjeta {selectedPaymentMethod === '1' ? 'de Crédito' : 'de Débito'}</ThemedText>
                      <Ionicons name="card" size={24} color="#fff" />
                    </View>
                    <ThemedText style={styles.cardNumberPreview}>
                      {cardInfo.cardNumber ? 
                        cardInfo.cardNumber.replace(/(\d{4})/g, '$1 ').trim() : 
                        '•••• •••• •••• ••••'
                      }
                    </ThemedText>
                    <View style={styles.cardFooter}>
                      <View>
                        <ThemedText style={styles.cardLabel}>TITULAR</ThemedText>
                        <ThemedText style={styles.cardValue}>
                          {cardInfo.cardHolder || 'NOMBRE APELLIDO'}
                        </ThemedText>
                      </View>
                      <View>
                        <ThemedText style={styles.cardLabel}>VENCE</ThemedText>
                        <ThemedText style={styles.cardValue}>
                          {cardInfo.expiryDate || 'MM/AA'}
                        </ThemedText>
                      </View>
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <ThemedText style={styles.inputLabel}>Número de tarjeta</ThemedText>
                    <TextInput
                      style={styles.textInput}
                      placeholder="1234 5678 9012 3456"
                      value={cardInfo.cardNumber}
                      onChangeText={(text) => handleCardInfoChange('cardNumber', text.replace(/\D/g, '').slice(0, 16))}
                      keyboardType="numeric"
                      maxLength={16}
                    />
                  </View>
                  
                  <View style={styles.formGroup}>
                    <ThemedText style={styles.inputLabel}>Titular de la tarjeta</ThemedText>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Nombre como aparece en la tarjeta"
                      value={cardInfo.cardHolder}
                      onChangeText={(text) => handleCardInfoChange('cardHolder', text.toUpperCase())}
                      autoCapitalize="characters"
                    />
                  </View>
                  
                  <View style={styles.formRow}>
                    <View style={[styles.formGroup, { width: '48%' }]}>
                      <ThemedText style={styles.inputLabel}>Fecha de vencimiento</ThemedText>
                      <TextInput
                        style={styles.textInput}
                        placeholder="MM/AA"
                        value={cardInfo.expiryDate}
                        onChangeText={(text) => {
                          let formatted = text.replace(/\D/g, '');
                          if (formatted.length > 2) {
                            formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
                          }
                          handleCardInfoChange('expiryDate', formatted);
                        }}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>
                    
                    <View style={[styles.formGroup, { width: '48%' }]}>
                      <ThemedText style={styles.inputLabel}>CVV</ThemedText>
                      <TextInput
                        style={styles.textInput}
                        placeholder="123"
                        value={cardInfo.cvv}
                        onChangeText={(text) => handleCardInfoChange('cvv', text.replace(/\D/g, '').slice(0, 3))}
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                      />
                    </View>
                  </View>
                </View>
              )}
              
              <ThemedText style={styles.sectionTitle}>Método de entrega</ThemedText>
              <FlatList
                data={deliveryMethods}
                keyExtractor={item => item.id}
                renderItem={renderDeliveryMethodItem}
                style={styles.deliveryList}
              />
              
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryLabel}>Subtotal:</ThemedText>
                  <ThemedText style={styles.summaryValue}>${getCartSubtotal().toFixed(2)}</ThemedText>
                </View>
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryLabel}>Envío:</ThemedText>
                  <ThemedText style={styles.summaryValue}>${getDeliveryFee().toFixed(2)}</ThemedText>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.totalText}>Total:</ThemedText>
                  <ThemedText style={styles.totalPrice}>${getCartTotal().toFixed(2)}</ThemedText>
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
      
      {/* Delivery Tracking Modal */}
      <Modal
        visible={showDeliveryTracking}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDeliveryTracking(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            maxHeight: height * 0.9
          }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Seguimiento de entrega</ThemedText>
              <TouchableOpacity onPress={() => setShowDeliveryTracking(false)}>
                <Ionicons name="close" size={24} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>
            
            <ThemedText style={styles.deliveryStatusText}>{deliveryStatus}</ThemedText>
            
            {/* Mensaje de entrega finalizada */}
            {deliveryStatus === 'Entregado' && (
              <View style={{ alignItems: 'center', marginVertical: 24 }}>
                <Ionicons name="checkmark-circle" size={64} color="#4CAF50" style={{ marginBottom: 12 }} />
                <ThemedText style={{ fontSize: 22, fontWeight: 'bold', color: '#4CAF50', marginBottom: 8 }}>
                  ¡Pedido entregado!
                </ThemedText>
                <ThemedText style={{ fontSize: 16, textAlign: 'center', marginBottom: 16 }}>
                  ¿Te gustó nuestro servicio?
                </ThemedText>
                <TouchableOpacity
                  style={{ backgroundColor: Colors.light.primary, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 8 }}
                  onPress={() => setShowDeliveryTracking(false)}
                >
                  <ThemedText style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Cerrar</ThemedText>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Simulated Map */}
            <View style={styles.mapContainer}>
              {userGPSLocation ? (
                <MapboxMap
                  latitude={(realDeliveryLocation.latitude + userGPSLocation.latitude) / 2}
                  longitude={(realDeliveryLocation.longitude + userGPSLocation.longitude) / 2}
                  zoom={13}
                  markers={[
                    {
                      id: 'delivery',
                      latitude: realDeliveryLocation.latitude,
                      longitude: realDeliveryLocation.longitude,
                      color: Colors.light.primary,
                      title: 'Repartidor'
                    },
                    {
                      id: 'user',
                      latitude: userGPSLocation.latitude,
                      longitude: userGPSLocation.longitude,
                      color: '#ff3b30',
                      title: 'Tu ubicación'
                    },
                    {
                      id: 'pharmacy',
                      latitude: pharmacyLocation.latitude,
                      longitude: pharmacyLocation.longitude,
                      color: '#28a745',
                      title: pharmacyLocation.name
                    }
                  ]}
                  route={deliveryRoute?.coordinates}
                  showCurrentLocation={false}
                  interactive={true}
                  style={styles.map}
                />
              ) : (
                <View style={styles.loadingMapContainer}>
                  <Ionicons name="location" size={48} color={Colors.light.primary} />
                  <ThemedText style={styles.loadingMapText}>
                    Obteniendo tu ubicación...
                  </ThemedText>
                </View>
              )}
              
              {/* Map Legend */}
              <View style={styles.mapLegend}>
                <View style={styles.legendItem}>
                  <Ionicons name="bicycle" size={18} color={Colors.light.primary} />
                  <ThemedText style={styles.legendText}>Repartidor</ThemedText>
                </View>
                <View style={styles.legendItem}>
                  <Ionicons name="person" size={18} color="#ff3b30" />
                  <ThemedText style={styles.legendText}>Tu ubicación</ThemedText>
                </View>
                <View style={styles.legendItem}>
                  <Ionicons name="storefront" size={18} color="#28a745" />
                  <ThemedText style={styles.legendText}>Farmacia</ThemedText>
                </View>
              </View>
            </View>
            
            <View style={styles.deliveryInfoContainer}>
              <View style={styles.deliveryInfoItem}>
                <Ionicons name="time-outline" size={24} color={Colors.light.primary} />
                <ThemedText style={styles.deliveryInfoText}>Tiempo estimado: {estimatedDeliveryTime} min</ThemedText>
              </View>
              <View style={styles.deliveryInfoItem}>
                <Ionicons name="person-outline" size={24} color={Colors.light.primary} />
                <ThemedText style={styles.deliveryInfoText}>Repartidor: Juan Pérez</ThemedText>
              </View>
              <View style={styles.deliveryInfoItem}>
                <Ionicons name="call-outline" size={24} color={Colors.light.primary} />
                <ThemedText style={styles.deliveryInfoText}>Contacto: 55-1234-5678</ThemedText>
              </View>
              {userGPSLocation && (
                <View style={styles.deliveryInfoItem}>
                  <Ionicons name="location-outline" size={24} color={Colors.light.primary} />
                  <ThemedText style={styles.deliveryInfoText}>
                    Distancia: {calculateDistance(
                      realDeliveryLocation.latitude, 
                      realDeliveryLocation.longitude, 
                      userGPSLocation.latitude, 
                      userGPSLocation.longitude
                    )}m aprox.
                  </ThemedText>
                </View>
              )}
            </View>
            
            {/* Delivery Progress */}
            <View style={styles.deliveryProgressContainer}>
              <ThemedText style={styles.deliveryProgressTitle}>Progreso de entrega</ThemedText>
              <View style={styles.progressSteps}>
                <View style={[styles.progressStep, styles.activeStep]}>
                  <View style={[styles.stepCircle, styles.completedStepCircle]}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                  <ThemedText style={styles.stepText}>Pedido confirmado</ThemedText>
                </View>
                <View style={[styles.progressStep, styles.activeStep]}>
                  <View style={[styles.stepCircle, styles.completedStepCircle]}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                  <ThemedText style={styles.stepText}>En preparación</ThemedText>
                </View>
                <View style={[styles.progressStep, deliveryStatus !== 'Preparando pedido' ? styles.activeStep : undefined]}>
                  <View style={[styles.stepCircle, deliveryStatus !== 'Preparando pedido' ? styles.completedStepCircle : undefined]}>
                    {deliveryStatus !== 'Preparando pedido' ? 
                      <Ionicons name="checkmark" size={16} color="#fff" /> :
                      <ThemedText style={styles.stepNumber}>3</ThemedText>
                    }
                  </View>
                  <ThemedText style={styles.stepText}>En camino</ThemedText>
                </View>
                <View style={[styles.progressStep, deliveryStatus === 'Entregado' ? styles.activeStep : undefined]}>
                  <View style={[styles.stepCircle, deliveryStatus === 'Entregado' ? styles.completedStepCircle : undefined]}>
                    {deliveryStatus === 'Entregado' ? 
                      <Ionicons name="checkmark" size={16} color="#fff" /> :
                      <ThemedText style={styles.stepNumber}>4</ThemedText>
                    }
                  </View>
                  <ThemedText style={styles.stepText}>Entregado</ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 5,
    marginLeft: 10,
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
  selectedCategoryItem: {
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    borderRadius: 8,
    padding: 4,
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
    marginBottom: 12,
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
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  medicinePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  medicineAvailability: {
    fontSize: 13,
    marginBottom: 2,
  },
  medicinePharmacy: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
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
  
  // Credit Card Form Styles
  cardInfoContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(45, 127, 249, 0.05)',
    borderRadius: 10,
  },
  cardPreview: {
    height: 180,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    backgroundColor: Colors.light.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  cardType: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardNumberPreview: {
    color: '#fff',
    fontSize: 22,
    letterSpacing: 2,
    marginBottom: 30,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    marginBottom: 4,
  },
  cardValue: {
    color: '#fff',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 16,
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
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedPaymentMethod: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
  },
  paymentMethodName: {
    marginLeft: 12,
    fontSize: 16,
  },
  deliveryList: {
    marginBottom: 20,
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
  
  // Delivery Tracking Styles
  deliveryStatusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: Colors.light.primary,
  },
  mapContainer: {
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  simulatedMap: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e5e5',  // Light gray background
    borderRadius: 10,
    position: 'relative',
  },
  routeLine: {
    position: 'absolute',
    width: '100%',
    height: 4,
    backgroundColor: '#2D7FF9',
    top: '50%',
    left: 0,
    transform: [{ rotate: '45deg' }],
    opacity: 0.5,
  },
  locationMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    transform: [{ translateX: -20 }, { translateY: -20 }], // Center the marker
  },
  userMarker: {
    borderWidth: 2,
    borderColor: '#ff3b30',
  },
  courierMarker: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  mapLegend: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    padding: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  legendText: {
    fontSize: 12,
    marginLeft: 5,
  },
  
  // Delivery Info Styles
  deliveryInfoContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  deliveryInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  deliveryInfoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  
  // Delivery Progress Styles
  deliveryProgressContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  deliveryProgressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  progressStep: {
    alignItems: 'center',
    width: '22%',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  activeStep: {
    // Estilos para paso activo
  },
  completedStepCircle: {
    backgroundColor: Colors.light.primary,
  },
  stepNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 12,
    textAlign: 'center',
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
  map: {
    flex: 1,
  },
  loadingMapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMapText: {
    fontSize: 16,
    color: Colors.light.primary,
  },
});