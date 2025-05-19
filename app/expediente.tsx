import * as React from 'react';
import { useState } from '../hooks/react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { AppContainer } from '../components/AppContainer';
import { CardContainer } from '../components/CardContainer';
import { AppButton } from '../components/AppButton';

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
  const [activeTab, setActiveTab] = useState<'history' | 'results'>('history');

  const renderRecordItem = ({ item }: { item: MedicalRecord }) => (
    <CardContainer
      title={item.doctorName}
      subtitle={item.specialty}
      onPress={() => router.push({
        pathname: `/expediente/consulta/${item.id}` as any,
      })}
      gradient
      highlighted={item.type === 'hospitalization'}
      icon={
        <Ionicons 
          name={item.type === 'hospitalization' ? "medical" : "person"} 
          size={22} 
          color={COLORS.primary}
        />
      }
      rightElement={
        <ThemedText style={styles.recordDate}>{item.date}</ThemedText>
      }
    >
      <ThemedText style={styles.diagnosis}>{item.diagnosis}</ThemedText>
      <View style={styles.recordTypeContainer}>
        <View style={[
          styles.recordTypeBadge, 
          item.type === 'hospitalization' ? styles.hospitalizationBadge : styles.consultationBadge
        ]}>
          <ThemedText style={[
            styles.recordTypeText, 
            item.type === 'hospitalization' ? styles.hospitalizationText : styles.consultationText
          ]}>
            {item.type === 'hospitalization' ? 'Hospitalización' : 'Consulta'}
          </ThemedText>
        </View>
      </View>
    </CardContainer>
  );

  const renderResultItem = ({ item }: { item: LabResult }) => (
    <CardContainer
      title={item.name}
      subtitle={item.laboratory}
      onPress={() => router.push({
        pathname: `/expediente/resultado/${item.id}` as any,
      })}
      gradient
      highlighted={item.isNew}
      icon={
        <Ionicons 
          name="flask-outline" 
          size={22} 
          color={COLORS.primary}
        />
      }
      rightElement={
        <View style={styles.resultMetaContainer}>
          {item.isNew && (
            <View style={styles.newBadge}>
              <ThemedText style={styles.newBadgeText}>NUEVO</ThemedText>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </View>
      }
    >
      <ThemedText style={styles.resultDate}>{item.date}</ThemedText>
    </CardContainer>
  );

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <AppContainer 
      title="Mi Expediente"
      showBackButton={true}
      showLogoutButton={true}
    >
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Historial
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'results' && styles.activeTab]}
          onPress={() => setActiveTab('results')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'results' && styles.activeTabText]}>
            Resultados
          </ThemedText>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'history' ? (
        <FlatList
          data={medicalRecords}
          renderItem={renderRecordItem}
          keyExtractor={(item: MedicalRecord) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={labResults}
          renderItem={renderResultItem}
          keyExtractor={(item: LabResult) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 160, 176, 0.05)',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  recordDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  diagnosis: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  recordTypeContainer: {
    alignItems: 'flex-start',
  },
  recordTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  consultationBadge: {
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
  },
  hospitalizationBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  consultationText: {
    color: COLORS.primary,
  },
  hospitalizationText: {
    color: COLORS.danger,
  },
  recordTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  newBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  newBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
});