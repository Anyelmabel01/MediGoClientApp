import { BottomNavbar } from '@/components/BottomNavbar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

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
      <StatusBar style="auto" />
      
      {/* Header simplificado */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <ThemedText style={styles.headerTitle}>Consulta Médica</ThemedText>
        </View>
      </View>
      
      <View style={styles.servicesHeaderContainer}>
        <ThemedText style={styles.subtitle}>Elige el tipo de consulta que necesitas</ThemedText>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Consultorio Option */}
        <TouchableOpacity 
          style={[styles.optionCard, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          }]}
          onPress={handleConsultorioSelect}
          activeOpacity={0.8}
        >
          <View style={[styles.optionIconContainer, { backgroundColor: 'rgba(5, 150, 105, 0.1)' }]}>
            <Ionicons name="business" size={32} color="#059669" />
          </View>
          
          <View style={styles.optionContent}>
            <ThemedText style={styles.optionTitle}>Consulta en Consultorio</ThemedText>
            <ThemedText style={[styles.optionDescription, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Agenda una cita presencial con médicos especialistas
            </ThemedText>
            
            <View style={styles.optionFeatures}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <ThemedText style={styles.featureText}>Consulta presencial</ThemedText>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <ThemedText style={styles.featureText}>Múltiples especialidades</ThemedText>
              </View>
            </View>
          </View>
          
          <View style={styles.optionAction}>
            <Ionicons name="chevron-forward" size={24} color="#059669" />
          </View>
        </TouchableOpacity>
        
        {/* Telemedicina Option */}
        <TouchableOpacity 
          style={[styles.optionCard, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          }]}
          onPress={handleTelemedicineSelect}
          activeOpacity={0.8}
        >
          <View style={[styles.optionIconContainer, { backgroundColor: Colors.light.primary + '20' }]}>
            <Ionicons name="videocam" size={32} color={Colors.light.primary} />
          </View>
          
          <View style={styles.optionContent}>
            <ThemedText style={styles.optionTitle}>Telemedicina</ThemedText>
            <ThemedText style={[styles.optionDescription, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Consulta con especialistas por videollamada desde casa
            </ThemedText>
            
            <View style={styles.optionFeatures}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.featureText}>Desde casa</ThemedText>
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
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
        }]}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="information-circle" size={24} color={Colors.light.primary} />
            </View>
            <ThemedText style={styles.infoTitle}>¿Necesitas ayuda?</ThemedText>
          </View>
          <ThemedText style={[styles.infoText, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            ¿No estás seguro? Contáctanos y te ayudaremos a elegir la mejor opción.
          </ThemedText>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="call" size={18} color={Colors.light.primary} />
            <ThemedText style={[styles.helpButtonText, { color: Colors.light.primary }]}>
              Contactar soporte
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <BottomNavbar />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingBottom: Platform.OS === 'ios' ? 80 : 60,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 45,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  servicesHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.primary,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 10,
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
    color: Colors.light.textSecondary,
  },
  optionAction: {
    marginLeft: 10,
  },
  infoSection: {
    padding: 18,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIconContainer: {
    marginRight: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 