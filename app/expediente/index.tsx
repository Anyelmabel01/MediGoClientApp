import { BottomNavbar } from '@/components/BottomNavbar';
import { LocationSelector } from '@/components/LocationSelector';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserProfile } from '@/components/UserProfile';
import { Colors } from '@/constants/Colors';
import { UserLocation } from '@/constants/UserModel';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Paleta de colores consistente
const COLORS = {
  primary: '#00A0B0',
  primaryDark: '#006070',
  primaryLight: '#33b5c2',
  accent: '#70D0E0',
  background: '#FFFFFF',
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  white: '#FFFFFF',
  success: '#28a745',
  info: '#17a2b8',
  danger: '#dc3545',
  warning: '#ffc107',
  gray: '#f8f9fa',
  border: 'rgba(0, 160, 176, 0.1)',
};

type MedicalRecord = {
  id: string;
  date: string;
  doctorName: string;
  specialty: string;
  diagnosis: string;
  type: 'consultation' | 'hospitalization';
};

type LabResult = {
  id: string;
  date: string;
  name: string;
  laboratory: string;
  isNew: boolean;
};

const medicalRecords: MedicalRecord[] = [
  {
    id: '1',
    date: '15/10/2023',
    doctorName: 'Dr. Alejandro Méndez',
    specialty: 'Medicina General',
    diagnosis: 'Infección respiratoria aguda',
    type: 'consultation',
  },
  {
    id: '2',
    date: '03/07/2023',
    doctorName: 'Dra. Laura Jiménez',
    specialty: 'Cardiología',
    diagnosis: 'Evaluación rutinaria, sin hallazgos significativos',
    type: 'consultation',
  },
  {
    id: '3',
    date: '22/04/2023',
    doctorName: 'Dr. Manuel Ortega',
    specialty: 'Traumatología',
    diagnosis: 'Esguince de tobillo derecho',
    type: 'consultation',
  },
  {
    id: '4',
    date: '10/01/2023',
    doctorName: 'Hospital General',
    specialty: 'Cirugía General',
    diagnosis: 'Apendicectomía',
    type: 'hospitalization',
  },
];

const labResults: LabResult[] = [
  {
    id: '1',
    date: '20/10/2023',
    name: 'Hemograma completo',
    laboratory: 'Laboratorio Central',
    isNew: true,
  },
  {
    id: '2',
    date: '20/10/2023',
    name: 'Perfil lipídico',
    laboratory: 'Laboratorio Central',
    isNew: true,
  },
  {
    id: '3',
    date: '05/07/2023',
    name: 'Electrocardiograma',
    laboratory: 'Cardiocentro',
    isNew: false,
  },
  {
    id: '4',
    date: '22/04/2023',
    name: 'Radiografía de tobillo',
    laboratory: 'Imagen Diagnóstica',
    isNew: false,
  },
];

