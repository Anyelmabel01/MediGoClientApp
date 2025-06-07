import { BottomNavbar } from '@/components/BottomNavbar';
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
import { FlatList, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const deliveryMethods = [
  { id: 'home', label: 'Entrega a domicilio' },
];

const paymentMethods = [
  { id: 'card', label: 'Débito o Crédito' },
];

export default function CarritoScreen() {
  const { user, currentLocation, setCurrentLocation } = useUser();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { cartItems, removeFromCart, setCartItems } = useCart();
  const [delivery, setDelivery] = useState('home');
  const [payment, setPayment] = useState('card');
  
  console.log('🛒 CarritoScreen cartItems:', cartItems);
  console.log('🛒 CarritoScreen cartItems length:', cartItems.length);
  
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const handleCheckout = () => {
    router.push('/farmacia/seguimiento' as any);
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleLocationSelect = (location: UserLocation) => {
    setCurrentLocation(location);
  };

  if (!user) {
    return null; // or loading spinner
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header con diseño estándar */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <ThemedText style={styles.headerTitle}>Carrito</ThemedText>
            <View style={styles.cartIndicator}>
              <Ionicons name="cart" size={14} color={Colors.light.primary} />
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
        <ThemedText style={styles.subtitle}>
          {cartItems.length > 0 ? `${cartItems.length} producto${cartItems.length !== 1 ? 's' : ''} en tu carrito` : 'Tu carrito está vacío'}
        </ThemedText>
      </View>
      
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cart" size={64} color={Colors.light.primary} />
          </View>
          <ThemedText style={styles.emptyText}>Tu carrito está vacío</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Explora nuestros medicamentos y agrega los que necesites
          </ThemedText>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push('/farmacia' as any)}
          >
            <Ionicons name="storefront" size={20} color="white" />
            <ThemedText style={styles.shopButtonText}>Explorar medicamentos</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.itemsSection}>
            <ThemedText style={styles.sectionTitle}>Productos</ThemedText>
            <FlatList
              data={cartItems}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={[styles.itemCard, {
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white
                }]}>
                  <View style={styles.itemImageContainer}>
                    <Ionicons name="medical" size={40} color={Colors.light.primary} />
                  </View>
                  <View style={styles.itemInfo}>
                    <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                    <ThemedText style={styles.itemPresentation}>{item.presentation}</ThemedText>
                    {item.prescription && (
                      <View style={styles.prescriptionBadge}>
                        <Ionicons name="alert-circle" size={12} color="#fff" />
                        <ThemedText style={styles.prescriptionLabel}>Receta médica</ThemedText>
                      </View>
                    )}
                    <ThemedText style={styles.itemPrice}>Bs {item.price.toFixed(2)} c/u</ThemedText>
                  </View>
                  <View style={styles.itemActions}>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item.id, -1)}
                      >
                        <Ionicons name="remove" size={16} color={Colors.light.primary} />
                      </TouchableOpacity>
                      <ThemedText style={styles.itemQty}>{item.quantity}</ThemedText>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item.id, 1)}
                      >
                        <Ionicons name="add" size={16} color={Colors.light.primary} />
                      </TouchableOpacity>
                    </View>
                    <ThemedText style={styles.itemTotal}>Bs {(item.price * item.quantity).toFixed(2)}</ThemedText>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemoveItem(item.id)}
                    >
                      <Ionicons name="trash" size={18} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              scrollEnabled={false}
            />
          </View>
          
          <View style={styles.paymentSection}>
            <ThemedText style={styles.sectionTitle}>Método de pago</ThemedText>
            <View style={styles.optionsContainer}>
              {paymentMethods.map(m => (
                <TouchableOpacity 
                  key={m.id} 
                  style={[styles.optionCard, payment === m.id && styles.selectedOptionCard, {
                    backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white
                  }]} 
                  onPress={() => setPayment(m.id)}
                >
                  <Ionicons 
                    name={m.id === 'card' ? 'card' : 'cash'} 
                    size={24} 
                    color={payment === m.id ? Colors.light.primary : (isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary)} 
                  />
                  <ThemedText style={[styles.optionText, payment === m.id && styles.selectedOptionText]}>
                    {m.label}
                  </ThemedText>
                  {payment === m.id && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Subtotal:</ThemedText>
              <ThemedText style={styles.summaryValue}>Bs {total.toFixed(2)}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Envío:</ThemedText>
              <ThemedText style={styles.summaryValue}>{delivery === 'home' ? 'Bs 50.00' : 'Gratis'}</ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <ThemedText style={styles.totalLabel}>Total:</ThemedText>
              <ThemedText style={styles.totalValue}>
                Bs {(total + (delivery === 'home' ? 50 : 0)).toFixed(2)}
              </ThemedText>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.checkoutBtn}
            onPress={handleCheckout}
          >
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <ThemedText style={styles.checkoutText}>Finalizar compra</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      )}
      
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
  cartIndicator: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  itemsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.light.primary,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPresentation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  prescriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff3b30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  prescriptionLabel: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemQty: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  removeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
  },
  paymentSection: {
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedOptionCard: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(45, 127, 249, 0.05)',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  selectedOptionText: {
    color: Colors.light.primary,
  },
  summarySection: {
    backgroundColor: 'rgba(45, 127, 249, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 12,
  },
}); 