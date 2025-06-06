import { Colors } from '@/constants/Colors';
import { LocationData, useLocation } from '@/hooks/useLocation';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface LocationDisplayProps {
  showRefreshButton?: boolean;
  onLocationPress?: (location: LocationData) => void;
  style?: any;
  compact?: boolean;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  showRefreshButton = false,
  onLocationPress,
  style,
  compact = false
}) => {
  const { location, isLoading, error, hasPermission, getCurrentLocation, requestLocationPermission } = useLocation();

  const handleRefresh = async () => {
    try {
      await getCurrentLocation();
    } catch (error) {
      console.error('Error refreshing location:', error);
    }
  };

  const handleLocationPress = () => {
    if (location && onLocationPress) {
      onLocationPress(location);
    }
  };

  const getLocationText = () => {
    if (isLoading) return 'Obteniendo ubicación...';
    if (error) return `Error: ${error}`;
    if (!location) return 'Ubicación no disponible';
    
    if (compact) {
      return location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    }
    
    return location.address || 
           `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`;
  };

  const getLocationIcon = () => {
    if (isLoading) return 'location-outline';
    if (error || !hasPermission) return 'location-outline';
    if (location) return 'location';
    return 'location-outline';
  };

  const getLocationColor = () => {
    if (isLoading) return Colors.light.primary;
    if (error || !hasPermission) return '#FF9800';
    if (location) return '#4CAF50';
    return '#999';
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={[
          styles.locationContainer, 
          compact && styles.compactContainer,
          { borderColor: getLocationColor() + '30' }
        ]}
        onPress={handleLocationPress}
        disabled={!location || !onLocationPress}
      >
        <Ionicons 
          name={getLocationIcon()} 
          size={compact ? 16 : 20} 
          color={getLocationColor()} 
        />
        <View style={styles.textContainer}>
          <ThemedText 
            style={[
              compact ? styles.compactText : styles.locationText,
              { color: getLocationColor() }
            ]}
            numberOfLines={compact ? 1 : 2}
            ellipsizeMode="tail"
          >
            {getLocationText()}
          </ThemedText>
          {location && location.city && !compact && (
            <ThemedText style={styles.cityText}>
              {location.city}
            </ThemedText>
          )}
        </View>
        
        {showRefreshButton && (
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={isLoading}
          >
            <Ionicons 
              name="refresh" 
              size={16} 
              color={isLoading ? '#999' : Colors.light.primary} 
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {!hasPermission && (
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestLocationPermission}
        >
          <Ionicons name="location" size={16} color="white" />
          <ThemedText style={styles.permissionText}>Habilitar Ubicación</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  compactContainer: {
    padding: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  compactText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cityText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  refreshButton: {
    padding: 4,
    marginLeft: 8,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  permissionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default LocationDisplay; 