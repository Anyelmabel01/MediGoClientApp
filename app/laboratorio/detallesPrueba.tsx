import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function DetallesPruebaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  
  // Placeholder data - en una app real, esto vendría de props o un fetch
  const prueba = {
    nombre: 'Glucosa en Ayunas',
    descripcionDetallada: 'Esta prueba mide los niveles de glucosa en la sangre después de un período de ayuno, generalmente de 8 a 12 horas. Es crucial para el diagnóstico y manejo de la diabetes.',
    queMide: 'Niveles de glucosa en sangre.',
    porQueEsImportante: 'Diagnóstico de diabetes, prediabetes y monitoreo de tratamiento.',
    rangosNormales: '70-99 mg/dL',
    preparacion: [
      'Ayuno de 8-12 horas antes de la prueba.',
      'No consumir bebidas azucaradas ni alcohol.',
      'Informar sobre medicamentos actuales al personal de laboratorio.',
    ],
    tipoMuestra: 'Sangre venosa',
    tiempoResultados: '24-48 horas',
    precio: 120,
    labsDisponibles: ['Laboratorio Central', 'Clínica Norte'],
    tomaDomicilio: true,
  };

  const colors = isDarkMode ? Colors.dark : Colors.light;

  const handleAgendar = () => {
    router.push({ pathname: '/laboratorio/solicitar', params: { nombrePrueba: prueba.nombre } });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
            </TouchableOpacity>
            
            <View style={styles.greetingContainer}>
              <ThemedText style={styles.greeting}>
                Detalles de Prueba
              </ThemedText>
              <View style={styles.editProfileIndicator}>
                <Ionicons name="flask" size={14} color={Colors.light.primary} />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => console.log('Añadir a favoritos')}
            >
              <Ionicons name="heart-outline" size={20} color={Colors.light.white} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedText style={styles.title}>{prueba.nombre}</ThemedText>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Información General</ThemedText>
            <ThemedText style={styles.label}>Descripción:</ThemedText>
            <ThemedText style={styles.text}>{prueba.descripcionDetallada}</ThemedText>
            <ThemedText style={styles.label}>¿Qué mide?</ThemedText>
            <ThemedText style={styles.text}>{prueba.queMide}</ThemedText>
            <ThemedText style={styles.label}>¿Por qué es importante?</ThemedText>
            <ThemedText style={styles.text}>{prueba.porQueEsImportante}</ThemedText>
            <ThemedText style={styles.label}>Rangos Normales Referenciales:</ThemedText>
            <ThemedText style={styles.text}>{prueba.rangosNormales}</ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Preparación</ThemedText>
            {prueba.preparacion.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color="green" style={styles.listItemIcon} />
                <ThemedText style={styles.text}>{item}</ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Especificaciones de la Prueba</ThemedText>
            <ThemedText style={styles.label}>Tipo de Muestra:</ThemedText>
            <ThemedText style={styles.text}>{prueba.tipoMuestra}</ThemedText>
            <ThemedText style={styles.label}>Tiempo de Entrega de Resultados:</ThemedText>
            <ThemedText style={styles.text}>{prueba.tiempoResultados}</ThemedText>
            <ThemedText style={styles.label}>Precio:</ThemedText>
            <ThemedText style={styles.price}>Bs {prueba.precio} VED</ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Disponibilidad</ThemedText>
            <ThemedText style={styles.label}>Laboratorios que la ofrecen:</ThemedText>
            {prueba.labsDisponibles.map((lab, index) => (
               <ThemedText key={index} style={styles.text}>- {lab}</ThemedText>
            ))}
            <ThemedText style={styles.label}>Toma a domicilio disponible:</ThemedText>
            <ThemedText style={styles.text}>{prueba.tomaDomicilio ? 'Sí' : 'No'}</ThemedText>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleAgendar}>
              <Ionicons name="calendar-outline" size={20} color="white" />
              <ThemedText style={styles.primaryButtonText}>Agendar Prueba</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={20} color="#00A0B0" />
              <ThemedText style={styles.buttonText}>Añadir a Favoritos</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={20} color="#00A0B0" />
              <ThemedText style={styles.buttonText}>Compartir</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  greeting: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  editProfileIndicator: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 4,
    marginLeft: 8,
  },
  favoriteButton: {
    padding: 8,
    marginLeft: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  section: { 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#00A0B0' 
  },
  label: { 
    fontSize: 15, 
    fontWeight: '600', 
    marginTop: 8, 
    marginBottom: 2 
  },
  text: { 
    fontSize: 14, 
    marginBottom: 6, 
    lineHeight: 20 
  },
  price: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#007bff', 
    marginBottom: 6 
  },
  listItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  listItemIcon: { 
    marginRight: 8 
  },
  actionsContainer: { 
    marginTop: 20, 
    marginBottom: 30 
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00A0B0',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#00A0B0',
  },
  buttonText: { 
    fontSize: 16, 
    marginLeft: 8, 
    color: '#00A0B0', 
    fontWeight:'600' 
  },
  primaryButtonText: { 
    fontSize: 16, 
    marginLeft: 8, 
    color: 'white', 
    fontWeight:'600' 
  },
}); 