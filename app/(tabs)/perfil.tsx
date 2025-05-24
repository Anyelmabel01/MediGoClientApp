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
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen() {
  const { user, currentLocation } = useUser();
  const { isDarkMode } = useTheme();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header moderno unificado */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>Mi Perfil</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Gestiona tu información personal</ThemedText>
        </View>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card de Perfil Principal */}
        <View style={[styles.profileCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}>
          <TouchableOpacity 
            style={styles.profileHeader}
            onPress={() => setShowUserProfile(true)}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <ThemedText style={styles.avatarText}>
                    {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                  </ThemedText>
                </View>
              )}
              <View style={styles.avatarBadge}>
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <ThemedText style={styles.userName}>
                {user.nombre} {user.apellido}
              </ThemedText>
              <ThemedText style={[styles.userEmail, { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                {user.email}
              </ThemedText>
              <View style={styles.editProfileButton}>
                <Ionicons name="pencil" size={14} color={Colors.light.primary} />
                <ThemedText style={[styles.editProfileText, { color: Colors.light.primary }]}>
                  Editar perfil
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.chevronContainer}>
              <Ionicons name="chevron-forward" size={20} color={Colors.light.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Cards de Información Médica */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Información Médica</ThemedText>
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
          <ThemedText style={styles.sectionTitle}>Mi Ubicación</ThemedText>
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
          <ThemedText style={styles.sectionTitle}>Expediente Médico</ThemedText>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white }]}
            onPress={() => router.push('/expediente')}
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
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: Platform.OS === 'android' ? 25 : 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  profileCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
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
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 12,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  chevronContainer: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F2937',
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoCardTitle: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  infoCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionCardContent: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionCardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 100,
  },
}); 