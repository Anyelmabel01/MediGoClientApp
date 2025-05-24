import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type EmergencyFilter = 'all' | 'completed';
type EmergencyRecord = {
  id: string;
  type: 'medical' | 'accident' | 'transfer';
  typeLabel: string;
  date: string;
  time: string;
  status: 'completed' | 'cancelled';
  providerName: string;
  paramedicName: string;
  cost: number;
  rating?: number;
  location: string;
  description: string;
  duration: string;
};

const mockEmergencies: EmergencyRecord[] = [
  {
    id: 'EMG-001234',
    type: 'medical',
    typeLabel: 'Emergencia Médica',
    date: '2024-01-15',
    time: '14:25',
    status: 'completed',
    providerName: 'MediGo Emergency Services',
    paramedicName: 'Dr. María González',
    cost: 30.00,
    rating: 5,
    location: 'Calle 50 #15-20, San Francisco',
    description: 'Dolor en el pecho intenso',
    duration: '45 min',
  },
  {
    id: 'EMG-001233',
    type: 'accident',
    typeLabel: 'Accidente',
    date: '2024-01-10',
    time: '16:30',
    status: 'completed',
    providerName: 'MediGo Emergency Services',
    paramedicName: 'Dr. Carlos Ruiz',
    cost: 45.00,
    rating: 4,
    location: 'Vía España, Centro Comercial',
    description: 'Caída en escaleras',
    duration: '1 hr 20 min',
  },
  {
    id: 'EMG-001232',
    type: 'transfer',
    typeLabel: 'Traslado',
    date: '2024-01-05',
    time: '09:15',
    status: 'completed',
    providerName: 'MediGo Emergency Services',
    paramedicName: 'Dra. Ana López',
    cost: 25.00,
    rating: 5,
    location: 'Hospital Nacional',
    description: 'Traslado programado para examen',
    duration: '30 min',
  },
];

