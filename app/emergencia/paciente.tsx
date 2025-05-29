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

  const canContinue = patientName.trim() !== '' && patientAge.trim() !== '';

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Información del Paciente</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.infoBox, { 
          backgroundColor: Colors.light.primary + '10',
          borderColor: Colors.light.primary + '30'
        }]}>
          <Ionicons name="information-circle" size={24} color={Colors.light.primary} />
          <ThemedText style={[styles.infoText, { color: Colors.light.primary }]}>
            Esta información ayudará a nuestros paramédicos a brindar la mejor atención
          </ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Datos del paciente *</ThemedText>
          
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Nombre completo *</ThemedText>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: Colors.light.white,
                color: isDarkMode ? Colors.dark.text : Colors.light.text
              }]}
              placeholder="Nombre y apellidos del paciente"
              placeholderTextColor={Colors.light.textSecondary}
              value={patientName}
              onChangeText={setPatientName}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Edad *</ThemedText>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: Colors.light.white,
                color: isDarkMode ? Colors.dark.text : Colors.light.text
              }]}
              placeholder="Edad en años"
              placeholderTextColor={Colors.light.textSecondary}
              value={patientAge}
              onChangeText={setPatientAge}
              keyboardType="numeric"
            />
          </View>
        </View>

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
              backgroundColor: Colors.light.white,
              color: isDarkMode ? Colors.dark.text : Colors.light.text
            }]}
            placeholder="Describe alergias alimentarias, medicamentos, etc."
            placeholderTextColor={Colors.light.textSecondary}
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
              backgroundColor: Colors.light.white,
              color: isDarkMode ? Colors.dark.text : Colors.light.text
            }]}
            placeholder="Lista los medicamentos que toma regularmente"
            placeholderTextColor={Colors.light.textSecondary}
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
    paddingTop: 45,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.white,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  infoBox: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.primary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.primary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bloodTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.primary + '30',
    backgroundColor: Colors.light.white,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedBloodType: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  bloodTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.primary + '30',
    backgroundColor: Colors.light.white,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCondition: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  conditionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  selectedConditionText: {
    color: 'white',
  },
  conditionCheck: {
    marginLeft: 6,
  },
  continueButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: Colors.light.textSecondary,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 