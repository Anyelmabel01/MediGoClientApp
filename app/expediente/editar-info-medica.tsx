import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Animated, Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditarInfoMedicaScreen() {
  const { user, updateUser } = useUser();
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));

  const [formData, setFormData] = useState({
    tipoSangre: user?.tipoSangre || '',
    peso: user?.peso?.toString() || '',
    altura: user?.altura?.toString() || '',
  });

  const [errors, setErrors] = useState({
    tipoSangre: '',
    peso: '',
    altura: '',
  });

  const validateForm = () => {
    const newErrors = { tipoSangre: '', peso: '', altura: '' };
    let hasErrors = false;

    if (!formData.tipoSangre.trim()) {
      newErrors.tipoSangre = 'El tipo de sangre es requerido';
      hasErrors = true;
    }

    const peso = parseFloat(formData.peso);
    if (!formData.peso.trim() || isNaN(peso) || peso <= 0 || peso > 500) {
      newErrors.peso = 'Ingrese un peso válido (1-500 kg)';
      hasErrors = true;
    }

    const altura = parseInt(formData.altura);
    if (!formData.altura.trim() || isNaN(altura) || altura < 30 || altura > 250) {
      newErrors.altura = 'Ingrese una altura válida (30-250 cm)';
      hasErrors = true;
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Limpiar error del campo al empezar a editar
    if (errors[field as keyof typeof errors]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      return;
    }

    updateUser({
      ...user,
      tipoSangre: formData.tipoSangre.trim(),
      peso: parseFloat(formData.peso),
      altura: parseInt(formData.altura),
    });
    
    setShowSuccessModal(true);
    
    // Animación de entrada del modal
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCloseModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSuccessModal(false);
      router.back();
    });
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="auto" />
      
      {/* Header como el de consultas */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.white} />
          </TouchableOpacity>
          
          <View style={styles.userInfoContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {user?.nombre?.charAt(0) || 'U'}{user?.apellido?.charAt(0) || 'S'}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.greetingContainer}>
              <ThemedText style={styles.greeting}>
                Información Médica
              </ThemedText>
              <View style={styles.editProfileIndicator}>
                <Ionicons name="medical" size={14} color={Colors.light.primary} />
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
      >
        <View style={[styles.infoBox, {
          backgroundColor: isDarkMode ? Colors.dark.border : 'rgba(0, 160, 176, 0.1)',
        }]}>
          <Ionicons name="information-circle" size={20} color={Colors.light.primary} />
          <ThemedText style={[styles.infoText, { color: Colors.light.primary }]}>
            Esta información se muestra en su expediente médico y puede ser consultada por los profesionales de salud.
          </ThemedText>
        </View>
        
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Tipo de sangre *</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
                  borderColor: errors.tipoSangre ? Colors.light.error : Colors.light.border,
                  color: isDarkMode ? Colors.dark.text : Colors.light.text,
                }
              ]}
              value={formData.tipoSangre}
              onChangeText={(text) => handleChange('tipoSangre', text)}
              placeholder="Ej: O+, A-, B+, AB..."
              placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
              autoCapitalize="characters"
            />
            {errors.tipoSangre ? (
              <ThemedText style={styles.errorText}>{errors.tipoSangre}</ThemedText>
            ) : null}
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Peso (kg) *</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
                  borderColor: errors.peso ? Colors.light.error : Colors.light.border,
                  color: isDarkMode ? Colors.dark.text : Colors.light.text,
                }
              ]}
              value={formData.peso}
              onChangeText={(text) => handleChange('peso', text)}
              keyboardType="decimal-pad"
              placeholder="Ingrese su peso en kilogramos"
              placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
            />
            {errors.peso ? (
              <ThemedText style={styles.errorText}>{errors.peso}</ThemedText>
            ) : null}
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Altura (cm) *</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
                  borderColor: errors.altura ? Colors.light.error : Colors.light.border,
                  color: isDarkMode ? Colors.dark.text : Colors.light.text,
                }
              ]}
              value={formData.altura}
              onChangeText={(text) => handleChange('altura', text)}
              keyboardType="number-pad"
              placeholder="Ingrese su altura en centímetros"
              placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
            />
            {errors.altura ? (
              <ThemedText style={styles.errorText}>{errors.altura}</ThemedText>
            ) : null}
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton, {
              borderColor: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary,
            }]} 
            onPress={() => router.back()}
          >
            <ThemedText style={[styles.cancelButtonText, {
              color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary,
            }]}>Cancelar</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton, { backgroundColor: Colors.light.primary }]} 
            onPress={handleSave}
          >
            <ThemedText style={styles.saveButtonText}>Guardar Cambios</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showSuccessModal && (
        <Modal
          visible={showSuccessModal}
          transparent={true}
          animationType="fade"
        >
          <Animated.View
            style={[
              styles.modalBackground,
              { opacity: fadeAnim },
            ]}
          >
            <Animated.View 
              style={[
                styles.modalContent,
                { 
                  transform: [{ scale: scaleAnim }],
                  backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
                }
              ]}
            >
              {/* Icono de éxito */}
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
              </View>
              
              {/* Título */}
              <ThemedText style={[styles.modalTitle, { 
                color: isDarkMode ? Colors.dark.text : Colors.light.textPrimary 
              }]}>
                ¡Información actualizada!
              </ThemedText>
              
              {/* Mensaje */}
              <ThemedText style={[styles.modalMessage, {
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary
              }]}>
                Tu información médica se ha guardado correctamente y ya está disponible en tu expediente.
              </ThemedText>
              
              {/* Botón */}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors.light.primary }]}
                onPress={handleCloseModal}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark" size={20} color={Colors.light.white} style={styles.buttonIcon} />
                <ThemedText style={styles.modalButtonText}>Continuar</ThemedText>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </Modal>
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
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: Colors.light.primary,
    fontSize: 17,
    fontWeight: 'bold',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  editProfileIndicator: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 4,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  form: {
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.primary,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 16,
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.light.white,
    padding: 32,
    borderRadius: 20,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 12,
  },
  closeButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '600',
  },
  successIconContainer: {
    marginBottom: 20,
  },
  modalButton: {
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 