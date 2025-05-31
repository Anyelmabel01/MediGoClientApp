import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { BottomNavbar } from '@/components/BottomNavbar';
import { LocationSelector } from '@/components/LocationSelector';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserProfile } from '@/components/UserProfile';
import { Colors } from '@/constants/Colors';
import { UserLocation } from '@/constants/UserModel';
import { useUser } from '@/hooks/useUser';

const categorias = [
  { nombre: 'Pruebas de Sangre', icon: 'water' },
  { nombre: 'Pruebas de Orina', icon: 'flask' },
  { nombre: 'Estudios de Imagen', icon: 'images' },
  { nombre: 'Pruebas Especiales', icon: 'star' },
  { nombre: 'Paquetes de Salud', icon: 'medkit' },
];

const pruebas: Prueba[] = [
  { id: '1', nombre: 'Biometría Hemática', descripcion: 'Conteo y análisis de células sanguíneas', precio: 'Bs 80', requierePreparacion: true },
  { id: '2', nombre: 'Examen General de Orina', descripcion: 'Análisis de orina para detección de enfermedades', precio: 'Bs 50', requierePreparacion: false },
  { id: '3', nombre: 'Perfil Lipídico', descripcion: 'Medición de colesterol y triglicéridos', precio: 'Bs 120', requierePreparacion: true },
];

export default function PruebasScreen() {
  const [busqueda, setBusqueda] = useState('');
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
              Catálogo de Pruebas
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
        <ThemedText style={styles.subtitle}>Encuentra las pruebas que necesitas</ThemedText>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.barraBusqueda}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            style={styles.inputBusqueda}
            placeholder="Buscar prueba..."
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorias}>
          {categorias.map((cat) => (
            <View key={cat.nombre} style={styles.categoria}>
              <View style={styles.categoriaIconContainer}>
                <Ionicons name={cat.icon as any} size={24} color={Colors.light.primary} />
              </View>
              <ThemedText style={styles.categoriaTexto}>{cat.nombre}</ThemedText>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.listaPruebas}>
          {pruebas.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).map((prueba) => (
            <TouchableOpacity
              key={prueba.id}
              style={styles.cardPrueba}
              onPress={() => router.push(`../../laboratorio/detalle/${prueba.id}` as any)}
            >
              <View style={styles.cardHeader}>
                <ThemedText style={styles.pruebaNombre}>{prueba.nombre}</ThemedText>
                {prueba.requierePreparacion && (
                  <Ionicons name="alert-circle" size={18} color="#FFA000" style={{ marginLeft: 6 }} />
                )}
              </View>
              <ThemedText style={styles.pruebaDescripcion}>{prueba.descripcion}</ThemedText>
              <ThemedText style={styles.pruebaPrecio}>{prueba.precio}</ThemedText>
              <TouchableOpacity style={styles.botonReservar} onPress={() => router.push(`../../laboratorio/reservar/${prueba.id}` as any)}>
                <ThemedText style={styles.botonReservarTexto}>Reservar</ThemedText>
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
  barraBusqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    shadowColor: Colors.light.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputBusqueda: {
    flex: 1,
    marginLeft: 8,
    height: 44,
    fontSize: 16,
  },
  categorias: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoria: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoriaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 160, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoriaTexto: {
    fontSize: 12,
    color: Colors.light.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  listaPruebas: {
    marginBottom: 20,
  },
  cardPrueba: {
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
  },
  pruebaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  pruebaDescripcion: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  pruebaPrecio: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  botonReservar: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  botonReservarTexto: {
    color: Colors.light.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 