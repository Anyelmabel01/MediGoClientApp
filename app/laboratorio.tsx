import React from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

type LabOption = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  route: string;
};

const labOptions: LabOption[] = [
  {
    id: '1',
    name: 'Solicitar Pruebas',
    icon: 'flask',
    description: 'Programa una visita para toma de muestras a domicilio',
    route: '/laboratorio/solicitar',
  },
  {
    id: '2',
    name: 'Mis Resultados',
    icon: 'document-text',
    description: 'Consulta los resultados de tus pruebas de laboratorio',
    route: '/laboratorio/resultados',
  },
  {
    id: '3',
    name: 'Historial',
    icon: 'time',
    description: 'Revisa el historial de todas tus pruebas realizadas',
    route: '/laboratorio/historial',
  },
  {
    id: '4',
    name: 'Pruebas Disponibles',
    icon: 'list',
    description: 'Explora el catálogo de pruebas de laboratorio disponibles',
    route: '/laboratorio/catalogo',
  },
];

export default function LaboratorioScreen() {
  const router = useRouter();

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
        <ThemedText style={styles.title}>Laboratorio</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.banner}>
          <ThemedText style={styles.bannerTitle}>Laboratorio a Domicilio</ThemedText>
          <ThemedText style={styles.bannerText}>
            Nuestros especialistas tomarán tus muestras donde tú estés.
          </ThemedText>
          <View style={styles.bannerIconContainer}>
            <Ionicons name="flask" size={80} color="#4527A0" />
          </View>
        </View>
        
        <View style={styles.optionsContainer}>
          {labOptions.map((option) => (
            <TouchableOpacity 
              key={option.id}
              style={styles.optionCard}
              onPress={() => router.push(option.route)}
            >
              <View style={styles.optionIcon}>
                <Ionicons name={option.icon} size={28} color="#5E35B1" />
              </View>
              <View style={styles.optionContent}>
                <ThemedText style={styles.optionName}>{option.name}</ThemedText>
                <ThemedText style={styles.optionDescription}>{option.description}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.infoSection}>
          <ThemedText style={styles.infoTitle}>Información Importante</ThemedText>
          
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#5E35B1" style={styles.infoIcon} />
            <ThemedText style={styles.infoText}>Resultados disponibles en 24-48 horas para la mayoría de las pruebas</ThemedText>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="water-outline" size={20} color="#5E35B1" style={styles.infoIcon} />
            <ThemedText style={styles.infoText}>Ayuno requerido para algunas pruebas. Consulta las indicaciones específicas</ThemedText>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="notifications-outline" size={20} color="#5E35B1" style={styles.infoIcon} />
            <ThemedText style={styles.infoText}>Recibirás una notificación cuando tus resultados estén listos</ThemedText>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  banner: {
    backgroundColor: '#EDE7F6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 150,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4527A0',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    color: '#5E35B1',
    maxWidth: '60%',
  },
  bannerIconContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionCard: {
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
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(94, 53, 177, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#777',
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
}); 