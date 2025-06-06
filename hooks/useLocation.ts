import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
  timestamp: number;
}

export interface LocationState {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
}

export const useLocation = (watchPosition = false) => {
  const [state, setState] = useState<LocationState>({
    location: null,
    isLoading: true,
    error: null,
    hasPermission: false,
  });

  // Solicitar permisos de ubicación
  const requestLocationPermission = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Verificar si los permisos ya están otorgados
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      let finalStatus = existingStatus;

      // Si no están otorgados, solicitarlos
      if (existingStatus !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Permisos de ubicación denegados',
          hasPermission: false,
        }));
        
        Alert.alert(
          'Permisos de Ubicación Requeridos',
          'Para usar las funciones de emergencia necesitamos acceso a tu ubicación. Por favor, habilita los permisos en la configuración.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir Configuración', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        return false;
      }

      setState(prev => ({ ...prev, hasPermission: true }));
      return true;
    } catch (error) {
      console.error('Error solicitando permisos de ubicación:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al solicitar permisos de ubicación',
        hasPermission: false,
      }));
      return false;
    }
  }, []);

  // Obtener ubicación actual
  const getCurrentLocation = useCallback(async (includeAddress = true): Promise<LocationData | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return null;

      // Obtener la ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      };

      // Obtener dirección si se solicita
      if (includeAddress) {
        try {
          const [address] = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          if (address) {
            locationData.address = `${address.street || ''} ${address.streetNumber || ''}`.trim();
            locationData.city = address.city || address.district || '';
            locationData.country = address.country || '';
          }
        } catch (addressError) {
          console.warn('Error obteniendo dirección:', addressError);
          // No es crítico, continuar sin dirección
        }
      }

      setState(prev => ({
        ...prev,
        location: locationData,
        isLoading: false,
        error: null,
      }));

      return locationData;
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al obtener ubicación actual',
      }));
      return null;
    }
  }, [requestLocationPermission]);

  // Configurar seguimiento de ubicación si se solicita
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      if (!watchPosition) return;

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      try {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Actualizar cada 5 segundos
            distanceInterval: 10, // O cuando se mueva 10 metros
          },
          (location) => {
            const locationData: LocationData = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: location.timestamp,
            };

            setState(prev => ({
              ...prev,
              location: locationData,
              isLoading: false,
              error: null,
            }));
          }
        );
      } catch (error) {
        console.error('Error iniciando seguimiento de ubicación:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Error al iniciar seguimiento de ubicación',
        }));
      }
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [watchPosition, requestLocationPermission]);

  // Obtener ubicación inicial al montar el componente
  useEffect(() => {
    if (!watchPosition) {
      getCurrentLocation();
    }
  }, [getCurrentLocation, watchPosition]);

  return {
    ...state,
    getCurrentLocation,
    requestLocationPermission,
    refreshLocation: () => getCurrentLocation(),
  };
}; 