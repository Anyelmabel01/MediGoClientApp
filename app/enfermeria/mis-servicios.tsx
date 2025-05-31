import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
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
    // Navigate to service details or actions based on status
    if (service.status === 'confirmed') {
      // Show options to cancel or modify
    } else if (service.status === 'completed' && !service.rating) {
      // Navigate to rating screen
    }
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
                  {user.nombre.charAt(0)}{user.apellido.charAt(0)}
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
        />
      ) : (
        renderEmptyState()
      )}
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
    marginBottom: 8,
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
}); 