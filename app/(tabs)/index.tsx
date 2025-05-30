import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { BottomNavbar } from '@/components/BottomNavbar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { handleError } from '@/utils/errorHandler';
import { useAuth } from '../../hooks/useAuth';

type ServiceItem = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  description: string;
};

const services: ServiceItem[] = [
  {
    id: '1',
    name: 'Consulta',
    icon: 'medkit',
    route: '/consulta',
    description: 'Agenda citas médicas presenciales o por telemedicina'
  },
  {
    id: '2',
    name: 'Farmacia',
    icon: 'medical',
    route: '/farmacia',
    description: 'Busca y compra medicamentos con entrega a domicilio'
  },
  {
    id: '3',
    name: 'Emergencia',
    icon: 'alert-circle',
    route: '/emergencia',
    description: 'Solicita atención médica de urgencia en tu ubicación'
  },
  {
    id: '4',
    name: 'Enfermería',
    icon: 'pulse',
    route: '/enfermeria',
    description: 'Servicios de cuidados y procedimientos a domicilio'
  },
  {
    id: '5',
    name: 'Expediente',
    icon: 'document-text',
    route: '/expediente',
    description: 'Accede a tu historial médico y resultados de pruebas'
  },
  {
    id: '6',
    name: 'Laboratorio',
    icon: 'flask',
    route: '/laboratorio',
    description: 'Programa toma de muestras y revisa resultados'
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, session, isLoading } = useAuth();
  const [showUserProfile, setShowUserProfile] = useState(false);

  const renderServiceItem = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity 
      style={styles.serviceItem}
      onPress={() => {
        try {
          router.push(item.route as any);
        } catch (e) {
          handleError(e);
        }
      }}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={32} color={Colors.light.primary} />
      </View>
      <View style={styles.serviceContent}>
        <ThemedText style={styles.serviceName}>{item.name}</ThemedText>
        <ThemedText style={styles.serviceDescription}>{item.description}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  // Show loading if still fetching user data
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={styles.loadingText}>Cargando tu perfil...</ThemedText>
      </ThemedView>
    );
  }

  // Show welcome message even if user profile is not fully loaded
  const userName = user?.nombre || session?.user?.user_metadata?.nombre || 'Usuario';
  const userEmail = user?.email || session?.user?.email || '';

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfoContainer}
          onPress={() => setShowUserProfile(true)}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {userName.charAt(0).toUpperCase()}{userName.split(' ').length > 1 ? userName.split(' ')[1].charAt(0).toUpperCase() : userName.charAt(1).toUpperCase()}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.greetingContainer}>
            <ThemedText style={styles.greeting}>
              ¡Hola, {userName}!
            </ThemedText>
            <View style={styles.editProfileIndicator}>
              <Ionicons name="create-outline" size={14} color={Colors.light.primary} />
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.locationContainer}>
          <View style={styles.locationIcon}>
            <Ionicons name="location" size={18} color={Colors.light.primary} />
          </View>
          <ThemedText style={styles.locationText} numberOfLines={1}>
            Tu ubicación principal
          </ThemedText>
          <Ionicons name="chevron-down" size={16} color={Colors.light.textSecondary} />
        </View>
      </View>
      
      <View style={styles.servicesHeaderContainer}>
        <ThemedText style={styles.subtitle}>¿Qué servicio necesitas hoy?</ThemedText>
      </View>
      
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.servicesList}
        numColumns={2}
        columnWrapperStyle={styles.serviceRow}
      />
      
      <BottomNavbar />
      
      {showUserProfile && (
        <View style={styles.userProfileModal}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowUserProfile(false)}
            >
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>Perfil de Usuario</ThemedText>
            <ThemedText style={styles.modalText}>Nombre: {userName}</ThemedText>
            <ThemedText style={styles.modalText}>Email: {userEmail}</ThemedText>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingBottom: Platform.OS === 'ios' ? 80 : 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: Colors.light.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  editProfileIndicator: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 4,
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  locationIcon: {
    marginRight: 6,
  },
  locationText: {
    flex: 1,
    color: Colors.light.white,
    fontSize: 14,
    marginRight: 4,
  },
  servicesHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  servicesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  serviceRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  serviceItem: {
    width: '48%',
    backgroundColor: Colors.light.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceContent: {
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    color: Colors.light.primary,
  },
  serviceDescription: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  userProfileModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.light.white,
    padding: 20,
    margin: 20,
    borderRadius: 12,
    minWidth: 300,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
