import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type TransferType = 'hospital' | 'home' | 'appointment' | 'emergency';

const TRANSFER_TYPES = [
  { 
    id: 'hospital' as const, 
    label: 'Al hospital', 
    description: 'Traslado urgente a centro médico',
    icon: 'medical' as const
  },
  { 
    id: 'home' as const, 
    label: 'A casa', 
    description: 'Traslado desde hospital a domicilio',
    icon: 'home' as const
  },
  { 
    id: 'appointment' as const, 
    label: 'A cita médica', 
    description: 'Traslado para consulta o examen',
    icon: 'calendar' as const
  },
  { 
    id: 'emergency' as const, 
    label: 'Emergencia', 
    description: 'Traslado de emergencia entre centros',
    icon: 'flash' as const
  },
];

export default function EmergenciaTrasladoScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [selectedType, setSelectedType] = useState<TransferType | null>(null);
  const [description, setDescription] = useState('');
  const [forSelf, setForSelf] = useState(true);
  const [needsAssistance, setNeedsAssistance] = useState(false);
  
  const handleContinue = () => {
    router.push('/emergencia/ubicacion' as any);
  };

  const canContinue = selectedType && description.trim() !== '';

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
        <ThemedText style={styles.title}>Traslado Médico</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.infoBox, { 
          backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.1)' : '#E3F2FD',
          borderColor: isDarkMode ? 'rgba(45, 127, 249, 0.2)' : '#BBDEFB'
        }]}>
          <Ionicons name="information-circle" size={24} color={Colors.light.primary} />
          <ThemedText style={[styles.infoText, { color: Colors.light.primary }]}>
            Servicio de traslado médico seguro y cómodo con personal especializado
          </ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>¿Para quién solicitas el traslado?</ThemedText>
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
          <ThemedText style={styles.sectionTitle}>Tipo de traslado</ThemedText>
          {TRANSFER_TYPES.map((type) => (
            <TouchableOpacity 
              key={type.id}
              style={[
                styles.typeCard,
                { 
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                  borderColor: selectedType === type.id ? Colors.light.primary : (isDarkMode ? Colors.dark.border : Colors.light.border)
                }
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <View style={styles.typeHeader}>
                <View style={[styles.typeIcon, { backgroundColor: Colors.light.primary + '20' }]}>
                  <Ionicons name={type.icon} size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.typeInfo}>
                  <ThemedText style={styles.typeLabel}>{type.label}</ThemedText>
                  <ThemedText style={[styles.typeDescription, { 
                    color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
                  }]}>
                    {type.description}
                  </ThemedText>
                </View>
                {selectedType === type.id && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Detalles del traslado</ThemedText>
          <TextInput
            style={[styles.descriptionInput, { 
              backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
              color: isDarkMode ? Colors.dark.text : Colors.light.text
            }]}
            placeholder="Describe el motivo del traslado, destino específico, horario preferido, etc."
            placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Asistencia especial</ThemedText>
          <TouchableOpacity 
            style={[
              styles.assistanceOption,
              needsAssistance && styles.selectedAssistance
            ]}
            onPress={() => setNeedsAssistance(!needsAssistance)}
          >
            <Ionicons 
              name={needsAssistance ? "checkbox" : "square-outline"} 
              size={24} 
              color={needsAssistance ? Colors.light.primary : '#777'} 
            />
            <View style={styles.assistanceText}>
              <ThemedText style={styles.assistanceLabel}>Requiere asistencia especial</ThemedText>
              <ThemedText style={[styles.assistanceDescription, { 
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
              }]}>
                Silla de ruedas, camilla, ayuda para caminar, etc.
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {selectedType === 'emergency' && (
          <View style={[styles.alertBox, { 
            backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE',
            borderColor: isDarkMode ? 'rgba(244, 67, 54, 0.2)' : '#FFCDD2'
          }]}>
            <Ionicons name="alert-circle" size={24} color="#F44336" />
            <ThemedText style={[styles.alertText, { color: '#D32F2F' }]}>
              Para traslados de emergencia críticos, considera llamar directamente al 911
            </ThemedText>
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
  typeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeInfo: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
  },
  descriptionInput: {
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  assistanceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  selectedAssistance: {
    backgroundColor: Colors.light.primary + '20',
  },
  assistanceText: {
    marginLeft: 12,
    flex: 1,
  },
  assistanceLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  assistanceDescription: {
    fontSize: 14,
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