import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

type EmergencyType = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  route: string;
};

const emergencyTypes: EmergencyType[] = [
  {
    id: '1',
    name: 'Emergencia Médica',
    icon: 'medkit',
    description: 'Para situaciones que requieren atención médica inmediata',
    route: '/emergencia/medica',
  },
  {
    id: '2',
    name: 'Accidente',
    icon: 'car',
    description: 'Para situaciones donde ha ocurrido un accidente y se requiere asistencia',
    route: '/emergencia/accidente',
  },
  {
    id: '3',
    name: 'Traslado',
    icon: 'bus',
    description: 'Para traslados médicos programados o de emergencia',
    route: '/emergencia/traslado',
  },
];

export default function EmergenciaScreen() {
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
        <ThemedText style={styles.title}>Emergencia</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.alertBox}>
          <Ionicons name="alert-circle" size={24} color="#F44336" />
          <ThemedText style={styles.alertText}>
            Si estás en una situación de riesgo vital, llama directamente al número de emergencias 911
          </ThemedText>
        </View>
        
        <ThemedText style={styles.sectionTitle}>¿Qué tipo de emergencia necesitas?</ThemedText>
        
        {emergencyTypes.map((type) => (
          <TouchableOpacity 
            key={type.id}
            style={styles.emergencyTypeCard}
            onPress={() => router.push(type.route)}
          >
            <View style={styles.emergencyIcon}>
              <Ionicons name={type.icon} size={32} color="#F44336" />
            </View>
            <View style={styles.emergencyContent}>
              <ThemedText style={styles.emergencyName}>{type.name}</ThemedText>
              <ThemedText style={styles.emergencyDescription}>{type.description}</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
        
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#2D7FF9" />
          <ThemedText style={styles.infoText}>
            Nuestros servicios de emergencia están disponibles las 24 horas. Un profesional médico te atenderá lo antes posible.
          </ThemedText>
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
  alertBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  alertText: {
    color: '#D32F2F',
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emergencyTypeCard: {
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
  emergencyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emergencyDescription: {
    fontSize: 14,
    color: '#777',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
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
}); 