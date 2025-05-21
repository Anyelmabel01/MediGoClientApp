import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppContainer } from '@/components/AppContainer';
import { CardContainer } from '@/components/CardContainer';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

// Modelo para las recetas médicas
interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  specialty: string;
  status: 'active' | 'inactive';
  medications: Medication[];
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

// Datos de ejemplo
const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    date: '20/10/2023',
    doctorName: 'Dr. Juan Pérez',
    specialty: 'Medicina General',
    status: 'active',
    medications: [
      {
        id: '1-1',
        name: 'Amoxicilina',
        dosage: '500mg',
        frequency: 'Cada 8 horas',
        duration: '7 días',
      },
      {
        id: '1-2',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Cada 6 horas si hay dolor',
        duration: '5 días',
      }
    ]
  },
  {
    id: '2',
    date: '15/09/2023',
    doctorName: 'Dra. María González',
    specialty: 'Cardiología',
    status: 'active',
    medications: [
      {
        id: '2-1',
        name: 'Atorvastatina',
        dosage: '20mg',
        frequency: 'Una vez al día',
        duration: 'Permanente',
      }
    ]
  },
  {
    id: '3',
    date: '10/07/2023',
    doctorName: 'Dr. Roberto Sánchez',
    specialty: 'Dermatología',
    status: 'inactive',
    medications: [
      {
        id: '3-1',
        name: 'Clindamicina tópica',
        dosage: '1%',
        frequency: 'Dos veces al día',
        duration: '30 días',
      }
    ]
  }
];

export default function PrescriptionsScreen() {
  const { isDarkMode } = useTheme();
  const [prescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [expandedPrescription, setExpandedPrescription] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Función para compartir una receta
  const sharePrescription = async (prescription: Prescription) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'La opción de compartir no está disponible en este dispositivo.');
        return;
      }

      // En una aplicación real, aquí generaríamos un PDF para compartir
      Alert.alert('Compartir receta', 'Función para compartir receta en desarrollo.');
    } catch (error) {
      console.error('Error compartiendo la receta:', error);
      Alert.alert('Error', 'No se pudo compartir la receta.');
    }
  };

  // Función para descargar una receta
  const downloadPrescription = (prescription: Prescription) => {
    // En una aplicación real, aquí generaríamos un PDF para descargar
    Alert.alert('Descargar receta', 'Receta descargada correctamente.');
  };

  // Filtrar recetas según el estado seleccionado
  const filteredPrescriptions = currentFilter === 'all'
    ? prescriptions
    : prescriptions.filter(p => p.status === currentFilter);

  // Renderizar cada elemento de la lista
  const renderPrescriptionItem = ({ item }: { item: Prescription }) => (
    <CardContainer
      key={item.id}
      title={`Receta: ${item.date}`}
      subtitle={`${item.doctorName} - ${item.specialty}`}
      onPress={() => {
        if (expandedPrescription === item.id) {
          setExpandedPrescription(null);
        } else {
          setExpandedPrescription(item.id);
        }
      }}
      highlighted={item.status === 'active'}
      icon={
        <Ionicons 
          name="medkit" 
          size={22} 
          color={Colors.light.primary}
        />
      }
      rightElement={
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => sharePrescription(item)} style={styles.actionButton}>
            <Ionicons 
              name="share-outline" 
              size={20} 
              color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => downloadPrescription(item)} style={styles.actionButton}>
            <Ionicons 
              name="download-outline" 
              size={20} 
              color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      }
    >
      <View style={styles.statusBadge}>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: item.status === 'active' ? Colors.light.success : Colors.light.textSecondary }
        ]} />
        <ThemedText style={styles.statusText}>
          {item.status === 'active' ? 'Activa' : 'Inactiva'}
        </ThemedText>
      </View>

      {expandedPrescription === item.id && (
        <View style={styles.medicationsContainer}>
          <ThemedText style={styles.medicationsTitle}>Medicamentos:</ThemedText>
          
          {item.medications.map((med) => (
            <View key={med.id} style={styles.medicationItem}>
              <View style={styles.medicationHeader}>
                <Ionicons 
                  name="medical-outline" 
                  size={16} 
                  color={Colors.light.primary} 
                  style={styles.medicationIcon}
                />
                <ThemedText style={styles.medicationName}>{med.name}</ThemedText>
              </View>
              
              <View style={styles.medicationDetails}>
                <ThemedText style={styles.medicationDetail}>
                  <ThemedText style={styles.detailLabel}>Dosis: </ThemedText>
                  {med.dosage}
                </ThemedText>
                <ThemedText style={styles.medicationDetail}>
                  <ThemedText style={styles.detailLabel}>Frecuencia: </ThemedText>
                  {med.frequency}
                </ThemedText>
                <ThemedText style={styles.medicationDetail}>
                  <ThemedText style={styles.detailLabel}>Duración: </ThemedText>
                  {med.duration}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      )}
    </CardContainer>
  );

  return (
    <AppContainer
      title="Recetas Digitales"
      showBackButton={true}
      scrollable={false}
    >
      {/* Filtros por estado */}
      <View style={styles.filterContainer}>
        <View style={[
          styles.filtersRow,
          { backgroundColor: isDarkMode ? 'rgba(0, 160, 176, 0.1)' : 'rgba(0, 160, 176, 0.05)' }
        ]}>
          {[
            { id: 'all', label: 'Todas' },
            { id: 'active', label: 'Activas' },
            { id: 'inactive', label: 'Inactivas' }
          ].map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                currentFilter === filter.id && [
                  styles.activeFilterTab,
                  { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }
                ]
              ]}
              onPress={() => setCurrentFilter(filter.id as 'all' | 'active' | 'inactive')}
            >
              <ThemedText style={[
                styles.filterText,
                currentFilter === filter.id && { color: Colors.light.primary }
              ]}>
                {filter.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lista de recetas */}
      {filteredPrescriptions.length > 0 ? (
        <FlatList
          data={filteredPrescriptions}
          renderItem={renderPrescriptionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="medkit" 
            size={64} 
            color={isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} 
          />
          <ThemedText style={styles.emptyText}>
            No tienes recetas {currentFilter === 'active' ? 'activas' : currentFilter === 'inactive' ? 'inactivas' : ''}
          </ThemedText>
        </View>
      )}
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    marginBottom: 16,
  },
  filtersRow: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeFilterTab: {
    borderRadius: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  medicationsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  medicationsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  medicationItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 160, 176, 0.05)',
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  medicationIcon: {
    marginRight: 6,
  },
  medicationName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  medicationDetails: {
    marginLeft: 22,
  },
  medicationDetail: {
    fontSize: 13,
    marginBottom: 2,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
}); 