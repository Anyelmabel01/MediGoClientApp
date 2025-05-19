import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

export default function ConsultaScreen() {
  const router = useRouter();

  const handleConsultorioSelect = () => {
    router.push('/consulta/consultorio');
  };

  const handleTelemedicineSelect = () => {
    router.push('/consulta/telemedicina');
  };

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
        <ThemedText style={styles.title}>Consulta Médica</ThemedText>
      </View>
      
      <View style={styles.options}>
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={handleConsultorioSelect}
        >
          <View style={styles.optionImageContainer}>
            <Ionicons name="medical" size={80} color="#2D7FF9" />
          </View>
          <ThemedText style={styles.optionTitle}>Consulta en Consultorio</ThemedText>
          <ThemedText style={styles.optionDescription}>
            Agenda una cita presencial con médicos especialistas en su consultorio
          </ThemedText>
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward-circle" size={24} color="#2D7FF9" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={handleTelemedicineSelect}
        >
          <View style={styles.optionImageContainer}>
            <Ionicons name="videocam" size={80} color="#2D7FF9" />
          </View>
          <ThemedText style={styles.optionTitle}>Telemedicina</ThemedText>
          <ThemedText style={styles.optionDescription}>
            Consulta con especialistas por videollamada desde donde estés
          </ThemedText>
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward-circle" size={24} color="#2D7FF9" />
          </View>
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
    marginBottom: 30,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  options: {
    flex: 1,
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 200,
    position: 'relative',
  },
  optionImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  optionImage: {
    width: 120,
    height: 120,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
}); 