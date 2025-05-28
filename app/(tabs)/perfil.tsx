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
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen() {
  const { user, currentLocation, setCurrentLocation } = useUser();
  const { isDarkMode } = useTheme();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const router = useRouter();

  const handleLocationSelect = (location: UserLocation) => {
    setCurrentLocation(location);
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header igual al diseño principal */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfoContainer}
          onPress={() => setShowUserProfile(true)}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {user.nombre.charAt(0)}{user.apellido.charAt(0)}
              </ThemedText>
            </View>
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
        {/* Cards de Información Médica */}
        <View style={styles.section}>
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
        onLocationSelect={handleLocationSelect}
      />
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
}); 