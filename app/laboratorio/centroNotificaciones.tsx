import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function CentroNotificacionesScreen() {
  // Placeholder data
  const notifications = [
    { id: '1', title: 'Resultados Listos', message: 'Tus resultados para la prueba de Glucosa ya están disponibles.', date: 'Hace 2 horas', read: false, type: 'resultado' },
    { id: '2', title: 'Recordatorio de Cita', message: 'No olvides tu cita para Hemograma mañana a las 9:00 AM.', date: 'Ayer', read: true, type: 'cita' },
    { id: '3', title: 'Preparación Importante', message: 'Recuerda ayuno de 8 horas para tu Perfil Lipídico.', date: 'Hace 3 días', read: false, type: 'preparacion' },
    { id: '4', title: 'Oferta Especial', message: '20% de descuento en chequeos generales este mes.', date: 'La semana pasada', read: true, type: 'oferta' },
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case 'resultado': return 'document-text-outline';
      case 'cita': return 'calendar-outline';
      case 'preparacion': return 'information-circle-outline';
      case 'oferta': return 'pricetag-outline';
      default: return 'notifications-outline';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Centro de Notificaciones</ThemedText>
        <TouchableOpacity>
          <ThemedText style={styles.markAllRead}>Marcar todas como leídas</ThemedText>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.notificationCard, !item.read && styles.unreadCard]}>
            <Ionicons name={getIconForType(item.type) as any} size={28} color="#00A0B0" style={styles.icon} />
            <View style={styles.content}>
              <ThemedText style={styles.notificationTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.message}>{item.message}</ThemedText>
              <ThemedText style={styles.date}>{item.date}</ThemedText>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
            <TouchableOpacity style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color="#dc3545" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom:10, 
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'center' 
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  markAllRead: { color: '#00A0B0', fontWeight:'500' },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  unreadCard: {
    backgroundColor: '#E7F7F9', // Un ligero tinte para no leídas
  },
  icon: { marginRight: 15 },
  content: { flex: 1 },
  notificationTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 3 },
  message: { fontSize: 14, color: '#555', marginBottom: 5 },
  date: { fontSize: 12, color: '#777' },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00A0B0',
    marginLeft: 10,
  },
  deleteButton: {
    padding: 8,
    marginLeft:5
  }
}); 