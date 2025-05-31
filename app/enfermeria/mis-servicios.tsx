import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type ServiceStatus = 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

type NursingService = {
  id: string;
  nurseName: string;
  nursePhoto: string;
  serviceName: string;
  date: string;
  time: string;
  status: ServiceStatus;
  totalCost: number;
  address: string;
  rating?: number;
  notes?: string;
};

const scheduledServices: NursingService[] = [
  {
    id: '1',
    nurseName: 'Ana María González',
    nursePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    serviceName: 'Curación de heridas',
    date: '2024-01-25',
    time: '10:00',
    status: 'confirmed',
    totalCost: 750,
    address: 'Av. Principal 123, Col. Centro',
  },
  {
    id: '2',
    nurseName: 'Carlos Rodríguez',
    nursePhoto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    serviceName: 'Aplicación de inyecciones',
    date: '2024-01-22',
    time: '14:00',
    status: 'in-progress',
    totalCost: 600,
    address: 'Calle Secundaria 456, Col. Norte',
  },
];

const serviceHistory: NursingService[] = [
  {
    id: '3',
    nurseName: 'María Fernanda López',
    nursePhoto: 'https://images.unsplash.com/photo-1594824047323-65b2b4e20c9e?w=150&h=150&fit=crop&crop=face',
    serviceName: 'Toma de signos vitales',
    date: '2024-01-15',
    time: '09:00',
    status: 'completed',
    totalCost: 550,
    address: 'Av. Reforma 789, Col. Sur',
    rating: 5,
    notes: 'Excelente servicio, muy profesional',
  },
  {
    id: '4',
    nurseName: 'Roberto Hernández',
    nursePhoto: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    serviceName: 'Cuidado de adulto mayor',
    date: '2024-01-10',
    time: '16:00',
    status: 'completed',
    totalCost: 1200,
    address: 'Calle Tercera 321, Col. Este',
    rating: 4,
    notes: 'Buen servicio, llegó puntual',
  },
  {
    id: '5',
    nurseName: 'Ana María González',
    nursePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    serviceName: 'Canalización intravenosa',
    date: '2024-01-05',
    time: '11:00',
    status: 'cancelled',
    totalCost: 850,
    address: 'Av. Principal 123, Col. Centro',
    notes: 'Cancelado por el paciente',
  },
];

