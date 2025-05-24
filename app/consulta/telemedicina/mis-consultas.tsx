import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';

// Login color palette
const PRIMARY_COLOR = '#00A0B0';
const PRIMARY_LIGHT = '#33b5c2';
const PRIMARY_DARK = '#006070';
const ACCENT_COLOR = '#70D0E0';

type ConsultationStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

type VirtualConsultation = {
  id: string;
  date: string;
  time: string;
  specialist_name: string;
  specialty: string;
  avatar_url: string;
  status: ConsultationStatus;
  meeting_link?: string;
  can_join: boolean;
  prescription_count: number;
  notes?: string;
  consultation_fee: number;
};

const mockConsultations: VirtualConsultation[] = [
  {
    id: '1',
    date: '2024-12-28',
    time: '14:00',
    specialist_name: 'Dr. Carlos Mendoza',
    specialty: 'Cardiología',
    avatar_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    status: 'CONFIRMED',
    can_join: true,
    prescription_count: 0,
    consultation_fee: 750
  },
  {
    id: '2',
    date: '2024-12-25',
    time: '10:30',
    specialist_name: 'Dra. Ana López',
    specialty: 'Psicología',
    avatar_url: 'https://images.unsplash.com/photo-1594824047323-65b2b4e20c9e?w=150&h=150&fit=crop&crop=face',
    status: 'COMPLETED',
    can_join: false,
    prescription_count: 2,
    notes: 'Consulta completada exitosamente. Se prescribieron medicamentos.',
    consultation_fee: 550
  },
  {
    id: '3',
    date: '2024-12-22',
    time: '16:00',
    specialist_name: 'Dr. Roberto Silva',
    specialty: 'Dermatología',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    status: 'COMPLETED',
    can_join: false,
    prescription_count: 1,
    notes: 'Diagnóstico: Dermatitis. Seguimiento en 2 semanas.',
    consultation_fee: 700
  },
  {
    id: '4',
    date: '2024-12-30',
    time: '09:00',
    specialist_name: 'Dra. María Fernández',
    specialty: 'Medicina General',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    status: 'PENDING',
    can_join: false,
    prescription_count: 0,
    consultation_fee: 600
  }
];

