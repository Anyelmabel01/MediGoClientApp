import React from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type VirtualConsultation = {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

// Datos de ejemplo
const upcomingConsultations: VirtualConsultation[] = [
  {
    id: '1',
    date: '10 Nov 2023',
    time: '9:00 AM',
    doctorName: 'Dr. Pedro López',
    specialty: 'Dermatología',
    status: 'confirmed',
  },
];

export default function TelemedicineScreen() {
  const router = useRouter();

  const handleNewConsultation = () => {
    router.push('/consulta/telemedicina/nueva');
  };

  const handleConsultationDetails = (id: string) => {
    router.push(`/consulta/telemedicina/consulta/${id}`);
  };

  const getStatusColor = (status: VirtualConsultation['status']) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: VirtualConsultation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return '';
    }
  };

  const renderConsultationItem = ({ item }: { item: VirtualConsultation }) => (
    <TouchableOpacity 
      style={styles.consultationItem}
      onPress={() => handleConsultationDetails(item.id)}
    >
      <View style={styles.consultationDate}>
        <ThemedText style={styles.consultationDay}>{item.date}</ThemedText>
        <ThemedText style={styles.consultationTime}>{item.time}</ThemedText>
      </View>
      <View style={styles.consultationInfo}>
        <ThemedText style={styles.doctorName}>{item.doctorName}</ThemedText>
        <ThemedText style={styles.specialty}>{item.specialty}</ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <ThemedText style={styles.statusText}>{getStatusText(item.status)}</ThemedText>
        </View>
      </View>
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2D7FF9" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Telemedicina</ThemedText>
      </View>
      
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <ThemedText style={styles.bannerTitle}>Consulta médica virtual</ThemedText>
          <ThemedText style={styles.bannerText}>
            Conecta con especialistas desde la comodidad de tu hogar
          </ThemedText>
          <TouchableOpacity 
            style={styles.bannerButton}
            onPress={handleNewConsultation}
          >
            <ThemedText style={styles.bannerButtonText}>Nueva Consulta</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.bannerIcon}>
          <Ionicons name="videocam" size={50} color="#3949AB" />
        </View>
      </View>
      
      <View style={styles.upcomingSection}>
        <ThemedText style={styles.sectionTitle}>Próximas Consultas</ThemedText>
        
        {upcomingConsultations.length > 0 ? (
          <FlatList
            data={upcomingConsultations}
            renderItem={renderConsultationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.consultationsList}
          />
        ) : (
          <ThemedView style={styles.emptyState}>
            <Ionicons name="videocam-outline" size={50} color="#ccc" />
            <ThemedText style={styles.emptyText}>No tienes consultas programadas</ThemedText>
          </ThemedView>
        )}
      </View>
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
  banner: {
    backgroundColor: '#E8EAF6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#283593',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    color: '#3949AB',
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#3949AB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bannerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  upcomingSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  consultationsList: {
    paddingBottom: 20,
  },
  consultationItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
  },
  consultationDate: {
    marginRight: 16,
    alignItems: 'center',
    minWidth: 70,
  },
  consultationDay: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  consultationTime: {
    fontSize: 13,
    color: '#777',
  },
  consultationInfo: {
    flex: 1,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  specialty: {
    fontSize: 13,
    color: '#777',
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  arrowContainer: {
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    color: '#777',
    fontSize: 16,
  },
}); 