import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function DetallesResultadoScreen() {
  // Placeholder data
  const resultado = {
    nombrePrueba: 'Perfil Lipídico Completo',
    fechaRealizacion: '2024-05-15',
    laboratorioNombre: 'Laboratorio Central XYZ',
    medicoSolicitante: 'Dr. Alan Parsons',
    pdfUrl: 'https://example.com/fake-report.pdf', // URL de ejemplo
    resumen: [
      { medicion: 'Colesterol Total', valor: '210 mg/dL', rangoNormal: '<200 mg/dL', estado: 'Alto' },
      { medicion: 'Triglicéridos', valor: '180 mg/dL', rangoNormal: '<150 mg/dL', estado: 'Alto' },
      { medicion: 'HDL Colesterol', valor: '45 mg/dL', rangoNormal: '>40 mg/dL', estado: 'Normal' },
      { medicion: 'LDL Colesterol', valor: '130 mg/dL', rangoNormal: '<100 mg/dL', estado: 'Alto' },
    ],
    comparacionHistorica: true, // Simula que hay datos históricos
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.title}>Detalle del Resultado</ThemedText>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Información del Examen</ThemedText>
          <ThemedText style={styles.label}>Prueba:</ThemedText>
          <ThemedText style={styles.text}>{resultado.nombrePrueba}</ThemedText>
          <ThemedText style={styles.label}>Fecha:</ThemedText>
          <ThemedText style={styles.text}>{resultado.fechaRealizacion}</ThemedText>
          <ThemedText style={styles.label}>Laboratorio:</ThemedText>
          <ThemedText style={styles.text}>{resultado.laboratorioNombre}</ThemedText>
          {resultado.medicoSolicitante && (
            <>
              <ThemedText style={styles.label}>Médico Solicitante:</ThemedText>
              <ThemedText style={styles.text}>{resultado.medicoSolicitante}</ThemedText>
            </>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Documento del Resultado</ThemedText>
          <TouchableOpacity style={styles.actionButtonAlt}>
            <Ionicons name="cloud-download-outline" size={20} color="#00A0B0" />
            <ThemedText style={styles.buttonTextAlt}>Descargar PDF</ThemedText>
          </TouchableOpacity>
           <TouchableOpacity style={styles.actionButtonAlt}>
            <Ionicons name="share-social-outline" size={20} color="#00A0B0" />
            <ThemedText style={styles.buttonTextAlt}>Compartir con Médico</ThemedText>
          </TouchableOpacity>
          {/* Aquí iría un Visor PDF si se integra uno */}
          <View style={styles.pdfPlaceholder}>
            <Ionicons name="document-text-outline" size={48} color="#CED4DA" />
            <ThemedText style={{color:'#6C757D', marginTop:8}}>Vista previa del PDF no disponible</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Resumen de Mediciones</ThemedText>
          {resultado.resumen.map((item, index) => (
            <View key={index} style={styles.medicionRow}>
              <ThemedText style={styles.medicionNombre}>{item.medicion}:</ThemedText>
              <ThemedText style={[styles.medicionValor, item.estado !== 'Normal' && styles.valorAnormal]}>{item.valor}</ThemedText>
              <ThemedText style={styles.medicionRango}>(Ref: {item.rangoNormal})</ThemedText>
            </View>
          ))}
        </View>

        {resultado.comparacionHistorica && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Comparación Histórica</ThemedText>
            {/* Placeholder para gráfico o tabla */}
            <View style={styles.graficoPlaceholder}>
              <Ionicons name="stats-chart-outline" size={48} color="#CED4DA" />
              <ThemedText style={{color:'#6C757D', marginTop:8}}>Gráfico de tendencias no disponible</ThemedText>
            </View>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="help-circle-outline" size={20} color="#00A0B0" />
            <ThemedText style={styles.buttonText}>Hacer Preguntas</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
            <Ionicons name="calendar-outline" size={20} color="white" />
            <ThemedText style={styles.primaryButtonText}>Agendar Seguimiento</ThemedText>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 20, backgroundColor: '#fff', padding:15, borderRadius:10, borderWidth:1, borderColor: '#E9ECEF' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#00A0B0' },
  label: { fontSize: 15, fontWeight: '600', marginTop: 8, marginBottom: 2 },
  text: { fontSize: 14, marginBottom: 6, lineHeight: 20 },
  pdfPlaceholder: { height: 150, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FA', borderRadius: 8, marginTop:10 },
  graficoPlaceholder: { height: 150, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FA', borderRadius: 8 }, 
  medicionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
  medicionNombre: { fontSize: 14, flex:2, fontWeight:'500' },
  medicionValor: { fontSize: 14, fontWeight: 'bold', flex:1.5, textAlign:'right' },
  valorAnormal: { color: '#dc3545' },
  medicionRango: { fontSize: 12, color: '#6C757D', flex:1.5, textAlign:'right' },
  actionsContainer: { marginTop: 10, marginBottom: 30 },
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
  actionButtonAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor:'#E9ECEF',
    marginBottom: 10,
    paddingHorizontal:15,
    justifyContent:'center'
  },
  buttonTextAlt: {
    fontSize: 15, marginLeft: 8, color: '#00A0B0', fontWeight:'500' 
  }
}); 