export default function EmergenciaHistorialScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<EmergencyFilter>('all');
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyRecord | null>(null);
  
  const filteredEmergencies = mockEmergencies.filter(emergency => {
    if (selectedFilter === 'all') return true;
    return emergency.status === selectedFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medical': return 'medkit';
      case 'accident': return 'car';
      case 'transfer': return 'bus';
      default: return 'medical';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#FF9800';
    }
  };

  const handleRequestSimilar = (emergency: EmergencyRecord) => {
    // Navegar a la pantalla correspondiente con datos pre-llenados
    switch (emergency.type) {
      case 'medical':
        router.push('/emergencia/medica' as any);
        break;
      case 'accident':
        router.push('/emergencia/accidente' as any);
        break;
      case 'transfer':
        router.push('/emergencia/traslado' as any);
        break;
      default:
        router.push('/emergencia/medica' as any);
    }
  };

  const renderEmergencyCard = ({ item }: { item: EmergencyRecord }) => (
    <TouchableOpacity 
      style={[styles.emergencyCard, { 
        backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
      }]}
      onPress={() => setSelectedEmergency(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.emergencyTypeContainer}>
          <View style={[styles.typeIcon, { backgroundColor: '#F44336' + '20' }]}>
            <Ionicons name={getTypeIcon(item.type) as any} size={24} color="#F44336" />
          </View>
          <View style={styles.emergencyInfo}>
            <ThemedText style={styles.emergencyType}>{item.typeLabel}</ThemedText>
            <ThemedText style={[styles.emergencyDate, { 
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
            }]}>
              {new Date(item.date).toLocaleDateString()} - {item.time}
            </ThemedText>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status === 'completed' ? 'Completado' : 'Cancelado'}
          </ThemedText>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardRow}>
          <Ionicons name="location" size={16} color={Colors.light.primary} />
          <ThemedText style={[styles.cardLabel, { 
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
          }]}>
            {item.location}
          </ThemedText>
        </View>

        <View style={styles.cardRow}>
          <Ionicons name="person" size={16} color={Colors.light.primary} />
          <ThemedText style={[styles.cardLabel, { 
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
          }]}>
            {item.paramedicName}
          </ThemedText>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.costContainer}>
            <ThemedText style={styles.costText}>${item.cost.toFixed(2)}</ThemedText>
          </View>
          
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <ThemedText style={styles.ratingText}>{item.rating.toFixed(1)}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color="#CCC" />
      <ThemedText style={[styles.emptyTitle, { 
        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
      }]}>
        No hay emergencias registradas
      </ThemedText>
      <ThemedText style={[styles.emptyDescription, { 
        color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
      }]}>
        Cuando solicites servicios de emergencia, aparecerán aquí
      </ThemedText>
    </View>
  );

  if (selectedEmergency) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedEmergency(null)}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Detalles del Servicio</ThemedText>
        </View>

        <ScrollView style={styles.content}>
          {/* Información Principal */}
          <View style={[styles.detailCard, { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border
          }]}>
            <View style={styles.detailHeader}>
              <View style={[styles.typeIcon, { backgroundColor: '#F44336' + '20' }]}>
                <Ionicons name={getTypeIcon(selectedEmergency.type) as any} size={32} color="#F44336" />
              </View>
              <View style={styles.detailInfo}>
                <ThemedText style={styles.detailTitle}>{selectedEmergency.typeLabel}</ThemedText>
                <ThemedText style={[styles.detailId, { 
                  color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
                }]}>
                  ID: {selectedEmergency.id}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Descripción:</ThemedText>
              <ThemedText style={styles.detailValue}>{selectedEmergency.description}</ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Fecha y hora:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {new Date(selectedEmergency.date).toLocaleDateString()} - {selectedEmergency.time}
              </ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Duración:</ThemedText>
              <ThemedText style={styles.detailValue}>{selectedEmergency.duration}</ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Ubicación:</ThemedText>
              <ThemedText style={styles.detailValue}>{selectedEmergency.location}</ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Proveedor:</ThemedText>
              <ThemedText style={styles.detailValue}>{selectedEmergency.providerName}</ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Paramédico:</ThemedText>
              <ThemedText style={styles.detailValue}>{selectedEmergency.paramedicName}</ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Costo total:</ThemedText>
              <ThemedText style={[styles.detailValue, styles.costValue]}>
                ${selectedEmergency.cost.toFixed(2)}
              </ThemedText>
            </View>

            {selectedEmergency.rating && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Calificación:</ThemedText>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={20} color="#FFD700" />
                  <ThemedText style={styles.ratingText}>{selectedEmergency.rating.toFixed(1)}</ThemedText>
                </View>
              </View>
            )}
          </View>

          {/* Botón de Acción */}
          <TouchableOpacity 
            style={styles.similarRequestButton}
            onPress={() => handleRequestSimilar(selectedEmergency)}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <ThemedText style={styles.similarRequestText}>Solicitar Servicio Similar</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Historial de Emergencias</ThemedText>
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterTab, 
            selectedFilter === 'all' && styles.activeFilterTab
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <ThemedText style={[
            styles.filterText,
            selectedFilter === 'all' && styles.activeFilterText
          ]}>Todos</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.filterTab, 
            selectedFilter === 'completed' && styles.activeFilterTab
          ]}
          onPress={() => setSelectedFilter('completed')}
        >
          <ThemedText style={[
            styles.filterText,
            selectedFilter === 'completed' && styles.activeFilterText
          ]}>Completados</ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* Lista de Emergencias */}
      <FlatList
        data={filteredEmergencies}
        renderItem={renderEmergencyCard}
        keyExtractor={(item) => item.id}
        style={styles.emergencyList}
        contentContainerStyle={styles.emergencyListContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  activeFilterTab: {
    backgroundColor: Colors.light.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emergencyList: {
    flex: 1,
  },
  emergencyListContent: {
    paddingBottom: 20,
  },
  emergencyCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  emergencyDate: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    marginTop: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  detailCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailInfo: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailId: {
    fontSize: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
  },
  costValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  similarRequestButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
  },
  similarRequestText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
}); 