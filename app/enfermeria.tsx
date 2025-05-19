import React from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
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

  const renderServiceItem = ({ item }: { item: NursingService }) => (
    <TouchableOpacity 
      style={styles.serviceCard}
      onPress={() => router.push(`/enfermeria/servicio/${item.id}`)}
    >
      <View style={styles.serviceIconContainer}>
        <Ionicons name={item.icon} size={32} color="#2D7FF9" />
      </View>
      <View style={styles.serviceContent}>
        <ThemedText style={styles.serviceName}>{item.name}</ThemedText>
        <ThemedText style={styles.serviceDescription}>{item.description}</ThemedText>
        <ThemedText style={styles.servicePrice}>${item.price.toFixed(2)}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2D7FF9" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Enfermería a Domicilio</ThemedText>
      </View>
      
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={24} color="#2D7FF9" />
        <ThemedText style={styles.infoText}>
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
        style={styles.ctaButton}
        onPress={() => router.push('/enfermeria/agendar')}
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
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  infoText: {
    color: '#1565C0',
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
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
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
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    marginBottom: 6,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D7FF9',
  },
  ctaButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#2D7FF9',
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