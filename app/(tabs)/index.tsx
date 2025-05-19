import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ParallaxScrollView } from '@/components/ParallaxScrollView';

type ServiceItem = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  description: string;
};

const services: ServiceItem[] = [
  {
    id: '1',
    name: 'Consulta',
    icon: 'medkit',
    route: '/consulta',
    description: 'Agenda citas médicas presenciales o por telemedicina'
  },
  {
    id: '2',
    name: 'Farmacia',
    icon: 'medical',
    route: '/farmacia',
    description: 'Busca y compra medicamentos con entrega a domicilio'
  },
  {
    id: '3',
    name: 'Emergencia',
    icon: 'alert-circle',
    route: '/emergencia',
    description: 'Solicita atención médica de urgencia en tu ubicación'
  },
  {
    id: '4',
    name: 'Enfermería',
    icon: 'pulse',
    route: '/enfermeria',
    description: 'Servicios de cuidados y procedimientos a domicilio'
  },
  {
    id: '5',
    name: 'Expediente',
    icon: 'document-text',
    route: '/expediente',
    description: 'Accede a tu historial médico y resultados de pruebas'
  },
  {
    id: '6',
    name: 'Laboratorio',
    icon: 'flask',
    route: '/laboratorio',
    description: 'Programa toma de muestras y revisa resultados'
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const renderServiceItem = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity 
      style={styles.serviceItem}
      onPress={() => router.push(item.route)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={32} color="#2D7FF9" />
      </View>
      <View style={styles.serviceContent}>
        <ThemedText style={styles.serviceName}>{item.name}</ThemedText>
        <ThemedText style={styles.serviceDescription}>{item.description}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <ThemedText style={styles.greeting}>¡Hola!</ThemedText>
        <ThemedText style={styles.subtitle}>¿Qué servicio necesitas hoy?</ThemedText>
      </View>
      
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.servicesList}
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
    marginTop: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
  },
  servicesList: {
    paddingBottom: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(45, 127, 249, 0.1)',
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
    color: '#777',
  },
});
