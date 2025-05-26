import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function CentroNotificacionesScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Resultados Listos', message: 'Tus resultados para la prueba de Glucosa ya están disponibles.', date: 'Hace 2 horas', read: false, type: 'resultado' },
    { id: '2', title: 'Recordatorio de Cita', message: 'No olvides tu cita para Hemograma mañana a las 9:00 AM.', date: 'Ayer', read: true, type: 'cita' },
    { id: '3', title: 'Preparación Importante', message: 'Recuerda ayuno de 8 horas para tu Perfil Lipídico.', date: 'Hace 3 días', read: false, type: 'preparacion' },
    { id: '4', title: 'Oferta Especial', message: '20% de descuento en chequeos generales este mes.', date: 'La semana pasada', read: true, type: 'oferta' },
  ]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'resultado': return 'document-text-outline';
      case 'cita': return 'calendar-outline';
      case 'preparacion': return 'information-circle-outline';
      case 'oferta': return 'pricetag-outline';
      default: return 'notifications-outline';
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(
      notifications.map(item => ({ ...item, read: true }))
    );
    Alert.alert('Notificaciones', 'Todas las notificaciones han sido marcadas como leídas');
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(item => 
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar notificación',
      '¿Estás seguro que deseas eliminar esta notificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setNotifications(
              notifications.filter(item => item.id !== id)
            );
          }
        }
      ]
    );
  };

  const handleNotificationPress = (item: any) => {
    handleMarkAsRead(item.id);
    
    // Navigate based on notification type
    if (item.type === 'resultado') {
      router.push('/laboratorio/resultados');
    } else if (item.type === 'cita') {
      router.push('/laboratorio/catalogo');
    } else {
      Alert.alert(item.title, item.message);
    }
  };

  const handleBackPress = () => {
    router.push('/laboratorio');
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#00A0B0', '#0081B0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Centro de Notificaciones</ThemedText>
          <TouchableOpacity 
            style={styles.markAllReadButton} 
            onPress={handleMarkAllRead}
            hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
          >
            <ThemedText style={styles.markAllRead}>
              Marcar todas
            </ThemedText>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.notificationCard, 
                !item.read && styles.unreadCard,
                { backgroundColor: isDarkMode ? 
                  Colors.dark.background : 
                  Colors.light.background }
              ]}
              onPress={() => handleNotificationPress(item)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={getIconForType(item.type) as any} 
                size={28} 
                color={isDarkMode ? Colors.dark.primary : '#00A0B0'} 
                style={styles.icon} 
              />
              <View style={styles.content}>
                <ThemedText style={styles.notificationTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.message}>{item.message}</ThemedText>
                <ThemedText style={styles.date}>{item.date}</ThemedText>
              </View>
              {!item.read && (
                <View style={[
                  styles.unreadDot, 
                  { backgroundColor: '#00A0B0' }
                ]} />
              )}
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              >
                <Ionicons 
                  name="trash-outline" 
                  size={20} 
                  color={isDarkMode ? '#ff6b6b' : '#dc3545'} 
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="notifications-off-outline" 
            size={64} 
            color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
          />
          <ThemedText style={styles.emptyText}>
            No tienes notificaciones
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginLeft: -36, // Compensate for the markAllRead button
    color: '#fff'
  },
  markAllReadButton: {
    padding: 8,
  },
  markAllRead: { 
    fontWeight: '500',
    fontSize: 14,
    color: '#fff'
  },
  list: {
    paddingVertical: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  unreadCard: {
    backgroundColor: '#E7F7F9', // Un ligero tinte para no leídas
  },
  icon: { 
    marginRight: 15 
  },
  content: { 
    flex: 1 
  },
  notificationTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  message: { 
    fontSize: 14, 
    marginBottom: 6 
  },
  date: { 
    fontSize: 12, 
    opacity: 0.6 
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  deleteButton: {
    padding: 10,
    marginLeft: 4
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    opacity: 0.7,
  }
}); 