import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

type LabOption = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  route: string;
};

const labOptions: LabOption[] = [
  {
    id: '1',
    name: 'Solicitar Pruebas',
    icon: 'flask',
    description: 'Programa una visita para toma de muestras a domicilio',
    route: '/laboratorio/solicitar',
  },
  {
    id: '2',
    name: 'Mis Resultados',
    icon: 'document-text',
    description: 'Consulta los resultados de tus pruebas de laboratorio',
    route: '/laboratorio/resultados',
  },
  {
    id: '3',
    name: 'Historial',
    icon: 'time',
    description: 'Revisa el historial de todas tus pruebas realizadas',
    route: '/laboratorio/historial',
  },
  {
    id: '4',
    name: 'Pruebas Disponibles',
    icon: 'list',
    description: 'Explora el catálogo de pruebas de laboratorio disponibles',
    route: '/laboratorio/catalogo',
  },
];

export default function LaboratorioScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const handleOptionPress = (route: string) => {
    router.push(route as any);
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
        <ThemedText style={styles.title}>Laboratorio</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.banner, { 
          backgroundColor: isDarkMode ? 'rgba(94, 53, 177, 0.15)' : '#EDE7F6'
        }]}>
          <ThemedText style={[styles.bannerTitle, { color: '#4527A0' }]}>
            Laboratorio a Domicilio
          </ThemedText>
          <ThemedText style={[styles.bannerText, { color: '#5E35B1' }]}>
            Nuestros especialistas tomarán tus muestras donde tú estés.
          </ThemedText>
          <View style={styles.bannerIconContainer}>
            <Ionicons name="flask" size={80} color="#4527A0" />
          </View>
        </View>
        
        <View style={styles.optionsContainer}>
          {labOptions.map((option) => (
            <TouchableOpacity 
              key={option.id}
              style={[styles.optionCard, { 
                backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
                borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                borderWidth: 1
              }]}
              onPress={() => handleOptionPress(option.route)}
            >
              <View style={[styles.optionIcon, { 
                backgroundColor: isDarkMode ? 'rgba(94, 53, 177, 0.15)' : 'rgba(94, 53, 177, 0.1)'
              }]}>
                <Ionicons name={option.icon} size={28} color="#5E35B1" />
              </View>
              <View style={styles.optionContent}>
                <ThemedText style={styles.optionName}>{option.name}</ThemedText>
                <ThemedText style={[styles.optionDescription, { 
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
                }]}>{option.description}</ThemedText>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
              />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={[styles.infoSection, { 
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          borderWidth: 1
        }]}>
          <ThemedText style={styles.infoTitle}>Información Importante</ThemedText>
          
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#5E35B1" style={styles.infoIcon} />
            <ThemedText style={[styles.infoText, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Resultados disponibles en 24-48 horas para la mayoría de las pruebas
            </ThemedText>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="water-outline" size={20} color="#5E35B1" style={styles.infoIcon} />
            <ThemedText style={[styles.infoText, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Ayuno requerido para algunas pruebas. Consulta las indicaciones específicas
            </ThemedText>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="notifications-outline" size={20} color="#5E35B1" style={styles.infoIcon} />
            <ThemedText style={[styles.infoText, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              Recibirás una notificación cuando tus resultados estén listos
            </ThemedText>
          </View>
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
  banner: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 150,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    maxWidth: '60%',
  },
  bannerIconContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionCard: {
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
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  infoSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
}); 