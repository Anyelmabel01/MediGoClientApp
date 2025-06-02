import { BottomNavbar } from '@/components/BottomNavbar';
import { LocationSelector } from '@/components/LocationSelector';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserProfile } from '@/components/UserProfile';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen() {
  const { user, currentLocation } = useUser();
  const { isDarkMode } = useTheme();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const router = useRouter();

  if (!user) {
    return null; // or loading spinner
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={[styles.header, { backgroundColor: Colors.light.primary }]}>
        <View style={styles.headerContent}>
          <ThemedText style={[styles.title, { color: Colors.light.white }]}>Mi Perfil</ThemedText>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.profileSection, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}>
          <TouchableOpacity 
            style={styles.profileHeader}
            onPress={() => setShowUserProfile(true)}
          >
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: Colors.light.primary }]}>
                  <ThemedText style={styles.avatarText}>
                    {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                  </ThemedText>
                </View>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <ThemedText style={styles.userName}>
                {user.nombre} {user.apellido}
              </ThemedText>
              <ThemedText style={[styles.userEmail, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                {user.email}
              </ThemedText>
              <View style={styles.editProfileButton}>
                <ThemedText style={[styles.editProfileText, { color: Colors.light.primary }]}>
                  Editar perfil
                </ThemedText>
                <Ionicons name="pencil" size={14} color={Colors.light.primary} />
              </View>
            </View>
          </TouchableOpacity>
          
          <View style={styles.infoCardsContainer}>
            <View style={[styles.infoCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
              <Ionicons name="water" size={24} color={Colors.light.primary} />
              <ThemedText style={[styles.infoCardTitle, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Tipo de sangre</ThemedText>
              <ThemedText style={styles.infoCardValue}>{user.tipoSangre}</ThemedText>
            </View>
            
            <View style={[styles.infoCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
              <Ionicons name="fitness" size={24} color={Colors.light.primary} />
              <ThemedText style={[styles.infoCardTitle, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Peso</ThemedText>
              <ThemedText style={styles.infoCardValue}>{user.peso} kg</ThemedText>
            </View>
            
            <View style={[styles.infoCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
              <Ionicons name="resize" size={24} color={Colors.light.primary} />
              <ThemedText style={[styles.infoCardTitle, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Altura</ThemedText>
              <ThemedText style={styles.infoCardValue}>{user.altura} cm</ThemedText>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Mi ubicación</ThemedText>
          
          <TouchableOpacity 
            style={[styles.locationCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}
            onPress={() => setShowLocationSelector(true)}
          >
            <View style={styles.locationIconContainer}>
              <Ionicons name="location" size={24} color={Colors.light.primary} />
            </View>
            
            <View style={styles.locationInfo}>
              <ThemedText style={styles.locationName}>
                {currentLocation.nombre}
              </ThemedText>
              <ThemedText style={[styles.locationAddress, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                {currentLocation.direccion}
              </ThemedText>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Mi Expediente Médico</ThemedText>
          
          <TouchableOpacity 
            style={[styles.expedienteCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}
            onPress={() => router.push('/expediente' as any)}
          >
            <View style={styles.expedienteIconContainer}>
              <Ionicons name="document-text" size={24} color={Colors.light.primary} />
            </View>
            
            <View style={styles.expedienteInfo}>
              <ThemedText style={styles.expedienteName}>
                Ver Expediente Completo
              </ThemedText>
              <ThemedText style={[styles.expedienteDescription, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                Accede a tu historial médico y documentos
              </ThemedText>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary} />
          </TouchableOpacity>
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
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingBottom: 80,
  },
  profileSection: {
    padding: 16,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.light.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileText: {
    marginRight: 4,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  infoCardTitle: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
  },
  expedienteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 10,
  },
  expedienteIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expedienteInfo: {
    flex: 1,
  },
  expedienteName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expedienteDescription: {
    fontSize: 14,
  }
}); 