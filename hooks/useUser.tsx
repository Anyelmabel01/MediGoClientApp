import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, mockUser, UserLocation, mockLocations } from '@/constants/UserModel';

// Tipo para el contexto del usuario
type UserContextType = {
  user: User;
  locations: UserLocation[];
  currentLocation: UserLocation;
  updateUser: (userData: Partial<User>) => void;
  addLocation: (location: Omit<UserLocation, 'id'>) => void;
  updateLocation: (locationId: string, locationData: Partial<UserLocation>) => void;
  deleteLocation: (locationId: string) => void;
  setDefaultLocation: (locationId: string) => void;
  setCurrentLocation: (location: UserLocation) => void;
};

// Crear el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Proveedor del contexto
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);
  const [locations, setLocations] = useState<UserLocation[]>(mockLocations);
  const [currentLocation, setCurrentLocation] = useState<UserLocation>(
    mockLocations.find(loc => loc.esPrincipal) || mockLocations[0]
  );

  // Actualizar datos del usuario
  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  // Añadir una nueva ubicación
  const addLocation = (location: Omit<UserLocation, 'id'>) => {
    const newLocation: UserLocation = {
      ...location,
      id: `new-${Date.now()}`, // En una app real, el ID vendría del backend
    };
    
    // Si es la primera ubicación o está marcada como principal
    if (locations.length === 0 || newLocation.esPrincipal) {
      // Actualiza todas las demás para que no sean principales
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
    
    // Si se está actualizando la ubicación actual, o la ubicación se marcó como principal
    const updatedLocation = updatedLocations.find(loc => loc.id === locationId);
    if (updatedLocation && (currentLocation.id === locationId || updatedLocation.esPrincipal)) {
      setCurrentLocation(updatedLocation);
    }
  };

  // Eliminar una ubicación
  const deleteLocation = (locationId: string) => {
    // No permitir eliminar la única ubicación
    if (locations.length <= 1) return;
    
    const locationToDelete = locations.find(loc => loc.id === locationId);
    const updatedLocations = locations.filter(loc => loc.id !== locationId);
    
    // Si la ubicación eliminada era la principal, hacer principal la primera de la lista
    if (locationToDelete?.esPrincipal && updatedLocations.length > 0) {
      updatedLocations[0].esPrincipal = true;
      setCurrentLocation(updatedLocations[0]);
    }
    
    // Si la ubicación eliminada era la actual pero no la principal, mantener la principal
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

  return (
    <UserContext.Provider value={{
      user,
      locations,
      currentLocation,
      updateUser,
      addLocation,
      updateLocation,
      deleteLocation,
      setDefaultLocation,
      setCurrentLocation
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