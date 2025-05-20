import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

export default function ConsultaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const handleConsultorioSelect = () => {
    router.push('/consulta/consultorio');
  };

  const handleTelemedicineSelect = () => {
    router.push('/consulta/telemedicina');
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
        <ThemedText style={styles.title}>Consulta Médica</ThemedText>
      </View>
      
      <View style={styles.options}>
        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}
          onPress={handleConsultorioSelect}
        >
          <View style={styles.optionImageContainer}>
            <Ionicons name="medical" size={80} color={Colors.light.primary} />
          </View>
          <ThemedText style={styles.optionTitle}>Consulta en Consultorio</ThemedText>
          <ThemedText style={[styles.optionDescription, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
            Agenda una cita presencial con médicos especialistas en su consultorio
          </ThemedText>
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward-circle" size={24} color={Colors.light.primary} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}
          onPress={handleTelemedicineSelect}
        >
          <View style={styles.optionImageContainer}>
            <Ionicons name="videocam" size={80} color={Colors.light.primary} />
          </View>
          <ThemedText style={styles.optionTitle}>Telemedicina</ThemedText>
          <ThemedText style={[styles.optionDescription, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
            Consulta con especialistas por videollamada desde donde estés
          </ThemedText>
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward-circle" size={24} color={Colors.light.primary} />
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
    borderRadius: 12,
    padding: 20,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 200,
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.light.border,
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
    textAlign: 'center',
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
}); 