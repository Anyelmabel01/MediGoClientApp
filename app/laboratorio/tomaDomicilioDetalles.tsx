import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function TomaDomicilioDetallesScreen() {
  const details = {
    proceso: [
      'Agenda tu cita y confirma tu dirección.',
      'Un flebotomista certificado acudirá a tu domicilio.',
      'Se realizará la toma de muestra siguiendo protocolos de seguridad.',
      'Las muestras se transportan de forma segura al laboratorio.',
      'Recibe tus resultados en línea.',
    ],
    areaServicioUrl: 'https://example.com/mapa-servicio.png', // URL de ejemplo
    preparacion: [
      'Sigue las instrucciones específicas de ayuno para tu prueba.',
      'Ten a la mano una identificación oficial.',
      'Prepara un espacio cómodo y bien iluminado.',
    ],
    queEsperar: [
      'Identificación clara del técnico.',
      'Uso de equipo estéril y desechable.',
      'Tiempo estimado de la visita: 15-30 minutos.',
      'Cuidados post-toma indicados por el técnico.',
    ],
    faqs: [
      { q: '¿Es seguro?', a: 'Sí, nuestros técnicos están capacitados y siguen estrictos protocolos de higiene y seguridad.' },
      { q: '¿Tiene costo extra?', a: 'Puede aplicar un costo adicional por el servicio a domicilio. Consulta al agendar.' },
    ]
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.title}>Toma de Muestra a Domicilio</ThemedText>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Proceso del Servicio</ThemedText>
          {details.proceso.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Ionicons name="ellipse" size={10} color="#00A0B0" style={styles.bulletPoint} />
              <ThemedText style={styles.text}>{item}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Área de Servicio</ThemedText>
          {/* Placeholder para mapa del área */}
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={48} color="#CED4DA" />
            <ThemedText style={{color:'#6C757D', marginTop:8}}>Mapa del área de servicio</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Guía de Preparación</ThemedText>
          {details.preparacion.map((item, i) => (
             <View key={i} style={styles.listItem}>
              <Ionicons name="checkmark-done-circle-outline" size={20} color="green" style={styles.listItemIcon} />
              <ThemedText style={styles.text}>{item}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Qué Esperar Durante la Visita</ThemedText>
           {details.queEsperar.map((item, i) => (
             <View key={i} style={styles.listItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#00A0B0" style={styles.listItemIcon} />
              <ThemedText style={styles.text}>{item}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preguntas Frecuentes (FAQs)</ThemedText>
          {details.faqs.map((faq, i) => (
            <View key={i} style={styles.faqItem}>
              <ThemedText style={styles.faqQuestion}>P: {faq.q}</ThemedText>
              <ThemedText style={styles.faqAnswer}>R: {faq.a}</ThemedText>
            </View>
          ))}
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 20, backgroundColor: '#fff', padding:15, borderRadius:10, borderWidth:1, borderColor: '#E9ECEF' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#00A0B0' },
  text: { fontSize: 14, marginBottom: 6, lineHeight: 20, flexShrink:1 },
  mapPlaceholder: { height: 150, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FA', borderRadius: 8 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  listItemIcon: { marginRight: 8, marginTop:2 },
  bulletPoint: { marginRight: 8, marginTop: 6 },
  faqItem: { marginBottom:12 },
  faqQuestion: { fontWeight:'bold', fontSize:15, marginBottom:3 },
  faqAnswer: { fontSize:14, lineHeight:19, color:'#333'}
}); 