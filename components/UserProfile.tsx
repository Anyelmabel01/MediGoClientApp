import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types/supabase';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface UserProfileProps {
  isVisible: boolean;
  onClose: () => void;
}

export function UserProfile({ isVisible, onClose }: UserProfileProps) {
  const { user, updateProfile } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Datos temporales para edición
  const [editData, setEditData] = useState<User | null>(null);

  // Cargar datos del usuario desde el contexto cuando el modal se abre
  useEffect(() => {
    if (isVisible && user) {
      setEditData(user);
    }
  }, [isVisible, user]);

  const handleSave = async () => {
    if (!editData || !user) return;

    setIsLoading(true);
    try {
      const result = await updateProfile({
        nombre: editData.nombre,
        apellido: editData.apellido,
        telefono: editData.telefono,
        tipo_sangre: editData.tipo_sangre,
        peso: editData.peso,
        altura: editData.altura,
        fecha_nacimiento: editData.fecha_nacimiento,
        genero: editData.genero,
      });

      if (result.error) {
        Alert.alert('Error', 'No se pudo actualizar el perfil: ' + result.error);
      } else {
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
        setIsEditing(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Error inesperado al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditData(user);
    }
    setIsEditing(false);
  };

  const handleChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate && editData) {
      setEditData({
        ...editData,
        fecha_nacimiento: selectedDate.toISOString().split('T')[0]
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No especificado';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderField = (label: string, value: string) => (
    <View style={styles.field}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      <ThemedText style={styles.fieldValue}>{value}</ThemedText>
    </View>
  );

  const renderEditField = (
    label: string, 
    value: string | null, 
    field: keyof User, 
    keyboardType: 'default' | 'email-address' | 'numeric' | 'phone-pad' = 'default'
  ) => (
    <View style={styles.editField}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      <TextInput
        style={[
          styles.input,
          isDarkMode && styles.inputDark
        ]}
        value={value?.toString() || ''}
        onChangeText={(text) => {
          if (!editData) return;
          const newValue = keyboardType === 'numeric' ? (text ? Number(text) : null) : text;
          setEditData({ ...editData, [field]: newValue });
        }}
        keyboardType={keyboardType}
        placeholderTextColor={isDarkMode ? '#999' : '#777'}
      />
    </View>
  );

  // Si no hay usuario, no mostrar el modal
  if (!user || !editData) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" translucent />
      <ThemedView style={styles.centeredView}>
        <View style={[
          styles.modalView,
          isDarkMode && styles.modalViewDark
        ]}>
          <View style={[
            styles.modalHeader,
            isDarkMode && styles.modalHeaderDark
          ]}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <ThemedText style={styles.avatarText}>
                    {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.profileInfo}>
                <ThemedText style={styles.userName}>
                  {user.nombre} {user.apellido}
                </ThemedText>
                <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons 
                name="close" 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {isEditing ? (
              // Modo edición
              <>
                {renderEditField('Nombre', editData.nombre, 'nombre')}
                {renderEditField('Apellido', editData.apellido, 'apellido')}
                {renderEditField('Correo electrónico', editData.email, 'email', 'email-address')}
                {renderEditField('Teléfono', editData.telefono || '', 'telefono', 'phone-pad')}
                {renderEditField('Tipo de sangre', editData.tipo_sangre || '', 'tipo_sangre')}
                {renderEditField('Peso (kg)', editData.peso?.toString() || '', 'peso', 'numeric')}
                {renderEditField('Altura (cm)', editData.altura?.toString() || '', 'altura', 'numeric')}
                
                <View style={styles.editField}>
                  <ThemedText style={styles.fieldLabel}>Fecha de nacimiento</ThemedText>
                  <TouchableOpacity
                    style={[
                      styles.datePickerButton,
                      isDarkMode && styles.datePickerButtonDark
                    ]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <ThemedText>{editData.fecha_nacimiento || 'No especificado'}</ThemedText>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={editData.fecha_nacimiento ? new Date(editData.fecha_nacimiento) : new Date()}
                      mode="date"
                      display="default"
                      onChange={handleChangeDate}
                      themeVariant={isDarkMode ? 'dark' : 'light'}
                    />
                  )}
                </View>
                
                <View style={styles.editField}>
                  <ThemedText style={styles.fieldLabel}>Género</ThemedText>
                  <View style={styles.genderOptions}>
                    {(['masculino', 'femenino', 'otro', 'noEspecificar'] as const).map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.genderOption,
                          isDarkMode && styles.genderOptionDark,
                          editData.genero === option && styles.genderOptionSelected
                        ]}
                        onPress={() => setEditData({ ...editData, genero: option })}
                      >
                        <ThemedText
                          style={[
                            styles.genderOptionText,
                            isDarkMode && styles.genderOptionTextDark,
                            editData.genero === option && styles.genderOptionTextSelected
                          ]}
                        >
                          {option === 'masculino' ? 'Masculino' : 
                           option === 'femenino' ? 'Femenino' : 
                           option === 'otro' ? 'Otro' : 'No especificar'}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            ) : (
              // Modo visualización
              <>
                {renderField('Nombre', `${user.nombre} ${user.apellido}`)}
                {renderField('Correo electrónico', user.email)}
                {renderField('Teléfono', user.telefono || 'No especificado')}
                {renderField('Tipo de sangre', user.tipo_sangre || 'No especificado')}
                {renderField('Peso', `${user.peso || 'No especificado'} kg`)}
                {renderField('Altura', `${user.altura || 'No especificado'} cm`)}
                {renderField('Fecha de nacimiento', formatDate(user.fecha_nacimiento))}
                {renderField('Género', 
                  user.genero === 'masculino' ? 'Masculino' : 
                  user.genero === 'femenino' ? 'Femenino' : 
                  user.genero === 'otro' ? 'Otro' : 'No especificado'
                )}
              </>
            )}
          </ScrollView>

          <View style={[
            styles.footer,
            isDarkMode && styles.footerDark
          ]}>
            {isEditing ? (
              <>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleCancel}>
                  <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
                  <ThemedText style={styles.primaryButtonText}>Guardar</ThemedText>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.primaryButton} onPress={() => setIsEditing(true)}>
                <ThemedText style={styles.primaryButtonText}>Editar perfil</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalViewDark: {
    backgroundColor: '#1e1e1e',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  modalHeaderDark: {
    borderBottomColor: '#333',
    backgroundColor: '#2a2a2a',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
  },
  modalContent: {
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  editField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputDark: {
    borderColor: '#444',
    backgroundColor: '#333',
    color: '#fff',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  datePickerButtonDark: {
    borderColor: '#444',
    backgroundColor: '#333',
  },
  genderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  genderOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  genderOptionDark: {
    borderColor: '#444',
    backgroundColor: '#333',
  },
  genderOptionSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  genderOptionText: {
    color: '#333',
  },
  genderOptionTextDark: {
    color: '#ddd',
  },
  genderOptionTextSelected: {
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  footerDark: {
    borderTopColor: '#333',
    backgroundColor: '#1e1e1e',
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  buttonText: {
    color: '#333',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 10,
  },
}); 