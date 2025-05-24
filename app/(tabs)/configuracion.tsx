import { BottomNavbar } from '@/components/BottomNavbar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Notifications from 'expo-notifications'; // REMOVIDO
import { handleError } from '@/utils/errorHandler';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

interface ConfigOption {
  id: string;
  title: string;
  description?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBackground: string;
  iconColor: string;
  type: 'toggle' | 'action';
  value?: boolean;
  action?: () => void;
}

// Definir la paleta de colores de MediGo al inicio del archivo
const MEDIGO_COLORS = {
  primary: '#00A0B0',
  primaryLight: '#33b5c2',
  primaryDark: '#006070',
  accent: '#70D0E0',
};

export default function ConfiguracionScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [configOptions, setConfigOptions] = useState<ConfigOption[]>([
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Recibe alertas importantes',
      icon: 'notifications',
      iconBackground: '#FFE5E5',
      iconColor: '#FF4444',
      type: 'toggle',
      value: true
    },
    {
      id: 'darkMode',
      title: 'Modo oscuro',
      description: 'Cambia el tema de la aplicación',
      icon: 'moon',
      iconBackground: '#E5E7EB',
      iconColor: '#6B7280',
      type: 'toggle',
      value: isDarkMode
    },
    {
      id: 'language',
      title: 'Idioma',
      description: 'Español (ES)',
      icon: 'language',
      iconBackground: '#E5F3FF',
      iconColor: Colors.light.primary,
      type: 'action',
      action: () => {
        Alert.alert(
          'Seleccionar Idioma',
          'Elige tu idioma preferido',
          [
            { 
              text: 'Español', 
              onPress: async () => {
                await AsyncStorage.setItem('userLanguage', 'es');
                Alert.alert('Idioma actualizado', 'La aplicación se reiniciará para aplicar los cambios');
              }
            },
            { 
              text: 'English', 
              onPress: async () => {
                await AsyncStorage.setItem('userLanguage', 'en');
                Alert.alert('Language updated', 'The app will restart to apply changes');
              }
            },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
      }
    }
  ]);

  const legalOptions: ConfigOption[] = [
    {
      id: 'terms',
      title: 'Términos y condiciones',
      description: 'Revisa nuestros términos de uso',
      icon: 'document-text',
      iconBackground: '#F3E8FF',
      iconColor: '#8B5CF6',
      type: 'action',
      action: () => {
        Alert.alert(
          'Términos y Condiciones',
          'MediGo - Términos y Condiciones\n\n' +
          '1. Uso del Servicio\n' +
          'MediGo es una plataforma integral de servicios médicos que conecta pacientes con profesionales de la salud. Al utilizar nuestra aplicación, aceptas estos términos y condiciones.\n\n' +
          '2. Cuentas de Usuario\n' +
          'Los usuarios deben proporcionar información precisa y mantener la confidencialidad de sus credenciales. La cuenta es personal e intransferible.\n\n' +
          '3. Servicios Médicos\n' +
          'MediGo facilita la conexión entre pacientes y profesionales de la salud. No somos responsables de los servicios médicos proporcionados por terceros.\n\n' +
          '4. Privacidad y Seguridad\n' +
          'Nos comprometemos a proteger tu información personal y médica según nuestra política de privacidad y las leyes aplicables.\n\n' +
          '5. Modificaciones\n' +
          'Nos reservamos el derecho de modificar estos términos en cualquier momento, notificando a los usuarios sobre cambios significativos.\n\n' +
          '6. Limitación de Responsabilidad\n' +
          'MediGo no se hace responsable por daños indirectos o consecuentes derivados del uso de la plataforma.',
          [{ text: 'Entendido' }]
        );
      }
    },
    {
      id: 'privacy',
      title: 'Política de privacidad',
      description: 'Cómo protegemos tu información',
      icon: 'shield',
      iconBackground: '#E8F5E8',
      iconColor: '#4CAF50',
      type: 'action',
      action: () => {
        Alert.alert(
          'Política de Privacidad',
          'MediGo - Política de Privacidad\n\n' +
          '1. Información Recopilada\n' +
          'Recopilamos información necesaria para proporcionar nuestros servicios, incluyendo:\n' +
          '- Datos personales (nombre, edad, género)\n' +
          '- Información médica (historial, medicamentos)\n' +
          '- Datos de contacto y ubicación\n\n' +
          '2. Uso de la Información\n' +
          'Utilizamos tu información para:\n' +
          '- Gestionar citas médicas y servicios\n' +
          '- Proporcionar atención médica personalizada\n' +
          '- Mejorar nuestros servicios\n' +
          '- Enviar notificaciones importantes\n\n' +
          '3. Protección de Datos\n' +
          'Implementamos medidas de seguridad avanzadas para proteger tu información, incluyendo:\n' +
          '- Encriptación de datos\n' +
          '- Acceso restringido\n' +
          '- Monitoreo continuo\n\n' +
          '4. Compartir Información\n' +
          'Solo compartimos información con:\n' +
          '- Profesionales de la salud autorizados\n' +
          '- Según lo requiera la ley\n' +
          '- Con tu consentimiento explícito\n\n' +
          '5. Tus Derechos\n' +
          'Tienes derecho a:\n' +
          '- Acceder a tu información\n' +
          '- Corregir datos inexactos\n' +
          '- Solicitar eliminación de datos\n' +
          '- Oponerte al procesamiento\n\n' +
          '6. Contacto\n' +
          'Para consultas sobre privacidad, contacta a nuestro equipo de protección de datos en Panatec@gmail.com',
          [{ text: 'Entendido' }]
        );
      }
    },
    {
      id: 'help',
      title: 'Ayuda y soporte',
      description: 'Obtén asistencia técnica',
      icon: 'help-circle',
      iconBackground: '#FEF3C7',
      iconColor: '#F59E0B',
      type: 'action',
      action: () => {
        Alert.alert(
          'Ayuda y Soporte',
          '¿Necesitas ayuda?\n\n' +
          'Nuestro equipo está aquí para ayudarte:\n\n' +
          '📧 Email: Panatec@gmail.com\n' +
          '📞 Teléfono: +1 (555) 123-4567\n\n' +
          'Horario de atención:\n' +
          'Lunes a Viernes: 8:00 AM - 8:00 PM\n' +
          'Sábados: 9:00 AM - 2:00 PM\n\n' +
          'Servicios de soporte:\n' +
          '• Asistencia técnica\n' +
          '• Consultas sobre servicios\n' +
          '• Reporte de problemas\n' +
          '• Sugerencias y mejoras',
          [
            { text: 'Enviar Email', onPress: () => Linking.openURL('mailto:Panatec@gmail.com') },
            { text: 'Llamar', onPress: () => Linking.openURL('tel:+15551234567') },
            { text: 'Cerrar' }
          ]
        );
      }
    },
    {
      id: 'about',
      title: 'Acerca de MediGo',
      description: 'Información sobre la aplicación',
      icon: 'information-circle',
      iconBackground: '#E0F2FE',
      iconColor: '#0891B2',
      type: 'action',
      action: () => {
        Alert.alert(
          'Acerca de MediGo',
          'MediGo - Tu Compañero de Salud Digital\n\n' +
          'MediGo es una plataforma innovadora que revoluciona la forma en que gestionas tu salud. Nuestra misión es hacer que el acceso a los servicios médicos sea más fácil, eficiente y accesible para todos.\n\n' +
          'Características principales:\n' +
          '• Gestión inteligente de citas médicas\n' +
          '• Historial médico digital completo\n' +
          '• Recetas médicas electrónicas\n' +
          '• Resultados de laboratorio en tiempo real\n' +
          '• Servicios de emergencia integrados\n' +
          '• Consultas virtuales\n\n' +
          'Nuestra tecnología:\n' +
          '• Plataforma segura y confiable\n' +
          '• Interfaz intuitiva y fácil de usar\n' +
          '• Actualizaciones constantes\n' +
          '• Soporte 24/7\n\n' +
          'Desarrollado con ❤️ por Panatec\n' +
          'Versión 1.0.0\n\n' +
          '© 2024 MediGo. Todos los derechos reservados.',
          [{ text: 'Entendido' }]
        );
      }
    }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setConfigOptions(options => 
        options.map(option => {
          if (option.id === 'darkMode') {
            return { ...option, value: isDarkMode };
          }
          return option;
        })
      );
    } catch (error) {
      handleError(error);
    }
  };

  const handleToggleChange = async (id: string, newValue: boolean) => {
    if (id === 'darkMode') {
      await toggleDarkMode(newValue);
    }
    setConfigOptions(options => 
      options.map(option => 
        option.id === id 
          ? { ...option, value: newValue } 
          : option
      )
    );
  };

  const handleLogout = () => {
    signOut();
  };

  const renderOptionCard = (option: ConfigOption) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.optionCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}
      onPress={option.type === 'action' ? option.action : undefined}
      activeOpacity={0.7}
    >
      <View style={[styles.optionIcon, { backgroundColor: option.iconBackground }]}>
        <Ionicons 
          name={option.icon} 
          size={24} 
          color={option.iconColor}
        />
      </View>
      
      <View style={styles.optionContent}>
        <ThemedText style={styles.optionTitle}>{option.title}</ThemedText>
        {option.description && (
          <ThemedText style={[styles.optionDescription, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
            {option.description}
          </ThemedText>
        )}
      </View>
      
      {option.type === 'toggle' ? (
        <Switch
          value={option.value}
          onValueChange={(newValue) => handleToggleChange(option.id, newValue)}
          trackColor={{ 
            false: '#E5E5E5',
            true: Colors.light.primary
          }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <View style={styles.chevronContainer}>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={Colors.light.primary}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header moderno unificado */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>Configuración</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Personaliza tu experiencia</ThemedText>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sección de Preferencias */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferencias</ThemedText>
          <View style={styles.cardsContainer}>
            {configOptions.map(renderOptionCard)}
          </View>
        </View>

        {/* Sección Legal y Soporte */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Legal y Soporte</ThemedText>
          <View style={styles.cardsContainer}>
            {legalOptions.map(renderOptionCard)}
          </View>
        </View>
        
        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity
          style={styles.logoutCard}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View style={[styles.optionIcon, { backgroundColor: '#FFE5E5' }]}>
            <Ionicons 
              name="log-out" 
              size={24} 
              color="#FF4444"
            />
          </View>
          
          <View style={styles.optionContent}>
            <ThemedText style={[styles.optionTitle, { color: '#FF4444' }]}>Cerrar sesión</ThemedText>
            <ThemedText style={[styles.optionDescription, { color: '#FF6B6B' }]}>
              Salir de tu cuenta de MediGo
            </ThemedText>
          </View>
          
          <View style={styles.chevronContainer}>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color="#FF4444"
            />
          </View>
        </TouchableOpacity>

        {/* Espaciado inferior para la bottom navbar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      
      <BottomNavbar />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: Platform.OS === 'android' ? 25 : 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F2937',
  },
  cardsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  chevronContainer: {
    padding: 8,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 100,
  },
}); 