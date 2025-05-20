import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

type NursingService = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  price: number;
};

const nursingServices: NursingService[] = [
  {
    id: '1',
    name: 'Aplicación de inyecciones',
    icon: 'medical',
    description: 'Administración de medicamentos vía intramuscular o intravenosa por personal capacitado',
    price: 250,
  },
  {
    id: '2',
    name: 'Curación de heridas',
    icon: 'bandage',
    description: 'Limpieza y cuidado profesional de heridas, cambio de vendajes',
    price: 350,
  },
  {
    id: '3',
    name: 'Toma de signos vitales',
    icon: 'pulse',
    description: 'Monitoreo de presión arterial, temperatura, frecuencia cardíaca y respiratoria',
    price: 200,
  },
  {
    id: '4',
    name: 'Cuidado de adulto mayor',
    icon: 'people',
    description: 'Asistencia especializada para adultos mayores en casa',
    price: 450,
  },
  {
    id: '5',
    name: 'Canalización intravenosa',
    icon: 'water',
    description: 'Colocación de catéter para administración de medicamentos o sueros',
    price: 400,
  },
  {
    id: '6',
    name: 'Sonda vesical',
    icon: 'flask',
    description: 'Colocación o cambio de sonda vesical por personal especializado',
    price: 500,
  },
];

export default function EnfermeriaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const handleServicePress = (serviceId: string) => {
    router.push(`/enfermeria/servicio/${serviceId}` as any);
  };

  const handleAgendarPress = () => {
    router.push('/enfermeria/agendar' as any);
  };

  const renderServiceItem = ({ item }: { item: NursingService }) => (
    <TouchableOpacity 
      style={[styles.serviceCard, { 
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        borderWidth: 1
      }]}
      onPress={() => handleServicePress(item.id)}
    >
      <View style={[styles.serviceIconContainer, { 
        backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.15)' : 'rgba(45, 127, 249, 0.1)'
      }]}>
        <Ionicons name={item.icon} size={32} color={Colors.light.primary} />
      </View>
      <View style={styles.serviceContent}>
        <ThemedText style={styles.serviceName}>{item.name}</ThemedText>
        <ThemedText style={[styles.serviceDescription, { 
          color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
        }]}>{item.description}</ThemedText>
        <ThemedText style={[styles.servicePrice, { color: Colors.light.primary }]}>
          ${item.price.toFixed(2)}
        </ThemedText>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
      />
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
        <ThemedText style={styles.title}>Enfermería a Domicilio</ThemedText>
      </View>
      
      <View style={[styles.infoBox, { 
        backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.1)' : '#E3F2FD',
        borderColor: isDarkMode ? 'rgba(45, 127, 249, 0.2)' : '#BBDEFB'
      }]}>
        <Ionicons name="information-circle" size={24} color={Colors.light.primary} />
        <ThemedText style={[styles.infoText, { color: Colors.light.primary }]}>
          Servicios de enfermería profesional en la comodidad de tu hogar
        </ThemedText>
      </View>
      
      <ThemedText style={styles.sectionTitle}>Servicios disponibles</ThemedText>
      
      <FlatList
        data={nursingServices}
        renderItem={renderServiceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.servicesList}
      />
      
      <TouchableOpacity 
        style={[styles.ctaButton, { backgroundColor: Colors.light.primary }]}
        onPress={handleAgendarPress}
      >
        <ThemedText style={styles.ctaButtonText}>Agendar Servicio</ThemedText>
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
  infoBox: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  servicesList: {
    paddingBottom: 80,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    marginBottom: 6,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  ctaButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});