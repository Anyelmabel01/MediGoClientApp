import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
  const { isDarkMode } = useTheme();

  const handleEmergencySelect = (route: string) => {
    router.push(route as any);
  };

  const handleQuickEmergency = () => {
    // Ir directamente a emergencia médica como acción rápida
    router.push('/emergencia/medica' as any);
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
        <ThemedText style={styles.title}>Emergencia</ThemedText>
        
        {/* Botón de emergencia prominente */}
        <TouchableOpacity 
          style={styles.emergencyQuickButton}
          onPress={handleQuickEmergency}
        >
          <Ionicons name="flash" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Botón de emergencia prominente principal */}
      <TouchableOpacity 
        style={styles.prominentEmergencyButton}
        onPress={handleQuickEmergency}
      >
        <View style={styles.emergencyButtonContent}>
          <Ionicons name="flash" size={32} color="white" />
          <View style={styles.emergencyButtonText}>
            <ThemedText style={styles.emergencyButtonTitle}>EMERGENCIA</ThemedText>
            <ThemedText style={styles.emergencyButtonSubtitle}>Solicitar ayuda inmediata</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
      
      <ScrollView style={styles.content}>
        <View style={[styles.alertBox, { 
          backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE',
          borderColor: isDarkMode ? 'rgba(244, 67, 54, 0.2)' : '#FFCDD2'
        }]}>
          <Ionicons name="alert-circle" size={24} color="#F44336" />
          <ThemedText style={[styles.alertText, { color: '#D32F2F' }]}>
            Si estás en una situación de riesgo vital, llama directamente al número de emergencias 911
          </ThemedText>
        </View>
        
        <ThemedText style={styles.sectionTitle}>¿Qué tipo de emergencia necesitas?</ThemedText>
        
        {emergencyTypes.map((type) => (
          <TouchableOpacity 
            key={type.id}
            style={[styles.emergencyTypeCard, { 
              backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
              borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
              borderWidth: 1
            }]}
            onPress={() => handleEmergencySelect(type.route)}
          >
            <View style={[styles.emergencyIcon, { 
              backgroundColor: isDarkMode ? 'rgba(244, 67, 54, 0.15)' : 'rgba(244, 67, 54, 0.1)'
            }]}>
              <Ionicons name={type.icon} size={32} color="#F44336" />
            </View>
            <View style={styles.emergencyContent}>
              <ThemedText style={styles.emergencyName}>{type.name}</ThemedText>
              <ThemedText style={[styles.emergencyDescription, { 
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
              }]}>{type.description}</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} />
          </TouchableOpacity>
        ))}
        
        <View style={[styles.infoBox, { 
          backgroundColor: isDarkMode ? 'rgba(45, 127, 249, 0.1)' : '#E3F2FD',
          borderColor: isDarkMode ? 'rgba(45, 127, 249, 0.2)' : '#BBDEFB'
        }]}>
          <Ionicons name="information-circle" size={24} color={Colors.light.primary} />
          <ThemedText style={[styles.infoText, { color: Colors.light.primary }]}>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emergencyTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.light.shadowColor,
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
  },
  infoBox: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
  },
  emergencyQuickButton: {
    backgroundColor: '#F44336',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prominentEmergencyButton: {
    backgroundColor: '#F44336',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#F44336',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyButtonText: {
    marginLeft: 16,
  },
  emergencyButtonTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emergencyButtonSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
}); 