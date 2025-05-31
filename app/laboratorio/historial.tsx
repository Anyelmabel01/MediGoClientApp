import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

import { useState } from 'react';
import { Alert, Animated, Modal, ScrollView, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

// Datos de ejemplo simplificados
const groupedHistory = [
  { date: 'Junio 2024', tests: [
    { id: '1', name: 'Glucosa en Ayunas', status: 'Normal' },
    { id: '2', name: 'Colesterol Total', status: 'Anormal' },
  ]},
  { date: 'Mayo 2024', tests: [
    { id: '3', name: 'Hemoglobina', status: 'Normal' },
  ]},
];

export default function HistorialScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Junio 2024': true, 
    'Mayo 2024': true,
    'Abril 2024': true
  });

  // Estados para modales elegantes
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));
  const [modalMessage, setModalMessage] = useState('');

  const colors = isDarkMode ? Colors.dark : Colors.light;

  const handleBackPress = () => {
    router.push('/laboratorio');
  };

  const toggleGroup = (date: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  // Función para navegar al detalle
  const handleTestPress = (testId: string, testName: string) => {
    console.log("Navegando a detalles:", testId, testName);
    router.push({
      pathname: '/laboratorio/detallesResultado',
      params: { resultId: testId, resultName: testName }
    });
  }

  const handleExportHistory = async () => {
    try {
      // Format history data for sharing
      const historyText = groupedHistory
        .map(group => {
          return `📅 ${group.date}\n${group.tests
            .map(test => `- ${test.name}: ${test.status}`)
            .join('\n')}`;
        })
        .join('\n\n');

      const result = await Share.share({
        message: `Mi Historial de Pruebas MediGo\n\n${historyText}`,
        title: 'Historial de Pruebas MediGo'
      });
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared via ${result.activityType}`);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el historial');
    }
  };

  const shareHistory = async () => {
    try {
      await Share.share({
        message: 'Mi historial de pruebas médicas...',
      });
      // Mostrar modal de éxito
      setModalMessage('Historial compartido exitosamente');
      setShowSuccessModal(true);
      animateModal();
    } catch (error) {
      // Mostrar modal de error
      setModalMessage('No se pudo compartir el historial');
      setShowErrorModal(true);
      animateModal();
    }
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
    setShowErrorModal(false);
    modalAnimation.setValue(0);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
            </TouchableOpacity>
            
            <View style={styles.userInfoContainer}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <ThemedText style={styles.avatarText}>
                    {user?.nombre?.charAt(0) || 'U'}{user?.apellido?.charAt(0) || 'S'}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.greetingContainer}>
                <ThemedText style={styles.greeting}>
                  Historial de Pruebas
                </ThemedText>
                <View style={styles.editProfileIndicator}>
                  <Ionicons name="time" size={14} color={Colors.light.primary} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {groupedHistory.map(group => (
            <View key={group.date} style={styles.groupBlock}>
              <ThemedText style={styles.groupDate}>{group.date}</ThemedText>
              {group.tests.map(test => (
                <TouchableOpacity 
                  key={test.id} 
                  style={styles.testCard}
                  onPress={() => handleTestPress(test.id, test.name)}
                >
                  <Ionicons name="flask-outline" size={22} color="#00A0B0" style={{marginRight:10}} />
                  <ThemedText style={styles.testName}>{test.name}</ThemedText>
                  <ThemedText style={[styles.statusBadge, {backgroundColor: test.status==='Normal'?'#28a745':'#dc3545'}]}>{test.status}</ThemedText>
                  <Ionicons name="chevron-forward" size={18} color="#6C757D" style={{marginLeft:10}} />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

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

        {/* Modal de Error */}
        <Modal
          visible={showErrorModal}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={[
                styles.errorModalContainer,
                { 
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
                  transform: [{ scale: modalAnimation }],
                  opacity: modalAnimation,
                }
              ]}
            >
              <View style={styles.errorIconContainer}>
                <Ionicons name="alert-circle" size={64} color={Colors.light.error} />
              </View>
              
              <ThemedText style={[styles.errorTitle, { color: isDarkMode ? Colors.dark.text : Colors.light.textPrimary }]}>
                Error
              </ThemedText>
              
              <ThemedText style={[styles.errorMessage, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                {modalMessage}
              </ThemedText>
              
              <TouchableOpacity 
                style={[styles.errorButton, { backgroundColor: Colors.light.error }]}
                onPress={closeModal}
              >
                <ThemedText style={[styles.errorButtonText, { color: Colors.light.white }]}>
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
    flex: 1, 
    backgroundColor: Colors.light.background 
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: Colors.light.primary,
    fontSize: 17,
    fontWeight: 'bold',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  groupBlock: { marginBottom:18 },
  groupDate: { fontWeight:'bold', color:'#6C757D', marginBottom:6 },
  testCard: { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:10, padding:10, marginBottom:6, borderWidth:1, borderColor:'#E9ECEF' },
  testName: { flex:1, fontSize:15 },
  statusBadge: { paddingHorizontal:8, paddingVertical:2, borderRadius:10, color:'#fff', fontWeight:'bold', marginLeft:8, fontSize:12 },
  exportBtn: { flexDirection:'row', alignItems:'center', alignSelf:'flex-end', backgroundColor:'#E9ECEF', borderRadius:8, paddingHorizontal:12, paddingVertical:6 },
  exportLabel: { marginLeft:6, color:'#00A0B0', fontWeight:'600' },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  // Nuevos estilos para modales
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
  errorModalContainer: {
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
  errorIconContainer: {
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  errorButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 