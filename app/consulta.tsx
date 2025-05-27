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
      
      {/* Header compacto con gradiente */}
      <LinearGradient
        colors={isDarkMode ? [Colors.dark.primary, Colors.dark.accent] : [Colors.light.primary, Colors.light.primaryLight]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Consulta Médica</ThemedText>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.optionsContent}
      >
        {/* Breve descripción */}
        <View style={styles.briefDescription}>
          <Ionicons name="medical-outline" size={32} color={Colors.light.primary} style={styles.descriptionIcon} />
          <ThemedText style={styles.subtitle}>
            Elige el tipo de consulta que mejor se adapte a tus necesidades
          </ThemedText>
        </View>
        
        {/* Consultorio Option */}
        <TouchableOpacity 
          style={[styles.optionCard, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          }]}
          onPress={handleConsultorioSelect}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.light.success, '#059669']}
            style={styles.optionIconContainer}
          >
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
    paddingTop: 40, // Reducido de 50
    paddingBottom: 16, // Reducido de 30
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20, // Reducido de 24
    fontWeight: 'bold',
    marginLeft: 12,
    color: 'white',
  },
  briefDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  descriptionIcon: {
    marginRight: 12,
  },
  subtitle: {
    fontSize: 15,
    flex: 1,
    color: '#212529',
  },
  optionsContainer: {
    flex: 1,
  },
  optionsContent: {
    padding: 16,
    paddingTop: 0,
  },
  optionCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
    width: 56,
    height: 56,
    borderRadius: 28,
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
    gap: 6,
  },
  featureText: {
    fontSize: 13,
  },
  optionAction: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  infoSection: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 8,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 