export default function ExpedienteScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user, currentLocation, setCurrentLocation } = useUser();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleLocationSelect = (location: UserLocation) => {
    setCurrentLocation(location);
  };

  if (!user) {
    return null; // or loading spinner
  }

  // Datos ficticios para historial y estudios
  const mockHistory = [
    {
      id: 'h1',
      fecha: '2024-04-10',
      titulo: 'Consulta General',
      detalle: 'Dolor de cabeza y fiebre. Diagnóstico: Gripe común.',
      doctor: 'Dra. Ana López',
    },
    {
      id: 'h2',
      fecha: '2024-03-15',
      titulo: 'Consulta Cardiología',
      detalle: 'Chequeo de presión arterial. Todo normal.',
      doctor: 'Dr. Juan Pérez',
    },
  ];
  const mockResults = [
    {
      id: 'r1',
      fecha: '2024-04-12',
      titulo: 'Laboratorio: Hemograma',
      detalle: 'Resultados dentro de parámetros normales.',
      laboratorio: 'Lab. Central',
    },
    {
      id: 'r2',
      fecha: '2024-03-20',
      titulo: 'Radiografía de tórax',
      detalle: 'Sin hallazgos patológicos.',
      laboratorio: 'Imagen Diagnóstica',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header igual al diseño principal */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfoContainer}
          onPress={() => setShowUserProfile(true)}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {user.nombre.charAt(0)}{user.apellido.charAt(0)}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.greetingContainer}>
            <ThemedText style={styles.greeting}>
              Mi Expediente
            </ThemedText>
            <View style={styles.editProfileIndicator}>
              <Ionicons name="document-text" size={14} color={Colors.light.primary} />
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.locationContainer}
          onPress={() => setShowLocationSelector(true)}
        >
          <View style={styles.locationIcon}>
            <Ionicons name="location" size={18} color={Colors.light.primary} />
          </View>
          <ThemedText style={styles.locationText} numberOfLines={1}>
            {currentLocation.direccion}
          </ThemedText>
          <Ionicons name="chevron-down" size={16} color={Colors.light.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.servicesHeaderContainer}>
        <ThemedText style={styles.subtitle}>Tu historial médico completo</ThemedText>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Información médica básica */}
        <View style={styles.sectionBox}>
          <ThemedText style={styles.sectionTitle}>Información médica básica</ThemedText>
          <View style={styles.infoCardsContainer}>
            <View style={[styles.infoCard, { backgroundColor: isDarkMode ? Colors.dark.background : COLORS.gray }]}>
              <Ionicons name="water" size={24} color={COLORS.primary} />
              <ThemedText style={[styles.infoCardTitle, { color: isDarkMode ? Colors.dark.textSecondary : COLORS.textSecondary }]}>Tipo de sangre</ThemedText>
              <ThemedText style={styles.infoCardValue}>{user.tipoSangre}</ThemedText>
            </View>
            <View style={[styles.infoCard, { backgroundColor: isDarkMode ? Colors.dark.background : COLORS.gray }]}>
              <Ionicons name="fitness" size={24} color={COLORS.primary} />
              <ThemedText style={[styles.infoCardTitle, { color: isDarkMode ? Colors.dark.textSecondary : COLORS.textSecondary }]}>Peso</ThemedText>
              <ThemedText style={styles.infoCardValue}>{user.peso} kg</ThemedText>
            </View>
            <View style={[styles.infoCard, { backgroundColor: isDarkMode ? Colors.dark.background : COLORS.gray }]}>
              <Ionicons name="resize" size={24} color={COLORS.primary} />
              <ThemedText style={[styles.infoCardTitle, { color: isDarkMode ? Colors.dark.textSecondary : COLORS.textSecondary }]}>Altura</ThemedText>
              <ThemedText style={styles.infoCardValue}>{user.altura} cm</ThemedText>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.editMedicalInfoButton, { backgroundColor: isDarkMode ? Colors.dark.background : COLORS.white }]}
            onPress={() => router.push('/expediente/editar-info-medica' as any)}
          >
            <ThemedText style={[styles.editMedicalInfoText, { color: COLORS.primary }]}>Actualizar información médica</ThemedText>
            <Ionicons name="pencil" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Historial y estudios */}
        <View style={styles.sectionBox}>
          <ThemedText style={styles.sectionTitle}>Historial y estudios</ThemedText>
          <View style={[styles.tabContainer, { backgroundColor: isDarkMode ? 'rgba(0, 160, 176, 0.1)' : 'rgba(0, 160, 176, 0.05)' }]}> 
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'history' && [styles.activeTab, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]]}
              onPress={() => setActiveTab(activeTab === 'history' ? null : 'history')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'history' && styles.activeTabText, { color: activeTab === 'history' ? Colors.light.primary : Colors.light.textSecondary }]}>Historial Médico</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'results' && [styles.activeTab, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]]}
              onPress={() => setActiveTab(activeTab === 'results' ? null : 'results')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'results' && styles.activeTabText, { color: activeTab === 'results' ? Colors.light.primary : Colors.light.textSecondary }]}>Resultados</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Contenido del historial médico */}
          {activeTab === 'history' && (
            <View style={styles.tabContent}>
              {mockHistory.map((item, index) => (
                <View key={item.id} style={[styles.listItem, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
                  <View style={styles.listItemHeader}>
                    <ThemedText style={styles.listItemTitle}>{item.titulo}</ThemedText>
                    <ThemedText style={[styles.listItemDate, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>{item.fecha}</ThemedText>
                  </View>
                  <ThemedText style={[styles.listItemSubtitle, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>{item.doctor}</ThemedText>
                  <ThemedText style={styles.listItemDescription}>{item.detalle}</ThemedText>
                </View>
              ))}
            </View>
          )}

          {/* Contenido de resultados */}
          {activeTab === 'results' && (
            <View style={styles.tabContent}>
              {mockResults.map((item, index) => (
                <View key={item.id} style={[styles.listItem, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
                  <View style={styles.listItemHeader}>
                    <ThemedText style={styles.listItemTitle}>{item.titulo}</ThemedText>
                    <ThemedText style={[styles.listItemDate, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>{item.fecha}</ThemedText>
                  </View>
                  <ThemedText style={[styles.listItemSubtitle, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>{item.laboratorio}</ThemedText>
                  <ThemedText style={styles.listItemDescription}>{item.detalle}</ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      <BottomNavbar />
      
      <UserProfile 
        isVisible={showUserProfile} 
        onClose={() => setShowUserProfile(false)}
      />
      
      <LocationSelector 
        isVisible={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onLocationSelect={handleLocationSelect}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingBottom: Platform.OS === 'ios' ? 80 : 60,
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionBox: {
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 160, 176, 0.1)',
  },
  infoCardTitle: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  editMedicalInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 160, 176, 0.2)',
    marginTop: 5,
  },
  editMedicalInfoText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 16,
  },
  listItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  listItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  listItemDate: {
    fontSize: 13,
    color: '#888',
    marginLeft: 8,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listItemDescription: {
    fontSize: 14,
    marginTop: 4,
  },
});