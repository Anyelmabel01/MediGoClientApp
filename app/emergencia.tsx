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

type EmergencyType = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  route: string;
};

const emergencyTypes: EmergencyType[] = [
  {
    id: '1',
    name: 'Emergencia Médica',
    icon: 'medkit',
    description: 'Para situaciones que requieren atención médica inmediata',
    route: '/emergencia/medica',
  },
  {
    id: '2',
    name: 'Accidente',
    icon: 'car',
    description: 'Para situaciones donde ha ocurrido un accidente y se requiere asistencia',
    route: '/emergencia/accidente',
  },
  {
    id: '3',
    name: 'Traslado',
    icon: 'bus',
    description: 'Para traslados médicos programados o de emergencia',
    route: '/emergencia/traslado',
  },
];

export default function EmergenciaScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user, currentLocation, setCurrentLocation } = useUser();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  const handleLocationSelect = (location: UserLocation) => {
    setCurrentLocation(location);
  };

  const handleEmergencySelect = (route: string) => {
    router.push(route as any);
  };

  const handleQuickEmergency = () => {
    // Ir directamente a confirmación saltándose todos los pasos - EMERGENCIA RÁPIDA
    router.push('/emergencia/confirmacion?quickEmergency=true' as any);
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
                {user?.nombre?.charAt(0) || 'U'}{user?.apellido?.charAt(0) || 'S'}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.greetingContainer}>
            <ThemedText style={styles.greeting}>
              Emergencia
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
        <ThemedText style={styles.subtitle}>Solicita ayuda médica de emergencia</ThemedText>
      </View>

      {/* Botón de emergencia prominente principal */}
      <TouchableOpacity 
        style={styles.prominentEmergencyButton}
        onPress={handleQuickEmergency}
      >
        <View style={styles.emergencyButtonContent}>
          <Ionicons name="flash" size={32} color="white" />
          <View style={styles.emergencyButtonText}>
            <ThemedText style={styles.emergencyButtonTitle}>EMERGENCIA RÁPIDA</ThemedText>
            <ThemedText style={styles.emergencyButtonSubtitle}>Solicitar ayuda inmediata</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedText style={styles.sectionTitle}>¿Qué tipo de emergencia necesitas?</ThemedText>
        
        {emergencyTypes.map((type) => (
          <TouchableOpacity 
            key={type.id}
            style={[styles.emergencyTypeCard, { 
              backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.white,
            }]}
            onPress={() => handleEmergencySelect(type.route)}
          >
            <View style={[styles.emergencyIcon, { 
              backgroundColor: Colors.light.primary + '20'
            }]}>
              <Ionicons name={type.icon} size={32} color={Colors.light.primary} />
            </View>
            <View style={styles.emergencyContent}>
              <ThemedText style={styles.emergencyName}>{type.name}</ThemedText>
              <ThemedText style={[styles.emergencyDescription, { 
                color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary 
              }]}>{type.description}</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.primary} />
          </TouchableOpacity>
        ))}
        
        <View style={[styles.infoBox, { 
          backgroundColor: Colors.light.primary + '10',
          borderColor: Colors.light.primary + '30'
        }]}>
          <Ionicons name="information-circle" size={24} color={Colors.light.primary} />
          <ThemedText style={[styles.infoText, { color: Colors.light.primary }]}>
            Nuestros servicios de emergencia están disponibles las 24 horas. Un profesional médico te atenderá lo antes posible.
          </ThemedText>
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
  prominentEmergencyButton: {
    backgroundColor: '#F44336',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#F44336',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButtonText: {
    marginLeft: 12,
    alignItems: 'center',
  },
  emergencyButtonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  emergencyButtonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.light.primary,
  },
  emergencyTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
  },
  emergencyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.light.primary,
  },
  emergencyDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoBox: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
}); 