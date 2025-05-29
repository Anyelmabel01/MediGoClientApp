import { Colors } from '@/constants/Colors';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const deliveryMethods = [
  { id: 'home', label: 'Entrega a domicilio' },
  { id: 'pickup', label: 'Recoger en farmacia' },
];

const paymentMethods = [
  { id: 'card', label: 'Tarjeta de crédito' },
  { id: 'cash', label: 'Efectivo' },
];

export default function CarritoScreen() {
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
  
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Carrito de compras</ThemedText>
      </View>
      
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart" size={64} color="#ccc" />
          <ThemedText style={styles.emptyText}>Tu carrito está vacío</ThemedText>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push('/farmacia' as any)}
          >
            <ThemedText style={styles.shopButtonText}>Explorar medicamentos</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                  <ThemedText style={styles.itemPresentation}>{item.presentation}</ThemedText>
                  {item.prescription && (
                    <ThemedText style={styles.prescriptionLabel}>Medicamento de receta</ThemedText>
                  )}
                </View>
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
                <ThemedText style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</ThemedText>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Ionicons name="trash" size={16} color="#ff3b30" />
                </TouchableOpacity>
              </View>
            )}
            style={styles.list}
          />
          
          <ThemedText style={styles.total}>Total: ${total.toFixed(2)}</ThemedText>
          
          <ThemedText style={styles.sectionTitle}>Método de entrega</ThemedText>
          <View style={styles.optionsRow}>
            {deliveryMethods.map(m => (
              <TouchableOpacity 
                key={m.id} 
                style={[styles.optionBtn, delivery === m.id && styles.selectedOption]} 
                onPress={() => setDelivery(m.id)}
              >
                <ThemedText style={delivery === m.id ? styles.selectedOptionText : null}>
                  {m.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          
          <ThemedText style={styles.sectionTitle}>Método de pago</ThemedText>
          <View style={styles.optionsRow}>
            {paymentMethods.map(m => (
              <TouchableOpacity 
                key={m.id} 
                style={[styles.optionBtn, payment === m.id && styles.selectedOption]} 
                onPress={() => setPayment(m.id)}
              >
                <ThemedText style={payment === m.id ? styles.selectedOptionText : null}>
                  {m.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.checkoutBtn}
            onPress={handleCheckout}
          >
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
            <ThemedText style={styles.checkoutText}>Finalizar compra</ThemedText>
          </TouchableOpacity>
        </>
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    color: '#666',
  },
  shopButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  itemPresentation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  prescriptionLabel: {
    fontSize: 11,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemQty: {
    fontSize: 15,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-end',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  optionBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  selectedOption: {
    backgroundColor: Colors.light.primary,
  },
  selectedOptionText: {
    color: '#fff',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 