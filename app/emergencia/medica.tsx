import { Colors } from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function EmergenciaMedicaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, currentLocation } = useUser();
  const [description, setDescription] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<'low' | 'medium' | 'high' | null>(null);
  const [forSelf, setForSelf] = useState(true);
  
  // Detectar si viene del flujo rápido
  useEffect(() => {
    if (params.fastTrack === 'true') {
      setForSelf(true);
    }
  }, [params.fastTrack]);
  
  const handleContinue = () => {
    if (forSelf) {
      // Para el usuario logueado, saltar directamente a confirmación
      // Ya tenemos toda la información del perfil y ubicación
      router.push('/emergencia/confirmacion');
    } else {
      // Para otra persona, seguir el flujo normal
      router.push('/emergencia/ubicacion');
    }
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FFC107';
      case 'high':
        return '#F44336';
      default:
        return '#ccc';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Emergencia Médica</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        {params.fastTrack === 'true' && (
          <View style={styles.fastTrackBanner}>
            <View style={styles.fastTrackBannerContent}>
              <Ionicons name="flash" size={20} color="white" />
              <ThemedText style={styles.fastTrackBannerText}>
                EMERGENCIA RÁPIDA ACTIVADA
              </ThemedText>
              <Ionicons name="flash" size={20} color="white" />
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>¿Para quién solicitas la atención?</ThemedText>
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                forSelf && styles.selectedOption
              ]}
              onPress={() => setForSelf(true)}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons 
                  name="person" 
                  size={24} 
                  color={forSelf ? 'white' : Colors.light.primary} 
                />
              </View>
              <ThemedText style={[
                styles.optionText,
                forSelf && styles.selectedOptionText
              ]}>Para mí</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                !forSelf && styles.selectedOption
              ]}
              onPress={() => setForSelf(false)}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons 
                  name="people" 
                  size={24} 
                  color={!forSelf ? 'white' : Colors.light.primary} 
                />
              </View>
              <ThemedText style={[
                styles.optionText,
                !forSelf && styles.selectedOptionText
              ]}>Para otra persona</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {forSelf && (
          <View style={styles.fastTrackInfo}>
            <View style={styles.fastTrackHeader}>
              <Ionicons name="flash" size={20} color={Colors.light.primary} />
              <ThemedText style={styles.fastTrackTitle}>Proceso Rápido Activado</ThemedText>
            </View>
            <ThemedText style={styles.fastTrackDescription}>
              Usaremos tu información de perfil y ubicación actual para agilizar el proceso
            </ThemedText>
            
            <View style={styles.userInfoPreview}>
              <View style={styles.infoRow}>
                <Ionicons name="person" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.infoText}>{user.nombre} {user.apellido}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.infoText}>{user.telefono}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="water" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.infoText}>Tipo de sangre: {user.tipoSangre}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.infoText}>{currentLocation.direccion}</ThemedText>
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Describe la emergencia</ThemedText>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe brevemente qué está sucediendo"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={3}
            placeholderTextColor="#999"
          />
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Nivel de urgencia</ThemedText>
          <View style={styles.severityContainer}>
            <TouchableOpacity 
              style={[
                styles.severityOption,
                selectedSeverity === 'low' && { borderColor: getSeverityColor('low'), backgroundColor: getSeverityColor('low') + '10' }
              ]}
              onPress={() => setSelectedSeverity('low')}
            >
              <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor('low') }]} />
              <View style={styles.severityContent}>
                <ThemedText style={styles.severityText}>Baja</ThemedText>
                <ThemedText style={styles.severityDescription}>No es urgente pero requiere atención</ThemedText>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.severityOption,
                selectedSeverity === 'medium' && { borderColor: getSeverityColor('medium'), backgroundColor: getSeverityColor('medium') + '10' }
              ]}
              onPress={() => setSelectedSeverity('medium')}
            >
              <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor('medium') }]} />
              <View style={styles.severityContent}>
                <ThemedText style={styles.severityText}>Media</ThemedText>
                <ThemedText style={styles.severityDescription}>Requiere atención pronto</ThemedText>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.severityOption,
                selectedSeverity === 'high' && { borderColor: getSeverityColor('high'), backgroundColor: getSeverityColor('high') + '10' }
              ]}
              onPress={() => setSelectedSeverity('high')}
            >
              <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor('high') }]} />
              <View style={styles.severityContent}>
                <ThemedText style={styles.severityText}>Alta</ThemedText>
                <ThemedText style={styles.severityDescription}>Requiere atención inmediata</ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.continueButton,
            (!description || !selectedSeverity) && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!description || !selectedSeverity}
        >
          <ThemedText style={styles.continueButtonText}>
            {forSelf ? 'Ir a Confirmación y Pago' : 'Continuar'}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.white,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.primary,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.primary + '30',
    backgroundColor: Colors.light.white,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 120,
  },
  selectedOption: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.light.primary,
  },
  selectedOptionText: {
    color: 'white',
  },
  fastTrackInfo: {
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
  },
  fastTrackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fastTrackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: Colors.light.primary,
  },
  fastTrackDescription: {
    fontSize: 14,
    color: Colors.light.primary,
    marginBottom: 12,
  },
  userInfoPreview: {
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#333',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: Colors.light.primary + '30',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: Colors.light.white,
    textAlignVertical: 'top',
    minHeight: 80,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  severityContainer: {
    gap: 12,
  },
  severityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.primary + '20',
    backgroundColor: Colors.light.white,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  severityIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  severityContent: {
    flex: 1,
  },
  severityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    color: Colors.light.primary,
  },
  severityDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  continueButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: Colors.light.textSecondary,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fastTrackBanner: {
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fastTrackBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fastTrackBannerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
}); 