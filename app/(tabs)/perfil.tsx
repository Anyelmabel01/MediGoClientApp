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
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Animated, Image, Modal, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export default function PerfilScreen() {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Estados para modales personalizados
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAnimation] = useState(new Animated.Value(0));
  
  const { user, currentLocation, setCurrentLocation } = useUser();
  const { isDarkMode } = useTheme();
  const { updateProfile } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLocationSelect = (location: UserLocation) => {
    setCurrentLocation(location);
  };

  if (!user) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Cargando...</ThemedText>
      </ThemedView>
    );
  }

  const showModal = (type: 'success' | 'error' | 'imagePicker', message: string = '') => {
    setModalMessage(message);
    
    if (type === 'success') {
      setShowSuccessModal(true);
    } else if (type === 'error') {
      setShowErrorModal(true);
    } else if (type === 'imagePicker') {
      setShowImagePickerModal(true);
    }
    
    // Animación de entrada
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowSuccessModal(false);
      setShowErrorModal(false);
      setShowImagePickerModal(false);
    });
  };

  const uploadImage = async (uri: string): Promise<string | null> => {
    try {
      if (!user?.id) return null;

      console.log('Procesando imagen:', uri);

      // Crear nombre único para el archivo
      const fileExtension = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}_${Date.now()}.${fileExtension}`;
      const filePath = `avatars/${fileName}`;

      // Usar expo-file-system directamente (más confiable para URIs locales)
      const FileSystem = require('expo-file-system');
      
      // Leer el archivo como base64
      const base64String = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('Imagen leída correctamente, tamaño base64:', base64String.length);

      // Convertir base64 a Uint8Array para React Native
      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      console.log('Archivo preparado, subiendo a Supabase...');

      // Subir el archivo a Supabase usando ArrayBuffer
      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, bytes.buffer, {
          contentType: `image/${fileExtension}`,
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error('Error al subir la imagen: ' + uploadError.message);
      }

      // Obtener la URL pública
      const { data } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      console.log('Imagen subida exitosamente:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Error processing image:', error);
      
      // Mostrar mensaje de error más específico al usuario
      if (error instanceof Error) {
        if (error.message.includes('FileSystem')) {
          console.error('Error al leer el archivo de imagen.');
        } else if (error.message.includes('upload')) {
          console.error('Error al subir la imagen al servidor.');
        } else if (error.message.includes('Blob')) {
          console.error('Error en el formato de la imagen.');
        } else {
          console.error('Error al procesar imagen: ' + error.message);
        }
      } else {
        console.error('Error desconocido al procesar imagen.');
      }
      
      return null;
    }
  };

  const handleImagePicker = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showModal('error', 'Se necesitan permisos para acceder a la galería');
        return;
      }

      // Mostrar opciones
      showModal('imagePicker');
    } catch (error) {
      showModal('error', 'Error al acceder a las opciones de imagen');
    }
  };

  const pickImage = async (source: 'gallery' | 'camera') => {
    try {
      setIsUploadingImage(true);

      let result: ImagePicker.ImagePickerResult;

      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          showModal('error', 'Se necesitan permisos para usar la cámara');
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Imagen seleccionada:', imageUri);
        
        // Subir imagen
        const publicUrl = await uploadImage(imageUri);
        
        if (publicUrl) {
          // Actualizar perfil con nueva URL
          const updateResult = await updateProfile({ avatar_url: publicUrl });
          
          if (updateResult.error) {
            showModal('error', 'Error al actualizar la foto de perfil');
          } else {
            showModal('success', 'Foto de perfil actualizada correctamente');
          }
        } else {
          showModal('error', 'Error al subir la imagen');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showModal('error', 'Error al seleccionar la imagen');
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfoContainer}
          onPress={() => setShowUserProfile(true)}
        >
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                </ThemedText>
              </View>
            )}
          </View>
          
          <View style={styles.greetingContainer}>
            <ThemedText style={styles.greeting}>
              Mi Perfil
            </ThemedText>
            <View style={styles.editProfileIndicator}>
              <Ionicons name="create-outline" size={14} color={Colors.light.primary} />
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
        <ThemedText style={styles.subtitle}>Gestiona tu información personal</ThemedText>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sección Principal del Perfil del Usuario */}
        <View style={styles.section}>
          <View style={[styles.profileMainCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}>
            {/* Avatar y datos principales */}
            <View style={styles.profileHeader}>
              <TouchableOpacity 
                style={styles.avatarMainContainer}
                onPress={handleImagePicker}
                activeOpacity={0.8}
                disabled={isUploadingImage}
              >
                {user?.avatar ? (
                  <Image 
                    source={{ uri: user.avatar }} 
                    style={styles.avatarMain}
                  />
                ) : (
                  <View style={[styles.avatarMain, { backgroundColor: Colors.light.primary }]}>
                    <ThemedText style={styles.avatarMainText}>
                      {user?.nombre?.charAt(0) || 'U'}{user?.apellido?.charAt(0) || 'S'}
                    </ThemedText>
                  </View>
                )}
                <View style={styles.editAvatarOverlay}>
                  {isUploadingImage ? (
                    <ActivityIndicator size={12} color={Colors.light.white} />
                  ) : (
                    <Ionicons name="camera" size={16} color={Colors.light.white} />
                  )}
                </View>
              </TouchableOpacity>
              
              <View style={styles.profileMainInfo}>
                <ThemedText style={[styles.userName, { color: isDarkMode ? Colors.dark.text : Colors.light.textPrimary }]}>
                  {user?.nombre} {user?.apellido}
                </ThemedText>
                <ThemedText style={[styles.userEmail, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                  {user?.email}
                </ThemedText>
                
                {/* Botón de editar perfil más visible */}
                <TouchableOpacity 
                  style={[styles.editProfileMainButton, { borderColor: Colors.light.primary }]}
                  onPress={() => setShowUserProfile(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={16} color={Colors.light.primary} />
                  <ThemedText style={[styles.editProfileMainText, { color: Colors.light.primary }]}>
                    Editar perfil
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Cards de Información Médica */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: Colors.light.primary }]}>
            Información Médica
          </ThemedText>
          <View style={styles.infoCardsContainer}>
            <View style={[styles.infoCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}>
              <View style={[styles.infoCardIcon, { backgroundColor: '#FFE5E5' }]}>
                <Ionicons name="water" size={24} color="#FF4444" />
              </View>
              <ThemedText style={[styles.infoCardTitle, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                Tipo de sangre
              </ThemedText>
              <ThemedText style={styles.infoCardValue}>{user.tipoSangre}</ThemedText>
            </View>
            
            <View style={[styles.infoCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}>
              <View style={[styles.infoCardIcon, { backgroundColor: '#E5F3FF' }]}>
                <Ionicons name="fitness" size={24} color={Colors.light.primary} />
              </View>
              <ThemedText style={[styles.infoCardTitle, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                Peso
              </ThemedText>
              <ThemedText style={styles.infoCardValue}>{user.peso} kg</ThemedText>
            </View>
            
            <View style={[styles.infoCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}>
              <View style={[styles.infoCardIcon, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="resize" size={24} color="#4CAF50" />
              </View>
              <ThemedText style={[styles.infoCardTitle, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                Altura
              </ThemedText>
              <ThemedText style={styles.infoCardValue}>{user.altura} cm</ThemedText>
            </View>
          </View>
        </View>
        
        {/* Card de Ubicación */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: Colors.light.primary }]}>
            Mi Ubicación
          </ThemedText>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}
            onPress={() => setShowLocationSelector(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionCardIcon, { backgroundColor: 'rgba(45, 127, 249, 0.1)' }]}>
              <Ionicons name="location" size={24} color={Colors.light.primary} />
            </View>
            
            <View style={styles.actionCardContent}>
              <ThemedText style={styles.actionCardTitle}>
                {currentLocation.nombre}
              </ThemedText>
              <ThemedText style={[styles.actionCardSubtitle, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                {currentLocation.direccion}
              </ThemedText>
            </View>
            
            <View style={styles.chevronContainer}>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.primary} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Card de Expediente */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: Colors.light.primary }]}>
            Expediente Médico
          </ThemedText>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}
            onPress={() => router.push('/expediente' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionCardIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
              <Ionicons name="document-text" size={24} color="#4CAF50" />
            </View>
            
            <View style={styles.actionCardContent}>
              <ThemedText style={styles.actionCardTitle}>
                Ver Expediente Completo
              </ThemedText>
              <ThemedText style={[styles.actionCardSubtitle, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                Accede a tu historial médico y documentos
              </ThemedText>
            </View>
            
            <View style={styles.chevronContainer}>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Espaciado inferior para la bottom navbar */}
        <View style={styles.bottomSpacer} />
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

      {/* Modales personalizados */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: modalAnimation,
            },
          ]}
        >
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Éxito</ThemedText>
            <ThemedText style={styles.modalMessage}>{modalMessage}</ThemedText>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <ThemedText style={styles.closeButtonText}>Cerrar</ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      <Modal
        visible={showErrorModal}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: modalAnimation,
            },
          ]}
        >
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Error</ThemedText>
            <ThemedText style={styles.modalMessage}>{modalMessage}</ThemedText>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <ThemedText style={styles.closeButtonText}>Cerrar</ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      <Modal
        visible={showImagePickerModal}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: modalAnimation,
            },
          ]}
        >
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Cambiar foto de perfil</ThemedText>
            <ThemedText style={styles.modalMessage}>Selecciona una opción</ThemedText>
            <View style={styles.imagePickerButtons}>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={() => {
                  closeModal();
                  pickImage('gallery');
                }}
              >
                <ThemedText style={styles.imagePickerButtonText}>Galería</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={() => {
                  closeModal();
                  pickImage('camera');
                }}
              >
                <ThemedText style={styles.imagePickerButtonText}>Cámara</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
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
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoCard: {
    width: '31%',
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
  },
  infoCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.light.primary,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 12,
  },
  actionCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionCardContent: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.light.primary,
  },
  actionCardSubtitle: {
    fontSize: 14,
  },
  chevronContainer: {
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 20,
  },
  profileMainCard: {
    borderRadius: 12,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarMainContainer: {
    marginRight: 12,
  },
  avatarMain: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarMainText: {
    color: Colors.light.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  editAvatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileMainInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  editProfileMainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: 12,
  },
  editProfileMainText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.primary,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    color: Colors.light.textSecondary,
  },
  closeButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
  },
  closeButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  imagePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  imagePickerButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
    flex: 1,
  },
  imagePickerButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 