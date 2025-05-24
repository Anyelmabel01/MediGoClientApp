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
  icon: keyof typeof Ionicons.glyphMap;
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
      icon: 'notifications',
      type: 'toggle',
      value: true
    },
    {
      id: 'darkMode',
      title: 'Modo oscuro',
      icon: 'moon',
      type: 'toggle',
      value: isDarkMode
    },
    {
      id: 'language',
      title: 'Idioma',
      icon: 'language',
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
      icon: 'document-text',
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
      icon: 'shield',
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
      icon: 'help-circle',
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
      icon: 'information-circle',
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

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Configuración</ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferencias</ThemedText>
          
          {configOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={option.type === 'action' ? option.action : undefined}
            >
              <View style={styles.optionLeft}>
                <Ionicons 
                  name={option.icon} 
                  size={24} 
                  color={MEDIGO_COLORS.primary}
                />
                <ThemedText style={styles.optionTitle}>{option.title}</ThemedText>
              </View>
              {option.type === 'toggle' ? (
                <Switch
                  value={option.value}
                  onValueChange={(newValue) => handleToggleChange(option.id, newValue)}
                  trackColor={{ 
                    false: '#767577',
                    true: MEDIGO_COLORS.primary
                  }}
                  thumbColor="#f4f3f4"
                />
              ) : (
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color={isDarkMode ? '#ccc' : '#666'} 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Legal y Soporte</ThemedText>
          
          {legalOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={option.action}
            >
              <View style={styles.optionLeft}>
                <Ionicons 
                  name={option.icon} 
                  size={24} 
                  color={MEDIGO_COLORS.primary}
                />
                <ThemedText style={styles.optionTitle}>{option.title}</ThemedText>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={isDarkMode ? '#ccc' : '#666'} 
              />
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons 
            name="log-out" 
            size={24} 
            color={Colors.light.error}
          />
          <ThemedText style={styles.logoutText}>Cerrar sesión</ThemedText>
        </TouchableOpacity>
      </ScrollView>
      
      <BottomNavbar />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 25 : 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#00A0B0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.error,
    fontWeight: '500',
  },
}); 