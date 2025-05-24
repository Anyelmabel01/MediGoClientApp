import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

const { width } = Dimensions.get('window');

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
      
            {/* Header with gradient */}      <LinearGradient        colors={isDarkMode ? [Colors.dark.primary, Colors.dark.accent] : [Colors.light.primary, Colors.light.primaryLight]}        style={styles.headerGradient}      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Consulta Médica</ThemedText>
        </View>
        
        <View style={styles.headerContent}>
          <Ionicons name="medical-outline" size={60} color="white" style={styles.headerIcon} />
          <ThemedText style={styles.subtitle}>
            Elige el tipo de consulta que mejor se adapte a tus necesidades
          </ThemedText>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.optionsContent}
      >
        {/* Consultorio Option */}
        <TouchableOpacity 
          style={[styles.optionCard, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          }]}
          onPress={handleConsultorioSelect}
          activeOpacity={0.8}
        >
                    <LinearGradient            colors={[Colors.light.success, '#059669']}            style={styles.optionIconContainer}          >
            <Ionicons name="business" size={32} color="white" />
          </LinearGradient>
          
          <View style={styles.optionContent}>
            <ThemedText style={styles.optionTitle}>Consulta en Consultorio</ThemedText>
            <ThemedText style={[styles.optionDescription, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Agenda una cita presencial con médicos especialistas en sus consultorios
            </ThemedText>
            
            <View style={styles.optionFeatures}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.light.success} />
                <ThemedText style={styles.featureText}>Consulta presencial</ThemedText>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.light.success} />
                <ThemedText style={styles.featureText}>Múltiples especialidades</ThemedText>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.light.success} />
                <ThemedText style={styles.featureText}>Evaluación completa</ThemedText>
              </View>
            </View>
          </View>
          
          <View style={styles.optionAction}>
            <Ionicons name="chevron-forward" size={24} color={Colors.light.success} />
          </View>
        </TouchableOpacity>
        
        {/* Telemedicina Option */}
        <TouchableOpacity 
          style={[styles.optionCard, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          }]}
          onPress={handleTelemedicineSelect}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.light.primary, Colors.light.primaryDark]}
            style={styles.optionIconContainer}
          >
            <Ionicons name="videocam" size={32} color="white" />
          </LinearGradient>
          
          <View style={styles.optionContent}>
            <ThemedText style={styles.optionTitle}>Telemedicina</ThemedText>
            <ThemedText style={[styles.optionDescription, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Consulta con especialistas por videollamada desde la comodidad de tu hogar
            </ThemedText>
            
            <View style={styles.optionFeatures}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.featureText}>Desde casa</ThemedText>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.featureText}>Horarios flexibles</ThemedText>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.featureText}>Disponible 24/7</ThemedText>
              </View>
            </View>
          </View>
          
          <View style={styles.optionAction}>
            <Ionicons name="chevron-forward" size={24} color={Colors.light.primary} />
          </View>
        </TouchableOpacity>

        {/* Quick Info Section */}
        <View style={[styles.infoSection, {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        }]}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={Colors.light.primary} />
            <ThemedText style={styles.infoTitle}>¿Necesitas ayuda?</ThemedText>
          </View>
          <ThemedText style={[styles.infoText, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            Si no estás seguro del tipo de consulta que necesitas, contáctanos y te ayudaremos a elegir la opción más adecuada.
          </ThemedText>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="call" size={16} color={Colors.light.primary} />
            <ThemedText style={[styles.helpButtonText, { color: Colors.light.primary }]}>
              Contactar soporte
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
    color: 'white',
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerIcon: {
    marginBottom: 10,
    opacity: 0.9,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    opacity: 0.9,
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
    marginTop: -20,
  },
  optionsContent: {
    padding: 20,
    paddingTop: 30,
  },
  optionCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
  },
  optionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  optionFeatures: {
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500',
  },
  optionAction: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  infoSection: {
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 