export default function MisConsultasTelemedicina() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const upcomingConsultations = mockConsultations.filter(
    c => c.status === 'PENDING' || c.status === 'CONFIRMED' || c.status === 'IN_PROGRESS'
  );
  
  const pastConsultations = mockConsultations.filter(
    c => c.status === 'COMPLETED' || c.status === 'CANCELLED'
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleJoinConsultation = (consultation: VirtualConsultation) => {
    if (consultation.can_join) {
      router.push({
        pathname: '/consulta/telemedicina/sala-espera',
        params: { 
          specialistId: consultation.id,
          appointmentTime: `${consultation.date} ${consultation.time}`
        }
      });
    } else {
      Alert.alert(
        'No disponible',
        'La consulta aún no está disponible para unirse.'
      );
    }
  };

  const handleReschedule = (id: string) => {
    Alert.alert(
      'Reprogramar Consulta',
      '¿Estás seguro de que quieres reprogramar esta consulta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Reprogramar', 
          onPress: () => Alert.alert('Éxito', 'Consulta reprogramada exitosamente') 
        }
      ]
    );
  };

  const handleCancel = (id: string) => {
    Alert.alert(
      'Cancelar Consulta',
      '¿Estás seguro de que quieres cancelar esta consulta?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          style: 'destructive',
          onPress: () => Alert.alert('Consulta cancelada', 'La consulta ha sido cancelada exitosamente') 
        }
      ]
    );
  };

  const getStatusColor = (status: ConsultationStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return '#10b981';
      case 'PENDING':
        return '#f59e0b';
      case 'IN_PROGRESS':
        return PRIMARY_COLOR;
      case 'COMPLETED':
        return '#6b7280';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return Colors.light.textSecondary;
    }
  };

  const getStatusLabel = (status: ConsultationStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'PENDING':
        return 'Pendiente';
      case 'IN_PROGRESS':
        return 'En progreso';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const renderConsultation = ({ item }: { item: VirtualConsultation }) => (
    <View style={[styles.consultationCard, {
      backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
      borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
    }]}>
      <View style={styles.consultationHeader}>
        <Image source={{ uri: item.avatar_url }} style={styles.specialistAvatar} />
        <View style={styles.consultationInfo}>
          <ThemedText style={styles.specialistName}>{item.specialist_name}</ThemedText>
          <ThemedText style={[styles.specialty, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            {item.specialty}
          </ThemedText>
          <View style={styles.dateTimeContainer}>
            <Ionicons name="calendar-outline" size={14} color={PRIMARY_COLOR} />
            <ThemedText style={[styles.dateTime, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              {new Date(item.date).toLocaleDateString('es-ES')} - {item.time}
            </ThemedText>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <ThemedText style={styles.statusText}>{getStatusLabel(item.status)}</ThemedText>
          </View>
          <ThemedText style={[styles.fee, { color: PRIMARY_COLOR }]}>
            ${item.consultation_fee}
          </ThemedText>
        </View>
      </View>

      {item.notes && (
        <View style={styles.notesContainer}>
          <Ionicons name="document-text-outline" size={16} color={PRIMARY_COLOR} />
          <ThemedText style={[styles.notes, {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
          }]}>
            {item.notes}
          </ThemedText>
        </View>
      )}

      {item.prescription_count > 0 && (
        <View style={styles.prescriptionInfo}>
          <Ionicons name="medical-outline" size={16} color="#10b981" />
          <ThemedText style={[styles.prescriptionText, { color: '#10b981' }]}>
            {item.prescription_count} receta{item.prescription_count > 1 ? 's' : ''} generada{item.prescription_count > 1 ? 's' : ''}
          </ThemedText>
        </View>
      )}

      <View style={styles.consultationActions}>
        {activeTab === 'upcoming' ? (
          <>
            {item.can_join && (
              <TouchableOpacity 
                style={[styles.joinButton, { backgroundColor: PRIMARY_COLOR }]}
                onPress={() => handleJoinConsultation(item)}
              >
                <Ionicons name="videocam" size={16} color="white" />
                <ThemedText style={styles.joinButtonText}>Unirse</ThemedText>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.actionButton, { 
                borderColor: isDarkMode ? Colors.dark.border : Colors.light.border 
              }]}
              onPress={() => handleReschedule(item.id)}
            >
              <Ionicons name="calendar" size={16} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.actionButtonText, { color: PRIMARY_COLOR }]}>
                Reprogramar
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: '#ef4444' }]}
              onPress={() => handleCancel(item.id)}
            >
              <Ionicons name="close" size={16} color="#ef4444" />
              <ThemedText style={[styles.actionButtonText, { color: '#ef4444' }]}>
                Cancelar
              </ThemedText>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, { 
                borderColor: isDarkMode ? Colors.dark.border : Colors.light.border 
              }]}
              onPress={() => Alert.alert('Ver detalles', 'Función en desarrollo')}
            >
              <Ionicons name="eye" size={16} color={PRIMARY_COLOR} />
              <ThemedText style={[styles.actionButtonText, { color: PRIMARY_COLOR }]}>
                Ver detalles
              </ThemedText>
            </TouchableOpacity>
            {item.prescription_count > 0 && (
              <TouchableOpacity 
                style={[styles.actionButton, { 
                  borderColor: isDarkMode ? Colors.dark.border : Colors.light.border 
                }]}
                onPress={() => Alert.alert('Descargar recetas', 'Función en desarrollo')}
              >
                <Ionicons name="download" size={16} color={PRIMARY_COLOR} />
                <ThemedText style={[styles.actionButtonText, { color: PRIMARY_COLOR }]}>
                  Recetas
                </ThemedText>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.actionButton, { 
                borderColor: isDarkMode ? Colors.dark.border : Colors.light.border 
              }]}
              onPress={() => Alert.alert('Calificar', 'Función en desarrollo')}
            >
              <Ionicons name="star" size={16} color="#f59e0b" />
              <ThemedText style={[styles.actionButtonText, { color: '#f59e0b' }]}>
                Calificar
              </ThemedText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  const currentData = activeTab === 'upcoming' ? upcomingConsultations : pastConsultations;

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Mis Consultas Virtuales</ThemedText>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/consulta/telemedicina/buscar-especialistas')}
        >
          <Ionicons name="add" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'upcoming' ? PRIMARY_COLOR : 'transparent',
              borderColor: PRIMARY_COLOR
            }
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <ThemedText style={[
            styles.tabText,
            { color: activeTab === 'upcoming' ? 'white' : PRIMARY_COLOR }
          ]}>
            Próximas ({upcomingConsultations.length})
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'past' ? PRIMARY_COLOR : 'transparent',
              borderColor: PRIMARY_COLOR
            }
          ]}
          onPress={() => setActiveTab('past')}
        >
          <ThemedText style={[
            styles.tabText,
            { color: activeTab === 'past' ? 'white' : PRIMARY_COLOR }
          ]}>
            Pasadas ({pastConsultations.length})
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        data={currentData}
        renderItem={renderConsultation}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.consultationsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={PRIMARY_COLOR}
            colors={[PRIMARY_COLOR]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons 
              name={activeTab === 'upcoming' ? "calendar-outline" : "checkmark-circle-outline"} 
              size={64} 
              color={Colors.light.textSecondary} 
            />
            <ThemedText style={[styles.emptyTitle, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              {activeTab === 'upcoming' 
                ? 'No tienes consultas próximas' 
                : 'No tienes consultas pasadas'
              }
            </ThemedText>
            <ThemedText style={[styles.emptyText, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
            }]}>
              {activeTab === 'upcoming' 
                ? 'Agenda una nueva consulta virtual con un especialista'
                : 'Tus consultas completadas aparecerán aquí'
              }
            </ThemedText>
            {activeTab === 'upcoming' && (
              <TouchableOpacity 
                style={[styles.emptyActionButton, { backgroundColor: PRIMARY_COLOR }]}
                onPress={() => router.push('/consulta/telemedicina/buscar-especialistas')}
              >
                <Ionicons name="add" size={20} color="white" />
                <ThemedText style={styles.emptyActionText}>Nueva Consulta</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  consultationsList: {
    padding: 16,
    paddingTop: 0,
  },
  consultationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  consultationHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  specialistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  consultationInfo: {
    flex: 1,
  },
  specialistName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    marginBottom: 6,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateTime: {
    fontSize: 12,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  fee: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
    padding: 12,
    backgroundColor: PRIMARY_COLOR + '10',
    borderRadius: 8,
  },
  notes: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  prescriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  prescriptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  consultationActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  emptyActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
}); 