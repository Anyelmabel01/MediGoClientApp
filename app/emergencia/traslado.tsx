import { Colors } from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

type TransferType = 'hospital' | 'home' | 'appointment' | 'emergency';

const TRANSFER_TYPES = [
  { 
    id: 'hospital' as const, 
    label: 'Al hospital', 
    description: 'Traslado urgente a centro médico',
    icon: 'medical' as const
  },
  { 
    id: 'home' as const, 
    label: 'A casa', 
    description: 'Traslado desde hospital a domicilio',
    icon: 'home' as const
  },
  { 
    id: 'appointment' as const, 
    label: 'A cita médica', 
    description: 'Traslado para consulta o examen',
    icon: 'calendar' as const
  },
  { 
    id: 'emergency' as const, 
    label: 'Emergencia', 
    description: 'Traslado de emergencia entre centros',
    icon: 'flash' as const
  },
];

export default function EmergenciaTrasladoScreen() {
  const router = useRouter();
  const { user, currentLocation } = useUser();
  const [selectedType, setSelectedType] = useState<TransferType | null>(null);
  const [description, setDescription] = useState('');
  const [forSelf, setForSelf] = useState(true);
  const [needsAssistance, setNeedsAssistance] = useState(false);
  
  const handleContinue = () => {
    if (forSelf) {
      // Para el usuario logueado, saltar directamente a confirmación
      router.push('/emergencia/confirmacion');
    } else {
      // Para otra persona, seguir el flujo normal
      router.push('/emergencia/ubicacion');
    }
  };

  const canContinue = selectedType && description.trim() !== '';

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
        <ThemedText style={styles.title}>Traslado Médico</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.infoBox, { 
          backgroundColor: Colors.light.primary + '10',
          borderColor: Colors.light.primary + '30'
        }]}>
          <Ionicons name="information-circle" size={24} color={Colors.light.primary} />
          <ThemedText style={[styles.infoText, { color: Colors.light.primary }]}>
            Servicio de traslado médico seguro y cómodo con personal especializado
          </ThemedText>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>¿Para quién solicitas el traslado?</ThemedText>
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
                <ThemedText style={styles.infoText}>{user?.nombre || 'Usuario'} {user?.apellido || 'Apellido'}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.infoText}>{user?.telefono || 'Sin teléfono'}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="water" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.infoText}>Tipo de sangre: {user?.tipoSangre || 'No especificado'}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.infoText}>{currentLocation.direccion}</ThemedText>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tipo de traslado</ThemedText>
          {TRANSFER_TYPES.map((type) => (
            <TouchableOpacity 
              key={type.id}
              style={[
                styles.typeCard,
                { 
                  backgroundColor: Colors.light.white,
                  borderColor: selectedType === type.id ? Colors.light.primary : Colors.light.primary + '30'
                }
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <View style={styles.typeHeader}>
                <View style={[styles.typeIcon, { backgroundColor: Colors.light.primary + '20' }]}>
                  <Ionicons name={type.icon} size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.typeInfo}>
                  <ThemedText style={styles.typeLabel}>{type.label}</ThemedText>
                  <ThemedText style={styles.typeDescription}>
                    {type.description}
                  </ThemedText>
                </View>
                {selectedType === type.id && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.light.primary} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Detalles del traslado</ThemedText>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe el motivo del traslado, destino específico, horario preferido, etc."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Asistencia especial</ThemedText>
          <TouchableOpacity 
            style={[
              styles.assistanceOption,
              needsAssistance && styles.selectedAssistance
            ]}
            onPress={() => setNeedsAssistance(!needsAssistance)}
          >
            <Ionicons 
              name={needsAssistance ? "checkbox" : "square-outline"} 
              size={24} 
              color={needsAssistance ? Colors.light.primary : Colors.light.textSecondary} 
            />
            <View style={styles.assistanceText}>
              <ThemedText style={styles.assistanceLabel}>Requiere asistencia especial</ThemedText>
              <ThemedText style={styles.assistanceDescription}>
                Silla de ruedas, camilla, ayuda para caminar, etc.
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !canContinue && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
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
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.white,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  infoBox: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
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
  typeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeInfo: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.light.primary,
  },
  typeDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
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
  assistanceOption: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  selectedAssistance: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '10',
  },
  assistanceText: {
    marginLeft: 12,
    flex: 1,
  },
  assistanceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.light.primary,
  },
  assistanceDescription: {
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
}); 