import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppContainer } from '../components/AppContainer';
import { ThemedText } from '../components/ThemedText';
import { useState } from '../hooks/react';

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
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const { isDarkMode } = useTheme();
  const { user } = useUser();

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

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <AppContainer 
      title="Mi Expediente Médico"
      showBackButton={true}
      showLogoutButton={true}
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
            <ThemedText style={[styles.tabText, activeTab === 'results' && styles.activeTabText, { color: activeTab === 'results' ? Colors.light.primary : Colors.light.textSecondary }]}>Resultados y Estudios</ThemedText>
          </TouchableOpacity>
        </View>
        {/* Mostrar tarjetas solo si hay tab activo */}
        {activeTab === 'history' && (
          <View style={styles.cardsGrid}>
            {mockHistory.map(item => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="medkit" size={22} color={COLORS.primary} style={{marginRight: 8}} />
                  <ThemedText style={styles.cardTitle}>{item.titulo}</ThemedText>
                </View>
                <ThemedText style={styles.cardDate}>{item.fecha}</ThemedText>
                <ThemedText style={styles.cardDetail}>{item.detalle}</ThemedText>
                <ThemedText style={styles.cardFooter}>Atendió: {item.doctor}</ThemedText>
              </View>
            ))}
          </View>
        )}
        {activeTab === 'results' && (
          <View style={styles.cardsGrid}>
            {mockResults.map(item => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="flask" size={22} color={COLORS.primary} style={{marginRight: 8}} />
                  <ThemedText style={styles.cardTitle}>{item.titulo}</ThemedText>
                </View>
                <ThemedText style={styles.cardDate}>{item.fecha}</ThemedText>
                <ThemedText style={styles.cardDetail}>{item.detalle}</ThemedText>
                <ThemedText style={styles.cardFooter}>Centro: {item.laboratorio}</ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Gestión de documentos */}
      <View style={styles.sectionBox}>
        <ThemedText style={styles.sectionTitle}>Gestión de documentos</ThemedText>
        <View style={styles.medicalOptionsContainer}>
          <TouchableOpacity 
            style={[styles.optionCard, { backgroundColor: isDarkMode ? Colors.dark.background : COLORS.white }]}
            onPress={() => router.push('/expediente/archivos' as any)}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="cloud-upload" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.optionInfo}>
              <ThemedText style={styles.optionName}>Gestionar Archivos Médicos</ThemedText>
              <ThemedText style={[styles.optionDescription, { color: isDarkMode ? Colors.dark.textSecondary : COLORS.textSecondary }]}>Subir, ver y compartir documentos médicos</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDarkMode ? Colors.dark.textSecondary : COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.optionCard, { backgroundColor: isDarkMode ? Colors.dark.background : COLORS.white }]}
            onPress={() => router.push('/expediente/recetas' as any)}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="medkit" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.optionInfo}>
              <ThemedText style={styles.optionName}>Recetas Digitales</ThemedText>
              <ThemedText style={[styles.optionDescription, { color: isDarkMode ? Colors.dark.textSecondary : COLORS.textSecondary }]}>Ver y descargar recetas médicas</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDarkMode ? Colors.dark.textSecondary : COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <AppButton
          title="Volver al Login"
          onPress={handleGoToLogin}
          variant="primary"
          icon={{ name: "log-in-outline" }}
          gradient
          elevated
        />
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  sectionBox: {
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  cardsGrid: {
    flexDirection: 'column',
    gap: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardDate: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardFooter: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
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
  listContainer: {
    paddingBottom: 20,
  },
  recordDate: {
    fontSize: 14,
  },
  diagnosis: {
    fontSize: 14,
    marginBottom: 8,
  },
  recordTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  recordTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recordTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  consultationBadge: {
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
  },
  consultationText: {
    color: Colors.light.primary,
  },
  hospitalizationBadge: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
  },
  hospitalizationText: {
    color: COLORS.danger,
  },
  resultMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  resultDate: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
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
  medicalOptionsContainer: {
    marginBottom: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
});