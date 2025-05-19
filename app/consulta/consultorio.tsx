import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type Appointment = {
  id: string;
  date: string;
  time: string;
  providerName: string;
  providerType: string;
  status: 'pending' | 'confirmed' | 'cancelled';
};

// Datos de ejemplo
const upcomingAppointments: Appointment[] = [
  {
    id: '1',
    date: '12 Nov 2023',
    time: '10:00 AM',
    providerName: 'Dr. Juan Pérez',
    providerType: 'Médico General',
    status: 'confirmed',
  },
  {
    id: '2',
    date: '15 Nov 2023',
    time: '3:30 PM',
    providerName: 'Dra. María Rodríguez',
    providerType: 'Cardióloga',
    status: 'pending',
  },
];

export default function ConsultorioScreen() {
  const router = useRouter();

  const handleNewAppointment = () => {
    router.push('/consulta/consultorio/nueva-cita');
  };

  const handleMyAppointments = () => {
    router.push('/consulta/consultorio/mis-citas');
  };

  const handleAppointmentDetails = (id: string) => {
    router.push(`/consulta/consultorio/cita/${id}`);
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return '';
    }
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => (
    <TouchableOpacity 
      style={styles.appointmentItem}
      onPress={() => handleAppointmentDetails(item.id)}
    >
      <View style={styles.appointmentDate}>
        <ThemedText style={styles.appointmentDay}>{item.date}</ThemedText>
        <ThemedText style={styles.appointmentTime}>{item.time}</ThemedText>
      </View>
      <View style={styles.appointmentInfo}>
        <ThemedText style={styles.doctorName}>{item.providerName}</ThemedText>
        <ThemedText style={styles.doctorSpecialty}>{item.providerType}</ThemedText>
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
        <ThemedText style={styles.title}>Consulta en Consultorio</ThemedText>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleNewAppointment}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <ThemedText style={styles.buttonText}>Nueva Cita</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleMyAppointments}
        >
          <Ionicons name="calendar" size={24} color="white" />
          <ThemedText style={styles.buttonText}>Mis Citas</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.upcomingSection}>
        <ThemedText style={styles.sectionTitle}>Próximas Citas</ThemedText>
        
        {upcomingAppointments.length > 0 ? (
          <FlatList
            data={upcomingAppointments}
            renderItem={renderAppointmentItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.appointmentsList}
          />
        ) : (
          <ThemedView style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={50} color="#ccc" />
            <ThemedText style={styles.emptyText}>No tienes citas programadas</ThemedText>
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#2D7FF9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 12,
    flex: 0.48,
  },
  secondaryButton: {
    backgroundColor: '#5C6BC0',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  upcomingSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  appointmentsList: {
    paddingBottom: 20,
  },
  appointmentItem: {
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
  appointmentDate: {
    marginRight: 16,
    alignItems: 'center',
    minWidth: 70,
  },
  appointmentDay: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 13,
    color: '#777',
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  doctorSpecialty: {
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