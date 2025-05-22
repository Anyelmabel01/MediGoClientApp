import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

// Datos de ejemplo
const orderInfo = {
  id: 'o1',
  status: 'En camino',
  eta: '25 minutos',
  pharmacy: { name: 'Farmacia Central', contact: '555-1234' },
};

export default function SeguimientoScreen() {
  const router = useRouter();
  
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Seguimiento de pedido</ThemedText>
      </View>
      
      <View style={styles.card}>
        <View style={styles.statusContainer}>
          <View style={styles.statusIconContainer}>
            <Ionicons name="bicycle" size={36} color="#fff" />
          </View>
          <View style={styles.statusTextContainer}>
            <ThemedText style={styles.statusLabel}>Estado actual</ThemedText>
            <ThemedText style={styles.statusText}>{orderInfo.status}</ThemedText>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <ThemedText style={styles.infoLabel}>Tiempo estimado de entrega:</ThemedText>
          <ThemedText style={styles.infoValue}>{orderInfo.eta}</ThemedText>
        </View>
        
        <View style={styles.infoSection}>
          <ThemedText style={styles.infoLabel}>Farmacia:</ThemedText>
          <ThemedText style={styles.infoValue}>{orderInfo.pharmacy.name}</ThemedText>
        </View>
        
        <View style={styles.infoSection}>
          <ThemedText style={styles.infoLabel}>Contacto:</ThemedText>
          <View style={styles.contactRow}>
            <Ionicons name="call" size={18} color={Colors.light.primary} />
            <ThemedText style={styles.contactText}>{orderInfo.pharmacy.contact}</ThemedText>
          </View>
        </View>
        
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle" size={22} color="#fff" />
          <ThemedText style={styles.helpButtonText}>Solicitar ayuda</ThemedText>
        </TouchableOpacity>
      </View>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  helpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 