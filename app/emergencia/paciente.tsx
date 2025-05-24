import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type BloodType = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';

const BLOOD_TYPES: BloodType[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const COMMON_CONDITIONS = [
  'Diabetes',
  'Hipertensión',
  'Asma',
  'Cardiopatía',
  'Epilepsia',
  'Cáncer',
  'VIH/SIDA',
  'Enfermedad renal',
];

export default function EmergenciaPacienteScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [forSelf, setForSelf] = useState(true);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  
  const handleContinue = () => {
    router.push('/emergencia/contacto' as any);
  };

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter(c => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  const canContinue = forSelf || (patientName.trim() !== '' && patientAge.trim() !== '');

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
        <ThemedText style={styles.title}>Información del Paciente</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.infoBox, { 
          backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.1)' : '#E3F2FD',
          borderColor: isDarkMode ? 'rgba(45, 127, 249, 0.2)' : '#BBDEFB'
        }]}>
          <Ionicons name="information-circle" size={24} color={Colors.light.primary} />
          <ThemedText style={[styles.infoText, { color: Colors.light.primary }]}>
            Esta información ayudará a nuestros paramédicos a brindar la mejor atención
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

        {!forSelf && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Datos del paciente *</ThemedText>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Nombre completo *</ThemedText>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}
                placeholder="Nombre y apellidos del paciente"
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
                value={patientName}
                onChangeText={setPatientName}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Edad *</ThemedText>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}
                placeholder="Edad en años"
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
                value={patientAge}
                onChangeText={setPatientAge}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tipo de sangre (opcional)</ThemedText>
          <View style={styles.bloodTypeContainer}>
            {BLOOD_TYPES.map((bloodType) => (
              <TouchableOpacity 
                key={bloodType}
                style={[
                  styles.bloodTypeButton,
                  selectedBloodType === bloodType && styles.selectedBloodType
                ]}
                onPress={() => setSelectedBloodType(selectedBloodType === bloodType ? null : bloodType)}
              >
                <ThemedText style={[
                  styles.bloodTypeText,
                  selectedBloodType === bloodType && styles.selectedBloodTypeText
                ]}>{bloodType}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Condiciones médicas conocidas</ThemedText>
          <View style={styles.conditionsContainer}>
            {COMMON_CONDITIONS.map((condition) => (
              <TouchableOpacity 
                key={condition}
                style={[
                  styles.conditionChip,
                  selectedConditions.includes(condition) && styles.selectedCondition
                ]}
                onPress={() => toggleCondition(condition)}
              >
                <ThemedText style={[
                  styles.conditionText,
                  selectedConditions.includes(condition) && styles.selectedConditionText
                ]}>{condition}</ThemedText>
                {selectedConditions.includes(condition) && (
                  <Ionicons name="checkmark" size={16} color="white" style={styles.conditionCheck} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Alergias conocidas</ThemedText>
          <TextInput
            style={[styles.textAreaInput, { 
              backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
              color: isDarkMode ? Colors.dark.text : Colors.light.text
            }]}
            placeholder="Ej: Penicilina, mariscos, polen..."
            placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
            value={allergies}
            onChangeText={setAllergies}
            multiline={true}
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Medicamentos actuales</ThemedText>
          <TextInput
            style={[styles.textAreaInput, { 
              backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
              color: isDarkMode ? Colors.dark.text : Colors.light.text
            }]}
            placeholder="Ej: Aspirina 100mg diario, Omeprazol 20mg..."
            placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
            value={medications}
            onChangeText={setMedications}
            multiline={true}
            numberOfLines={3}
          />
        </View>
        
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
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
  bloodTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bloodTypeButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBloodType: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  bloodTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#777',
  },
  selectedBloodTypeText: {
    color: 'white',
  },
  conditionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCondition: {
    backgroundColor: '#F44336',
  },
  conditionText: {
    fontSize: 14,
    color: '#777',
  },
  selectedConditionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  conditionCheck: {
    marginLeft: 4,
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