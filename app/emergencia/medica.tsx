import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function EmergenciaMedicaScreen() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<'low' | 'medium' | 'high' | null>(null);
  const [forSelf, setForSelf] = useState(true);
  
  const handleContinue = () => {
    router.push('/emergencia/ubicacion');
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FFC107';
      case 'high':
        return '#F44336';
      default:
        return '#ccc';
    }
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
        <ThemedText style={styles.title}>Emergencia Médica</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.alertBox}>
          <Ionicons name="alert-circle" size={24} color="#F44336" />
          <ThemedText style={styles.alertText}>
            Si estás en una situación de riesgo vital, llama directamente al número de emergencias 911
          </ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>¿Para quién solicitas la atención?</ThemedText>
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                forSelf && styles.selectedOption
              ]}
              onPress={() => setForSelf(true)}
            >
              <Ionicons 
                name="person" 
                size={20} 
                color={forSelf ? 'white' : '#777'} 
              />
              <ThemedText style={[
                styles.optionText,
                forSelf && styles.selectedOptionText
              ]}>Para mí</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                !forSelf && styles.selectedOption
              ]}
              onPress={() => setForSelf(false)}
            >
              <Ionicons 
                name="people" 
                size={20} 
                color={!forSelf ? 'white' : '#777'} 
              />
              <ThemedText style={[
                styles.optionText,
                !forSelf && styles.selectedOptionText
              ]}>Para otra persona</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Describe la emergencia</ThemedText>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe brevemente qué está sucediendo"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
            placeholderTextColor="#999"
          />
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Nivel de urgencia</ThemedText>
          <View style={styles.severityContainer}>
            <TouchableOpacity 
              style={[
                styles.severityOption,
                selectedSeverity === 'low' && { borderColor: getSeverityColor('low') }
              ]}
              onPress={() => setSelectedSeverity('low')}
            >
              <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor('low') }]} />
              <ThemedText style={styles.severityText}>Baja</ThemedText>
              <ThemedText style={styles.severityDescription}>No es urgente pero requiere atención</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.severityOption,
                selectedSeverity === 'medium' && { borderColor: getSeverityColor('medium') }
              ]}
              onPress={() => setSelectedSeverity('medium')}
            >
              <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor('medium') }]} />
              <ThemedText style={styles.severityText}>Media</ThemedText>
              <ThemedText style={styles.severityDescription}>Requiere atención pronto</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.severityOption,
                selectedSeverity === 'high' && { borderColor: getSeverityColor('high') }
              ]}
              onPress={() => setSelectedSeverity('high')}
            >
              <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor('high') }]} />
              <ThemedText style={styles.severityText}>Alta</ThemedText>
              <ThemedText style={styles.severityDescription}>Requiere atención inmediata</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.continueButton,
            (!description || !selectedSeverity) && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!description || !selectedSeverity}
        >
          <ThemedText style={styles.continueButtonText}>Continuar</ThemedText>
        </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    flex: 0.48,
  },
  selectedOption: {
    backgroundColor: '#F44336',
  },
  optionText: {
    marginLeft: 8,
    color: '#777',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  descriptionInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    color: '#333',
  },
  severityContainer: {
    gap: 12,
  },
  severityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  severityIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  severityText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  severityDescription: {
    color: '#777',
    fontSize: 13,
    flex: 1,
  },
  continueButton: {
    backgroundColor: '#F44336',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: '#FFCDD2',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 