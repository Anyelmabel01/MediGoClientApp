import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function EmergenciaUbicacionScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [selectedOption, setSelectedOption] = useState<'current' | 'saved' | 'new' | null>(null);
  const [newAddress, setNewAddress] = useState('');
  const [reference, setReference] = useState('');
  const [buildingDetails, setBuildingDetails] = useState('');
  const [accessInstructions, setAccessInstructions] = useState('');
  
  const handleContinue = () => {
    router.push('/emergencia/paciente' as any);
  };

  const canContinue = selectedOption && (
    selectedOption !== 'new' || (newAddress.trim() !== '')
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
        <ThemedText style={styles.title}>Ubicación de Emergencia</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.alertBox, { 
          backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE',
          borderColor: isDarkMode ? 'rgba(244, 67, 54, 0.2)' : '#FFCDD2'
        }]}>
          <Ionicons name="location" size={24} color="#F44336" />
          <ThemedText style={[styles.alertText, { color: '#D32F2F' }]}>
            Es importante proporcionar la ubicación exacta para una respuesta rápida
          </ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>¿Dónde necesitas el servicio?</ThemedText>
          
          <TouchableOpacity 
            style={[
              styles.optionCard,
              { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                borderColor: selectedOption === 'current' ? Colors.light.primary : (isDarkMode ? Colors.dark.border : Colors.light.border)
              }
            ]}
            onPress={() => setSelectedOption('current')}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="navigate" size={24} color={Colors.light.primary} />
              <ThemedText style={styles.optionTitle}>Usar ubicación actual</ThemedText>
              {selectedOption === 'current' && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
              )}
            </View>
            <ThemedText style={[styles.optionDescription, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Detectamos automáticamente tu ubicación GPS actual
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.optionCard,
              { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                borderColor: selectedOption === 'saved' ? Colors.light.primary : (isDarkMode ? Colors.dark.border : Colors.light.border)
              }
            ]}
            onPress={() => setSelectedOption('saved')}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="bookmark" size={24} color={Colors.light.primary} />
              <ThemedText style={styles.optionTitle}>Dirección guardada</ThemedText>
              {selectedOption === 'saved' && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
              )}
            </View>
            <ThemedText style={[styles.optionDescription, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Casa: Calle 50 #15-20, San Francisco
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.optionCard,
              { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                borderColor: selectedOption === 'new' ? Colors.light.primary : (isDarkMode ? Colors.dark.border : Colors.light.border)
              }
            ]}
            onPress={() => setSelectedOption('new')}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="add-circle-outline" size={24} color={Colors.light.primary} />
              <ThemedText style={styles.optionTitle}>Ingresar nueva dirección</ThemedText>
              {selectedOption === 'new' && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
              )}
            </View>
            <ThemedText style={[styles.optionDescription, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Escribir una dirección diferente
            </ThemedText>
          </TouchableOpacity>
        </View>

        {selectedOption === 'new' && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Detalles de la dirección</ThemedText>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Dirección *</ThemedText>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}
                placeholder="Ej: Calle 50 #15-20, San Francisco"
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
                value={newAddress}
                onChangeText={setNewAddress}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Puntos de referencia</ThemedText>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}
                placeholder="Ej: Frente al supermercado El Rey"
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
                value={reference}
                onChangeText={setReference}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Edificio/Apartamento</ThemedText>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}
                placeholder="Ej: Edificio Torre Azul, Apto 5B"
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
                value={buildingDetails}
                onChangeText={setBuildingDetails}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Instrucciones de acceso</ThemedText>
              <TextInput
                style={[styles.textAreaInput, { 
                  backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}
                placeholder="Ej: Portería en el primer piso, código 1234"
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
                value={accessInstructions}
                onChangeText={setAccessInstructions}
                multiline={true}
                numberOfLines={3}
              />
            </View>
          </View>
        )}
        
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !canContinue && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
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
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  alertText: {
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
    marginBottom: 16,
  },
  optionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
  optionDescription: {
    fontSize: 14,
    marginLeft: 36,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textAreaInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
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