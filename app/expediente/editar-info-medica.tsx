import { AppContainer } from '@/components/AppContainer';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

// Paleta de colores consistente con expediente.tsx
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

export default function EditarInfoMedicaScreen() {
  const { user, updateUser } = useUser();
  const { isDarkMode } = useTheme();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    tipoSangre: user.tipoSangre,
    peso: user.peso.toString(),
    altura: user.altura.toString(),
  });

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = () => {
    updateUser({
      ...user,
      tipoSangre: formData.tipoSangre,
      peso: parseFloat(formData.peso),
      altura: parseInt(formData.altura, 10),
    });
    
    router.back();
  };

  return (
    <AppContainer 
      title="Editar Información Médica" 
      showBackButton
    >
      <ScrollView style={styles.container}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.info} />
          <ThemedText style={styles.infoText}>
            Esta información se muestra en su expediente médico y puede ser consultada por los profesionales de salud.
          </ThemedText>
        </View>
        
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Tipo de sangre</ThemedText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: isDarkMode ? Colors.dark.background : COLORS.white }
              ]}
              value={formData.tipoSangre}
              onChangeText={(text) => handleChange('tipoSangre', text)}
              placeholder="Ej: O+, A-, B+..."
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Peso (kg)</ThemedText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: isDarkMode ? Colors.dark.background : COLORS.white }
              ]}
              value={formData.peso}
              onChangeText={(text) => handleChange('peso', text)}
              keyboardType="numeric"
              placeholder="Ingrese su peso en kilogramos"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Altura (cm)</ThemedText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: isDarkMode ? Colors.dark.background : COLORS.white }
              ]}
              value={formData.altura}
              onChangeText={(text) => handleChange('altura', text)}
              keyboardType="numeric"
              placeholder="Ingrese su altura en centímetros"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={() => router.back()}
          >
            <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={handleSave}
          >
            <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(23, 162, 184, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.info,
    flex: 1,
  },
  form: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
}); 