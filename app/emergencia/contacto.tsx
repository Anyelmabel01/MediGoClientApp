import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

const RELATIONSHIPS = [
  'Padre/Madre',
  'Hijo/Hija',
  'Esposo/Esposa',
  'Hermano/Hermana',
  'Abuelo/Abuela',
  'Tío/Tía',
  'Primo/Prima',
  'Amigo/Amiga',
  'Otro',
];

export default function EmergenciaContactoScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [useMyInfo, setUseMyInfo] = useState(true);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  
  const handleContinue = () => {
    router.push('/emergencia/confirmacion' as any);
  };

  const canContinue = useMyInfo || (
    contactName.trim() !== '' && 
    contactPhone.trim() !== '' && 
    relationship.trim() !== ''
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
        <ThemedText style={styles.title}>Información de Contacto</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.infoBox, { 
          backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.1)' : '#E3F2FD',
          borderColor: isDarkMode ? 'rgba(45, 127, 249, 0.2)' : '#BBDEFB'
        }]}>
          <Ionicons name="call" size={24} color={Colors.light.primary} />
          <ThemedText style={[styles.infoText, { color: Colors.light.primary }]}>
            Esta persona será contactada durante la emergencia para coordinar la atención
          </ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>¿Qué información de contacto usar?</ThemedText>
          
          <TouchableOpacity 
            style={[
              styles.optionCard,
              { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                borderColor: useMyInfo ? Colors.light.primary : (isDarkMode ? Colors.dark.border : Colors.light.border)
              }
            ]}
            onPress={() => setUseMyInfo(true)}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="person-circle" size={24} color={Colors.light.primary} />
              <ThemedText style={styles.optionTitle}>Usar mi información</ThemedText>
              {useMyInfo && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
              )}
            </View>
            <ThemedText style={[styles.optionDescription, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Juan Pérez - +507 6123-4567
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.optionCard,
              { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                borderColor: !useMyInfo ? Colors.light.primary : (isDarkMode ? Colors.dark.border : Colors.light.border)
              }
            ]}
            onPress={() => setUseMyInfo(false)}
          >
            <View style={styles.optionHeader}>
              <Ionicons name="people-circle" size={24} color={Colors.light.primary} />
              <ThemedText style={styles.optionTitle}>Contacto diferente</ThemedText>
              {!useMyInfo && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
              )}
            </View>
            <ThemedText style={[styles.optionDescription, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Especificar otra persona como contacto
            </ThemedText>
          </TouchableOpacity>
        </View>

        {!useMyInfo && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Datos del contacto *</ThemedText>
            
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Nombre completo *</ThemedText>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}
                placeholder="Nombre y apellidos"
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
                value={contactName}
                onChangeText={setContactName}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Número de teléfono *</ThemedText>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
                  color: isDarkMode ? Colors.dark.text : Colors.light.text
                }]}
                placeholder="+507 6123-4567"
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Relación con el paciente *</ThemedText>
              <View style={styles.relationshipContainer}>
                {RELATIONSHIPS.map((rel) => (
                  <TouchableOpacity 
                    key={rel}
                    style={[
                      styles.relationshipChip,
                      relationship === rel && styles.selectedRelationship
                    ]}
                    onPress={() => setRelationship(rel)}
                  >
                    <ThemedText style={[
                      styles.relationshipText,
                      relationship === rel && styles.selectedRelationshipText
                    ]}>{rel}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={[styles.warningBox, { 
          backgroundColor: isDarkMode ? 'rgba(255, 152, 0, 0.1)' : '#FFF3E0',
          borderColor: isDarkMode ? 'rgba(255, 152, 0, 0.2)' : '#FFCC02'
        }]}>
          <Ionicons name="warning" size={24} color="#FF9800" />
          <View style={styles.warningContent}>
            <ThemedText style={[styles.warningTitle, { color: '#FF9800' }]}>
              Importante
            </ThemedText>
            <ThemedText style={[styles.warningText, { color: '#FF9800' }]}>
              Asegúrate de que el número de teléfono sea correcto. Nos comunicaremos contigo durante la emergencia.
            </ThemedText>
          </View>
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
  relationshipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relationshipChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  selectedRelationship: {
    backgroundColor: '#F44336',
  },
  relationshipText: {
    fontSize: 14,
    color: '#777',
  },
  selectedRelationshipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  warningBox: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    borderWidth: 1,
  },
  warningContent: {
    marginLeft: 12,
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  warningText: {
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