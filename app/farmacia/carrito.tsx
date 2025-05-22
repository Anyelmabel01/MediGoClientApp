import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

// Tipos
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Datos de ejemplo
const cartItems: CartItem[] = [
  { id: '1', name: 'Paracetamol 500mg', price: 120, quantity: 2 },
  { id: '2', name: 'Ibuprofeno 400mg', price: 150, quantity: 1 },
];

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
  const [cart] = useState(cartItems);
  const [delivery, setDelivery] = useState('home');
  const [payment, setPayment] = useState('card');
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const handleCheckout = () => {
    router.push('/farmacia/seguimiento' as any);
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
      
      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <ThemedText style={styles.itemName}>{item.name}</ThemedText>
            <ThemedText style={styles.itemQty}>x{item.quantity}</ThemedText>
            <ThemedText style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</ThemedText>
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
  list: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
  },
  itemQty: {
    fontSize: 15,
    marginHorizontal: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
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