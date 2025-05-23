import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function DetallesPruebaScreen() {
  const router = useRouter();
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

  const handleAgendar = () => {
    router.push({ pathname: '/laboratorio/solicitar', params: { nombrePrueba: prueba.nombre } });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
          <ThemedText style={styles.price}>${prueba.precio} MXN</ThemedText>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#00A0B0' },
  label: { fontSize: 15, fontWeight: '600', marginTop: 8, marginBottom: 2 },
  text: { fontSize: 14, marginBottom: 6, lineHeight: 20 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#007bff', marginBottom: 6 },
  listItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  listItemIcon: { marginRight: 8 },
  actionsContainer: { marginTop: 20, marginBottom: 30 },
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
  buttonText: { fontSize: 16, marginLeft: 8, color: '#00A0B0', fontWeight:'600' },
  primaryButtonText: { fontSize: 16, marginLeft: 8, color: 'white', fontWeight:'600' },
}); 