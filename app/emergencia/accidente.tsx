import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function EmergenciaAccidenteScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [description, setDescription] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<'low' | 'medium' | 'high' | null>(null);
  const [forSelf, setForSelf] = useState(true);
  
  const handleContinue = () => {
    router.push('/emergencia/ubicacion' as any);
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
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Accidente</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.alertBox, { 
          backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE',
          borderColor: isDarkMode ? 'rgba(244, 67, 54, 0.2)' : '#FFCDD2'
        }]}>
          <Ionicons name="alert-circle" size={24} color="#F44336" />
          <ThemedText style={[styles.alertText, { color: '#D32F2F' }]}>
            Si hay lesiones graves o sangrado abundante, llama directamente al 911
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
          <ThemedText style={styles.sectionTitle}>Describe el accidente</ThemedText>
          <TextInput
            style={[styles.descriptionInput, { 
              backgroundColor: isDarkMode ? Colors.dark.background : '#f5f5f5',
              color: isDarkMode ? Colors.dark.text : Colors.light.text
            }]}
            placeholder="Describe qué ocurrió: tipo de accidente, lesiones visibles, etc."
            placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : '#999'}
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
          />
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Gravedad de las lesiones</ThemedText>
          <View style={styles.severityContainer}>
            <TouchableOpacity 
              style={[
                styles.severityOption,
                selectedSeverity === 'low' && { borderColor: getSeverityColor('low') }
              ]}
              onPress={() => setSelectedSeverity('low')}
            >
              <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor('low') }]} />
              <ThemedText style={styles.severityText}>Leve</ThemedText>
              <ThemedText style={styles.severityDescription}>Rasguños menores, sin sangrado grave</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.severityOption,
                selectedSeverity === 'medium' && { borderColor: getSeverityColor('medium') }
              ]}
              onPress={() => setSelectedSeverity('medium')}
            >
              <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor('medium') }]} />
              <ThemedText style={styles.severityText}>Moderada</ThemedText>
              <ThemedText style={styles.severityDescription}>Contusiones, posible fractura</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.severityOption,
                selectedSeverity === 'high' && { borderColor: getSeverityColor('high') }
              ]}
              onPress={() => setSelectedSeverity('high')}
            >
              <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor('high') }]} />
              <ThemedText style={styles.severityText}>Grave</ThemedText>
              <ThemedText style={styles.severityDescription}>Sangrado abundante, pérdida de conciencia</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.infoBox, { 
          backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.1)' : '#E3F2FD',
          borderColor: isDarkMode ? 'rgba(45, 127, 249, 0.2)' : '#BBDEFB'
        }]}>
          <Ionicons name="information-circle" size={24} color={Colors.light.primary} />
          <ThemedText style={[styles.infoText, { color: Colors.light.primary }]}>
            Mientras llega la ayuda, mantén a la persona calmada y no muevas a alguien que pueda tener lesiones en la columna.
          </ThemedText>
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
  descriptionInput: {
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
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