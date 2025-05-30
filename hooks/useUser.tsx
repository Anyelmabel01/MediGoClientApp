import { mockLocations, mockUser, User, UserLocation } from '@/constants/UserModel';
import { User as SupabaseUser } from '@/types/supabase';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

// Tipo para el contexto del usuario (datos de usuario + ubicaciones)
type UserContextType = {
  user: User | null;
  locations: UserLocation[];
  currentLocation: UserLocation;
  addLocation: (location: Omit<UserLocation, 'id'>) => void;
  updateLocation: (locationId: string, locationData: Partial<UserLocation>) => void;
  deleteLocation: (locationId: string) => void;
  setDefaultLocation: (locationId: string) => void;
  setCurrentLocation: (location: UserLocation) => void;
  updateUser: (userData: Partial<User>) => void;
};

// Crear el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Función para transformar el usuario de Supabase al formato local
const transformSupabaseUser = (supabaseUser: SupabaseUser): User => {
  return {
    id: supabaseUser.id,
    nombre: supabaseUser.nombre,
    apellido: supabaseUser.apellido,
    email: supabaseUser.email,
    telefono: supabaseUser.telefono || '',
    tipoSangre: supabaseUser.tipo_sangre || '',
    peso: supabaseUser.peso || 0,
    altura: supabaseUser.altura || 0,
    fechaNacimiento: supabaseUser.fecha_nacimiento || '',
    genero: (supabaseUser.genero as 'masculino' | 'femenino' | 'otro' | 'noEspecificar') || 'noEspecificar',
    avatar: supabaseUser.avatar_url || '',
  };
};

// Proveedor del contexto (usuario completo + ubicaciones)
export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser, updateProfile } = useAuth();
  const [locations, setLocations] = useState<UserLocation[]>(mockLocations);
  const [currentLocation, setCurrentLocation] = useState<UserLocation>(
    mockLocations.find(loc => loc.esPrincipal) || mockLocations[0]
  );

  // Estado para el usuario combinado (datos de auth + datos adicionales como mock)
  const [user, setUser] = useState<User | null>(null);

  // Efecto para combinar datos del usuario autenticado con datos adicionales
  useEffect(() => {
    if (authUser) {
      // Transformar el usuario de Supabase al formato local
      const transformedUser = transformSupabaseUser(authUser);
      
      // Combinar con datos mock para campos faltantes
      const combinedUser: User = {
        id: transformedUser.id,
        nombre: transformedUser.nombre || mockUser.nombre,
        apellido: transformedUser.apellido || mockUser.apellido,
        email: transformedUser.email || mockUser.email,
        telefono: transformedUser.telefono || mockUser.telefono,
        tipoSangre: transformedUser.tipoSangre || mockUser.tipoSangre,
        peso: transformedUser.peso || mockUser.peso,
        altura: transformedUser.altura || mockUser.altura,
        fechaNacimiento: transformedUser.fechaNacimiento || mockUser.fechaNacimiento,
        genero: transformedUser.genero || mockUser.genero,
        avatar: transformedUser.avatar || mockUser.avatar,
      };
      setUser(combinedUser);
    } else {
      setUser(null);
    }
  }, [authUser]);

  // Añadir una nueva ubicación
  const addLocation = (location: Omit<UserLocation, 'id'>) => {
    const newLocation: UserLocation = {
      ...location,
      id: `new-${Date.now()}`,
      userId: user?.id || '',
    };
    
    if (locations.length === 0 || newLocation.esPrincipal) {
      const updatedLocations = locations.map(loc => ({
        ...loc,
        esPrincipal: false
      }));
      setLocations([...updatedLocations, newLocation]);
      setCurrentLocation(newLocation);
    } else {
      setLocations([...locations, newLocation]);
    }
  };

  // Actualizar una ubicación
  const updateLocation = (locationId: string, locationData: Partial<UserLocation>) => {
    const updatedLocations = locations.map(loc => 
      loc.id === locationId 
        ? { ...loc, ...locationData } 
        : (locationData.esPrincipal ? { ...loc, esPrincipal: false } : loc)
    );
    
    setLocations(updatedLocations);
    
    const updatedLocation = updatedLocations.find(loc => loc.id === locationId);
    if (updatedLocation && (currentLocation.id === locationId || updatedLocation.esPrincipal)) {
      setCurrentLocation(updatedLocation);
    }
  };

  // Eliminar una ubicación
  const deleteLocation = (locationId: string) => {
    if (locations.length <= 1) return;
    
    const locationToDelete = locations.find(loc => loc.id === locationId);
    const updatedLocations = locations.filter(loc => loc.id !== locationId);
    
    if (locationToDelete?.esPrincipal && updatedLocations.length > 0) {
      updatedLocations[0].esPrincipal = true;
      setCurrentLocation(updatedLocations[0]);
    }
    
    if (currentLocation.id === locationId && !locationToDelete?.esPrincipal) {
      const defaultLocation = updatedLocations.find(loc => loc.esPrincipal) || updatedLocations[0];
      setCurrentLocation(defaultLocation);
    }
    
    setLocations(updatedLocations);
  };

  // Establecer una ubicación como predeterminada
  const setDefaultLocation = (locationId: string) => {
    const updatedLocations = locations.map(loc => ({
      ...loc,
      esPrincipal: loc.id === locationId
    }));
    
    setLocations(updatedLocations);
    
    const newDefault = updatedLocations.find(loc => loc.id === locationId);
    if (newDefault) {
      setCurrentLocation(newDefault);
    }
  };

  // Actualizar datos del usuario
  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // También actualizar en el contexto de autenticación si hay campos que coinciden
      const authUpdates: any = {};
      if (userData.nombre) authUpdates.nombre = userData.nombre;
      if (userData.apellido) authUpdates.apellido = userData.apellido;
      if (userData.telefono) authUpdates.telefono = userData.telefono;
      
      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(authUpdates);
      }
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      locations,
      currentLocation,
      addLocation,
      updateLocation,
      deleteLocation,
      setDefaultLocation,
      setCurrentLocation,
      updateUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook para acceder al contexto
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
} 