import { Colors } from '@/constants/Colors';
import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

// Tipos
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  status: 'active' | 'inactive';
  medications: Medication[];
}

// Datos de ejemplo
const prescriptions: Prescription[] = [
  {
    id: '1',
    date: '20/10/2023',
    doctorName: 'Dr. Juan Pérez',
    status: 'active',
    medications: [
      {
        id: '1-1',
        name: 'Amoxicilina',
        dosage: '500mg',
        frequency: 'Cada 8 horas',
        duration: '7 días',
      },
      {
        id: '1-2',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Cada 6 horas si hay dolor',
        duration: '5 días',
      }
    ]
  },
  {
    id: '2',
    date: '15/09/2023',
    doctorName: 'Dra. María González',
    status: 'active',
    medications: [
      {
        id: '2-1',
        name: 'Atorvastatina',
        dosage: '20mg',
        frequency: 'Una vez al día',
        duration: 'Permanente',
      }
    ]
  }
];

export default function RecetasScreen() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [activeRecetas] = useState<Prescription[]>(prescriptions);
  const [expandedPrescription, setExpandedPrescription] = useState<string | null>(null);
  
  const togglePrescriptionDetails = (id: string) => {
    setExpandedPrescription(expandedPrescription === id ? null : id);
  };

  const handleBuyMedication = (medication: Medication, prescriptionId: string) => {
    console.log('🔥 handleBuyMedication called with:', { medication, prescriptionId });
    
    // Convert medication from prescription to cart item format
    const cartItem = {
      id: medication.id,
      name: medication.name,
      presentation: medication.dosage,
      price: 100, // Price could be fetched from a database or set default
      description: `${medication.frequency} por ${medication.duration}`,
      category: '1', // Default category, could be determined based on medication type
      prescription: true,
      available: true,
      pharmacy: 'Farmacia Central', // Default pharmacy
      quantity: 1,
    };

    console.log('🛒 Cart item to add:', cartItem);
    
    try {
      addToCart(cartItem);
      console.log('✅ addToCart called successfully');
      alert(`${medication.name} agregado al carrito!`); // Simple alert for debugging
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
    }
  };
  
  const renderPrescriptionItem = ({ item }: { item: Prescription }) => (
    <View style={styles.prescriptionCard}>
      <TouchableOpacity 
        style={styles.prescriptionHeader}
        onPress={() => togglePrescriptionDetails(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.prescriptionIcon}>
          <Ionicons name="document-text" size={24} color="#fff" />
        </View>
        <View style={styles.prescriptionInfo}>
          <ThemedText style={styles.prescriptionDate}>Receta: {item.date}</ThemedText>
          <ThemedText style={styles.doctorName}>{item.doctorName}</ThemedText>
          <View style={styles.statusBadge}>
            <View style={styles.statusIndicator} />
            <ThemedText style={styles.statusText}>Activa</ThemedText>
          </View>
        </View>
        <Ionicons 
          name={expandedPrescription === item.id ? "chevron-up" : "chevron-down"} 
          size={24} 
          color={Colors.light.primary} 
        />
      </TouchableOpacity>
      
      {expandedPrescription === item.id && (
        <View style={styles.medicationsContainer}>
          <ThemedText style={styles.medicationsTitle}>Medicamentos:</ThemedText>
          
          {item.medications.map((med) => (
            <View key={med.id} style={styles.medicationItem}>
              <View style={styles.medicationHeader}>
                <Ionicons 
                  name="medical-outline" 
                  size={16} 
                  color={Colors.light.primary} 
                />
                <ThemedText style={styles.medicationName}>{med.name}</ThemedText>
              </View>
              
              <View style={styles.medicationDetails}>
                <ThemedText style={styles.medicationDetail}>
                  <ThemedText style={styles.detailLabel}>Dosis: </ThemedText>
                  {med.dosage}
                </ThemedText>
                <ThemedText style={styles.medicationDetail}>
                  <ThemedText style={styles.detailLabel}>Frecuencia: </ThemedText>
                  {med.frequency}
                </ThemedText>
                <ThemedText style={styles.medicationDetail}>
                  <ThemedText style={styles.detailLabel}>Duración: </ThemedText>
                  {med.duration}
                </ThemedText>
              </View>
              
              <TouchableOpacity 
                style={styles.buyButton}
                onPress={() => {
                  console.log('🛒 Buy button pressed for medication:', med.name);
                  handleBuyMedication(med, item.id);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="cart" size={16} color="#fff" />
                <ThemedText style={styles.buyButtonText}>Comprar</ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
  
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Recetas activas</ThemedText>
      </View>
      
      {/* Test button for debugging */}
      <TouchableOpacity 
        style={{
          backgroundColor: 'red',
          padding: 10,
          margin: 10,
          borderRadius: 5,
          alignItems: 'center'
        }}
        onPress={() => {
          console.log('🔴 TEST BUTTON PRESSED');
          const testItem = {
            id: 'test-123',
            name: 'Test Medicine',
            presentation: '500mg',
            price: 50,
            description: 'Test description',
            category: '1',
            prescription: true,
            available: true,
            pharmacy: 'Test Pharmacy',
            quantity: 1,
          };
          console.log('🔴 Adding test item:', testItem);
          addToCart(testItem);
          alert('Test item added to cart!');
        }}
      >
        <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>
          TEST ADD TO CART
        </ThemedText>
      </TouchableOpacity>
      
      <FlatList
        data={activeRecetas}
        renderItem={renderPrescriptionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  prescriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prescriptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  prescriptionInfo: {
    flex: 1,
  },
  prescriptionDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  doctorName: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  medicationsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  medicationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  medicationItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicationName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  medicationDetails: {
    marginBottom: 12,
  },
  medicationDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: '500',
    color: '#555',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 6,
  },
}); 