export default function MisServiciosScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'scheduled' | 'history'>('scheduled');
  const [refreshing, setRefreshing] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<NursingService | null>(null);

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'confirmed': return Colors.light.primary;
      case 'in-progress': return '#FF9500';
      case 'completed': return Colors.light.success;
      case 'cancelled': return Colors.light.error;
    }
  };

  const getStatusLabel = (status: ServiceStatus) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'in-progress': return 'En progreso';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleServicePress = (service: NursingService) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular carga de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderServiceItem = ({ item }: { item: NursingService }) => (
    <TouchableOpacity 
      style={[styles.serviceCard, {
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}
      onPress={() => handleServicePress(item)}
    >
      <Image source={{ uri: item.nursePhoto }} style={styles.nursePhoto} />
      <View style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <ThemedText style={styles.serviceName}>{item.serviceName}</ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <ThemedText style={styles.statusText}>{getStatusLabel(item.status)}</ThemedText>
          </View>
        </View>
        
        <ThemedText style={styles.nurseName}>{item.nurseName}</ThemedText>
        
        <View style={styles.serviceDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} />
            <ThemedText style={[styles.detailText, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              {formatDate(item.date)} a las {item.time}
            </ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} />
            <ThemedText style={[styles.detailText, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]} numberOfLines={1}>
              {item.address}
            </ThemedText>
          </View>
        </View>

        {item.rating && (
          <View style={styles.ratingContainer}>
            <View style={styles.rating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={16}
                  color={star <= item.rating! ? '#FFD700' : (isDarkMode ? Colors.dark.border : Colors.light.border)}
                />
              ))}
            </View>
            {item.notes && (
              <ThemedText style={[styles.reviewText, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]} numberOfLines={2}>
                "{item.notes}"
              </ThemedText>
            )}
          </View>
        )}

        <View style={styles.costContainer}>
          <ThemedText style={[styles.costLabel, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>Total:</ThemedText>
          <ThemedText style={[styles.costValue, { color: Colors.light.primary }]}>
            ${item.totalCost}
          </ThemedText>
        </View>
      </View>
      
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name={activeTab === 'scheduled' ? 'calendar-outline' : 'time-outline'} 
        size={64} 
        color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
      />
      <ThemedText style={[styles.emptyTitle, {
        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
      }]}>
        {activeTab === 'scheduled' ? 'No tienes servicios programados' : 'No tienes historial de servicios'}
      </ThemedText>
      <ThemedText style={[styles.emptySubtitle, {
        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
      }]}>
        {activeTab === 'scheduled' 
          ? 'Agenda tu primer servicio de enfermería' 
          : 'Tus servicios completados aparecerán aquí'
        }
      </ThemedText>
      {activeTab === 'scheduled' && (
        <TouchableOpacity 
          style={[styles.ctaButton, { backgroundColor: Colors.light.primary }]}
          onPress={() => router.push('/enfermeria' as any)}
        >
          <ThemedText style={styles.ctaButtonText}>Agendar Servicio</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );

  const currentData = activeTab === 'scheduled' ? scheduledServices : serviceHistory;

  const renderServiceModal = () => {
    if (!selectedService) return null;

    const getStatusIcon = (status: ServiceStatus) => {
      switch (status) {
        case 'confirmed': return 'checkmark-circle';
        case 'in-progress': return 'time';
        case 'completed': return 'checkmark-done-circle';
        case 'cancelled': return 'close-circle';
      }
    };

    return (
      <Modal
        visible={showServiceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowServiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.serviceModalContent, {
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
          }]}>
            
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowServiceModal(false)}
            >
              <Ionicons name="close" size={24} color={isDarkMode ? Colors.dark.text : Colors.light.text} />
            </TouchableOpacity>

            {/* Status Header */}
            <View style={[styles.statusHeader, { backgroundColor: getStatusColor(selectedService.status) }]}>
              <Ionicons 
                name={getStatusIcon(selectedService.status)} 
                size={40} 
                color="white" 
              />
              <ThemedText style={styles.statusTitle}>{getStatusLabel(selectedService.status)}</ThemedText>
            </View>

            {/* Service Title */}
            <View style={styles.serviceTitleSection}>
              <ThemedText style={styles.modalServiceTitle}>{selectedService.serviceName}</ThemedText>
              <ThemedText style={[styles.modalServiceSubtitle, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>Servicio de enfermería a domicilio</ThemedText>
            </View>

            {/* Nurse Card */}
            <View style={[styles.nurseCard, {
              backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.background,
            }]}>
              <Image source={{ uri: selectedService.nursePhoto }} style={styles.nurseAvatar} />
              <View style={styles.nurseInfo}>
                <ThemedText style={styles.nurseNameText}>{selectedService.nurseName}</ThemedText>
                <ThemedText style={[styles.nurseRoleText, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>Enfermera Profesional</ThemedText>
              </View>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <View style={[styles.detailIconCircle, { backgroundColor: `${Colors.light.primary}20` }]}>
                  <Ionicons name="calendar" size={20} color={Colors.light.primary} />
                </View>
                <ThemedText style={styles.detailCardLabel}>Fecha</ThemedText>
                <ThemedText style={styles.detailCardValue}>
                  {new Date(selectedService.date).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </ThemedText>
              </View>

              <View style={styles.detailCard}>
                <View style={[styles.detailIconCircle, { backgroundColor: `${Colors.light.primary}20` }]}>
                  <Ionicons name="time" size={20} color={Colors.light.primary} />
                </View>
                <ThemedText style={styles.detailCardLabel}>Hora</ThemedText>
                <ThemedText style={styles.detailCardValue}>{selectedService.time}</ThemedText>
              </View>

              <View style={styles.detailCard}>
                <View style={[styles.detailIconCircle, { backgroundColor: `${Colors.light.success}20` }]}>
                  <Ionicons name="card" size={20} color={Colors.light.success} />
                </View>
                <ThemedText style={styles.detailCardLabel}>Costo</ThemedText>
                <ThemedText style={[styles.detailCardValue, { color: Colors.light.success, fontWeight: 'bold' }]}>
                  ${selectedService.totalCost}
                </ThemedText>
              </View>

              {selectedService.rating && (
                <View style={styles.detailCard}>
                  <View style={[styles.detailIconCircle, { backgroundColor: '#FFD70020' }]}>
                    <Ionicons name="star" size={20} color="#FFD700" />
                  </View>
                  <ThemedText style={styles.detailCardLabel}>Rating</ThemedText>
                  <View style={styles.ratingStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name="star"
                        size={14}
                        color={star <= selectedService.rating! ? '#FFD700' : '#E0E0E0'}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Address Section */}
            <View style={[styles.addressSection, {
              backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.background,
            }]}>
              <Ionicons name="location" size={20} color={Colors.light.primary} />
              <View style={styles.addressText}>
                <ThemedText style={styles.addressLabel}>Dirección</ThemedText>
                <ThemedText style={[styles.addressValue, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>{selectedService.address}</ThemedText>
              </View>
            </View>

            {/* Notes Section */}
            {selectedService.notes && (
              <View style={[styles.notesCard, {
                backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.background,
              }]}>
                <View style={styles.notesHeader}>
                  <Ionicons name="document-text" size={20} color={Colors.light.primary} />
                  <ThemedText style={styles.notesTitle}>
                    {selectedService.status === 'cancelled' ? 'Motivo de Cancelación' : 'Notas del Servicio'}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.notesContent, {
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
                }]}>
                  {selectedService.notes.replace(/"/g, '')}
                </ThemedText>
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity 
              style={[styles.modalActionButton, { backgroundColor: getStatusColor(selectedService.status) }]}
              onPress={() => setShowServiceModal(false)}
            >
              <ThemedText style={styles.modalActionText}>Cerrar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      
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
                Mis Servicios
              </ThemedText>
              <View style={styles.editProfileIndicator}>
                <Ionicons name="medical" size={14} color={Colors.light.primary} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabContainer, {
        backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.border,
      }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'scheduled' 
                ? Colors.light.primary 
                : 'transparent',
            }
          ]}
          onPress={() => setActiveTab('scheduled')}
        >
          <ThemedText style={[
            styles.tabText,
            {
              color: activeTab === 'scheduled' 
                ? 'white' 
                : (isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary)
            }
          ]}>
            Programados
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'history' 
                ? Colors.light.primary 
                : 'transparent',
            }
          ]}
          onPress={() => setActiveTab('history')}
        >
          <ThemedText style={[
            styles.tabText,
            {
              color: activeTab === 'history' 
                ? 'white' 
                : (isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary)
            }
          ]}>
            Historial
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Services List */}
      {currentData.length > 0 ? (
        <FlatList
          data={currentData}
          renderItem={renderServiceItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.servicesList}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      ) : (
        renderEmptyState()
      )}

      {renderServiceModal()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 50,
    paddingBottom: 20,
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
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: Colors.light.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  servicesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    backgroundColor: Colors.light.white,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nursePhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    color: Colors.light.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  nurseName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.primary,
  },
  serviceDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  costContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 14,
  },
  costValue: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  serviceModalContent: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    padding: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  serviceTitleSection: {
    marginBottom: 20,
  },
  modalServiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  modalServiceSubtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  nurseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  nurseAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  nurseInfo: {
    flexDirection: 'column',
  },
  nurseNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  nurseRoleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailCard: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  detailIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailCardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailCardValue: {
    fontSize: 16,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addressText: {
    flexDirection: 'column',
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  addressValue: {
    fontSize: 16,
  },
  notesCard: {
    padding: 16,
    borderRadius: 12,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  notesContent: {
    fontSize: 14,
  },
  modalActionButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modalActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 