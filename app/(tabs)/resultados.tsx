import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { BottomNavbar } from '@/components/BottomNavbar';
import { LocationSelector } from '@/components/LocationSelector';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserProfile } from '@/components/UserProfile';
import { Colors } from '@/constants/Colors';
import { UserLocation } from '@/constants/UserModel';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';

const filtros = [
  { nombre: 'Todos', value: 'todos' },
  { nombre: 'Normal', value: 'normal' },
  { nombre: 'Anormal', value: 'anormal' },
  { nombre: 'Requiere Revisión', value: 'revision' },
];

const resultados = [
  { id: '1', prueba: 'Biometría Hemática', fecha: '2024-06-01', laboratorio: 'Lab Salud', estado: 'normal' },
  { id: '2', prueba: 'Perfil Lipídico', fecha: '2024-05-20', laboratorio: 'BioLab Express', estado: 'anormal' },
  { id: '3', prueba: 'Examen General de Orina', fecha: '2024-05-10', laboratorio: 'Lab Salud', estado: 'revision' },
] as const;

const estadoColor: Record<'normal' | 'anormal' | 'revision', string> = {
  normal: '#43A047',
  anormal: '#E53935',
  revision: '#FFA000',
};

export default function ResultadosScreen() {
  const [filtro, setFiltro] = useState('todos');
  const router = useRouter();
  const { user, currentLocation, setCurrentLocation } = useUser();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

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
              Mis Resultados
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
        <ThemedText style={styles.subtitle}>Consulta tus resultados de laboratorio</ThemedText>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtros}>
          {filtros.map((f) => (
            <TouchableOpacity 
              key={f.value} 
              style={[styles.filtro, filtro === f.value && styles.filtroActivo]} 
              onPress={() => setFiltro(f.value)}
            >
              <ThemedText style={[styles.filtroTexto, filtro === f.value && styles.filtroTextoActivo]}>
                {f.nombre}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.listaResultados}>
          {resultados.filter(r => filtro === 'todos' || r.estado === filtro).map((res) => (
            <TouchableOpacity
              key={res.id}
              style={styles.cardResultado}
              onPress={() => router.push(`../../laboratorio/resultados/${res.id}` as any)}
            >
              <View style={styles.cardHeader}>
                <ThemedText style={styles.pruebaNombre}>{res.prueba}</ThemedText>
                <View style={[styles.estado, { backgroundColor: estadoColor[res.estado as keyof typeof estadoColor] }]}>
                  <ThemedText style={styles.estadoTexto}>
                    {res.estado.charAt(0).toUpperCase() + res.estado.slice(1)}
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={styles.fecha}>{res.fecha}</ThemedText>
              <ThemedText style={styles.laboratorio}>{res.laboratorio}</ThemedText>
              <TouchableOpacity 
                style={styles.botonVer} 
                onPress={() => router.push(`../../laboratorio/resultados/${res.id}` as any)}
              >
                <ThemedText style={styles.botonVerTexto}>Ver Detalles</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  filtros: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filtro: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filtroActivo: {
    backgroundColor: Colors.light.primary,
  },
  filtroTexto: {
    color: Colors.light.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  filtroTextoActivo: {
    color: Colors.light.white,
  },
  listaResultados: {
    marginBottom: 20,
  },
  cardResultado: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  pruebaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
    flex: 1,
  },
  estado: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  estadoTexto: {
    color: Colors.light.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  fecha: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  laboratorio: {
    fontSize: 14,
    color: Colors.light.primary,
    marginBottom: 12,
    fontWeight: '600',
  },
  botonVer: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  botonVerTexto: {
    color: Colors.light.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 