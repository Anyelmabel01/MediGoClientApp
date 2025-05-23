import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function DetallesLaboratorioScreen() {
  // Placeholder data
  const lab = {
    nombre: 'Laboratorio Clínico Central',
    direccion: 'Av. Siempre Viva 123, Col. Primavera, Ciudad Ejemplo',
    contacto: 'Tel: (55) 1234-5678 | Email: contacto@labcentral.com',
    horario: 'Lunes a Viernes: 7:00 AM - 7:00 PM | Sábados: 8:00 AM - 2:00 PM',
    acreditaciones: ['ISO 9001', 'CAP Accredited'],
    servicios: ['Análisis de Sangre', 'Urinálisis', 'Pruebas COVID-19', 'Marcadores Tumorales'],
    tomaDomicilio: true,
    rating: 4.8,
    reviews: [
      { user: 'Ana P.', comment: 'Excelente servicio y atención rápida.', rating: 5 },
      { user: 'Carlos M.', comment: 'Resultados entregados a tiempo, muy profesionales.', rating: 4 },
    ],
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.title}>{lab.nombre}</ThemedText>

        {/* Aquí podría ir un componente de Mapa mostrando la ubicación */}
        <View style={styles.mapPlaceholder}>
            <Ionicons name="location-sharp" size={48} color="#00A0B0" />
            <ThemedText style={{color:'#6C757D', marginTop:8}}>Mapa de Ubicación</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Información de Contacto</ThemedText>
          <ThemedText style={styles.text}><Ionicons name="location-outline" size={16} /> {lab.direccion}</ThemedText>
          <ThemedText style={styles.text}><Ionicons name="call-outline" size={16} /> {lab.contacto}</ThemedText>
          <ThemedText style={styles.text}><Ionicons name="time-outline" size={16} /> {lab.horario}</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Acreditaciones</ThemedText>
          {lab.acreditaciones.map((acc, i) => <ThemedText key={i} style={styles.text}>• {acc}</ThemedText>)}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Servicios Ofrecidos</ThemedText>
          {lab.servicios.slice(0,3).map((srv, i) => <ThemedText key={i} style={styles.text}>• {srv}</ThemedText>)}
          {lab.servicios.length > 3 && <ThemedText style={styles.linkText}>Ver todos los servicios...</ThemedText>}
          <ThemedText style={styles.text}>Toma a domicilio: {lab.tomaDomicilio ? 'Sí' : 'No'}</ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Reseñas de Usuarios ({lab.rating}★)</ThemedText>
          {lab.reviews.map((review, i) => (
            <View key={i} style={styles.reviewCard}>
              <ThemedText style={styles.reviewUser}>{review.user} ({review.rating}★)</ThemedText>
              <ThemedText style={styles.reviewComment}>"{review.comment}"</ThemedText>
            </View>
          ))}
          <ThemedText style={styles.linkText}>Ver todas las reseñas...</ThemedText>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
            <Ionicons name="calendar-outline" size={20} color="white" />
            <ThemedText style={styles.primaryButtonText}>Agendar Prueba Aquí</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="map-outline" size={20} color="#00A0B0" />
            <ThemedText style={styles.buttonText}>Obtener Direcciones</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call-outline" size={20} color="#00A0B0" />
            <ThemedText style={styles.buttonText}>Llamar al Laboratorio</ThemedText>
          </TouchableOpacity>
           <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={20} color="#00A0B0" />
            <ThemedText style={styles.buttonText}>Guardar en Favoritos</ThemedText>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  mapPlaceholder: { height: 150, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E9ECEF', borderRadius: 12, marginBottom: 20 },
  section: { marginBottom: 20, backgroundColor: '#fff', padding:15, borderRadius:10, borderWidth:1, borderColor: '#E9ECEF' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#00A0B0' },
  text: { fontSize: 14, marginBottom: 6, lineHeight: 20 },
  linkText: { fontSize: 14, color: '#007bff', marginTop: 5, fontWeight:'500' }, 
  reviewCard: { marginBottom:10, paddingBottom:8, borderBottomWidth:1, borderBottomColor:'#F0F0F0'},
  reviewUser: {fontWeight:'bold', fontSize:14, marginBottom:3},
  reviewComment: {fontStyle:'italic', fontSize:13, color:'#444'},
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
}); 