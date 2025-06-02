import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Notification } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Animated, FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function CentroNotificacionesScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  
  // Estados para modales elegantes
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));
  const [modalMessage, setModalMessage] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);
  
  const [notifications, setNotifications] = useState<Notification[]>([
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
    setModalMessage('Todas las notificaciones han sido marcadas como leídas');
    setShowSuccessModal(true);
    animateModal();
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(item => 
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotificationToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setNotifications(
      notifications.filter(item => item.id !== notificationToDelete)
    );
    setShowDeleteModal(false);
    setModalMessage('Notificación eliminada correctamente');
    setShowSuccessModal(true);
    modalAnimation.setValue(0);
    animateModal();
  };

  const handleNotificationPress = (item: any) => {
    handleMarkAsRead(item.id);
    
    // Navigate based on notification type
    if (item.type === 'resultado') {
      router.push('/laboratorio/resultados');
    } else if (item.type === 'cita') {
      router.push('/laboratorio/catalogo');
    } else {
      setSelectedNotification(item);
      setShowNotificationModal(true);
      animateModal();
    }
  };

  const handleBackPress = () => {
    router.push('/laboratorio');
  };

  const animateModal = () => {
    Animated.spring(modalAnimation, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setShowDeleteModal(false);
    setShowNotificationModal(false);
    modalAnimation.setValue(0);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
            </TouchableOpacity>
            
            <View style={styles.greetingContainer}>
              <ThemedText style={styles.greeting}>
                Centro de Notificaciones
              </ThemedText>
              <View style={styles.editProfileIndicator}>
                <Ionicons name="notifications" size={14} color={Colors.light.primary} />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.markAllButton}
              onPress={handleMarkAllRead}
            >
              <Ionicons name="checkmark-done" size={20} color={Colors.light.white} />
            </TouchableOpacity>
          </View>
        </View>
        
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
                  onPress={() => handleDeleteNotification(item.id)}
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

        {/* Modal de Éxito */}
        <Modal
          visible={showSuccessModal}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={[
                styles.successModalContainer,
                { 
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
                  transform: [{ scale: modalAnimation }],
                  opacity: modalAnimation,
                }
              ]}
            >
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark-circle" size={64} color={Colors.light.success} />
              </View>
              
              <ThemedText style={[styles.successTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.textPrimary }]}>
                ¡Éxito!
              </ThemedText>
              
              <ThemedText style={[styles.successMessage, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                {modalMessage}
              </ThemedText>
              
              <TouchableOpacity 
                style={[styles.successButton, { backgroundColor: Colors.light.primary }]}
                onPress={closeModal}
              >
                <ThemedText style={[styles.successButtonText, { color: Colors.light.white }]}>
                  Entendido
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>

        {/* Modal de Confirmación de Eliminación */}
        <Modal
          visible={showDeleteModal}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={[
                styles.deleteModalContainer,
                { 
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
                  transform: [{ scale: modalAnimation }],
                  opacity: modalAnimation,
                }
              ]}
            >
              <View style={styles.deleteIconContainer}>
                <Ionicons name="trash" size={64} color={Colors.light.error} />
              </View>
              
              <ThemedText style={[styles.deleteTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.textPrimary }]}>
                Eliminar notificación
              </ThemedText>
              
              <ThemedText style={[styles.deleteMessage, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                ¿Estás seguro que deseas eliminar esta notificación?
              </ThemedText>
              
              <View style={styles.deleteButtons}>
                <TouchableOpacity 
                  style={[styles.deleteButton, styles.cancelButton]}
                  onPress={closeModal}
                >
                  <ThemedText style={[styles.cancelButtonText, { color: Colors.light.textSecondary }]}>
                    Cancelar
                  </ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.deleteButton, styles.confirmDeleteButton, { backgroundColor: Colors.light.error }]}
                  onPress={confirmDelete}
                >
                  <ThemedText style={[styles.confirmDeleteButtonText, { color: Colors.light.white }]}>
                    Eliminar
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>

        {/* Modal de Detalle de Notificación */}
        <Modal
          visible={showNotificationModal}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={[
                styles.notificationModalContainer,
                { 
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
                  transform: [{ scale: modalAnimation }],
                  opacity: modalAnimation,
                }
              ]}
            >
              <View style={styles.notificationIconContainer}>
                <Ionicons name="information-circle" size={64} color={Colors.light.primary} />
              </View>
              
              <ThemedText style={[styles.notificationTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.textPrimary }]}>
                {selectedNotification?.title}
              </ThemedText>
              
              <ThemedText style={[styles.notificationMessage, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                {selectedNotification?.message}
              </ThemedText>
              
              <TouchableOpacity 
                style={[styles.notificationButton, { backgroundColor: Colors.light.primary }]}
                onPress={closeModal}
              >
                <ThemedText style={[styles.notificationButtonText, { color: Colors.light.white }]}>
                  Cerrar
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
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
  list: {
    paddingVertical: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
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
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 4,
  },
  message: { 
    fontSize: 14, 
    marginBottom: 6,
    lineHeight: 18,
    flexWrap: 'wrap',
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
  },
  markAllButton: {
    padding: 6,
    marginLeft: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModalContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  successButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteModalContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  deleteIconContainer: {
    marginBottom: 20,
  },
  deleteTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  deleteButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  confirmDeleteButton: {
    // backgroundColor set inline
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmDeleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationModalContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationIconContainer: {
    marginBottom: 20,
  },
  notificationMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  notificationButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  notificationButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 