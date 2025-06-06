export interface DirectionsResponse {
  routes: {
    geometry: {
      coordinates: [number, number][];
    };
    duration: number; // en segundos
    distance: number; // en metros
  }[];
}

export interface RouteInfo {
  coordinates: [number, number][];
  duration: number; // en minutos
  distance: number; // en metros
}

const MAPBOX_API_KEY = "pk.eyJ1Ijoia2V2aW5uMjMiLCJhIjoiY204Y2J0bWN1MTg5ZzJtb2xobXljODM0MiJ9.48MFADtQhp_sFuQjewLFeA";

/**
 * Obtiene la ruta entre dos puntos usando Mapbox Directions API
 */
export async function getRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  profile: 'driving-traffic' | 'driving' | 'walking' = 'driving-traffic'
): Promise<RouteInfo | null> {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&overview=full&steps=true&access_token=${MAPBOX_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Error en la respuesta de Mapbox:', response.status, response.statusText);
      return null;
    }
    
    const data: DirectionsResponse = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      console.error('No se encontraron rutas');
      return null;
    }
    
    const route = data.routes[0];
    
    return {
      coordinates: route.geometry.coordinates,
      duration: Math.round(route.duration / 60), // convertir a minutos
      distance: Math.round(route.distance) // mantener en metros
    };
  } catch (error) {
    console.error('Error obteniendo la ruta:', error);
    return null;
  }
}

/**
 * Calcula la distancia entre dos puntos en metros usando la fórmula de Haversine
 */
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 1000); // Convertir a metros
}

/**
 * Calcula el progreso real del paramédico a lo largo de la ruta
 * basado en su posición actual
 */
export function calculateRouteProgress(
  currentPosition: { lat: number; lng: number },
  route: [number, number][]
): number {
  if (!route || route.length === 0) {
    return 0;
  }
  
  let closestIndex = 0;
  let minDistance = Infinity;
  
  // Encontrar el punto más cercano en la ruta
  route.forEach((point, index) => {
    const distance = calculateDistance(
      currentPosition.lat,
      currentPosition.lng,
      point[1], // lat
      point[0]  // lng
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });
  
  // Calcular el progreso como porcentaje del total de puntos
  const progress = closestIndex / (route.length - 1);
  return Math.min(Math.max(progress, 0), 1); // Asegurar que esté entre 0 y 1
}

/**
 * Simula el movimiento gradual del paramédico siguiendo la ruta
 * con velocidad más realista
 */
export function calculateNextPosition(
  currentPosition: { lat: number; lng: number },
  route: [number, number][],
  progress: number // valor entre 0 y 1
): { lat: number; lng: number } {
  if (!route || route.length === 0) {
    return currentPosition;
  }
  
  // Calcular el índice en la ruta basado en el progreso
  const totalPoints = route.length;
  const targetIndex = Math.min(Math.floor(progress * (totalPoints - 1)), totalPoints - 1);
  
  if (targetIndex === 0) {
    return { lat: route[0][1], lng: route[0][0] };
  }
  
  if (targetIndex >= totalPoints - 1) {
    return { lat: route[totalPoints - 1][1], lng: route[totalPoints - 1][0] };
  }
  
  // Interpolación entre dos puntos consecutivos para movimiento suave
  const point1 = route[targetIndex];
  const point2 = route[targetIndex + 1];
  
  const localProgress = (progress * (totalPoints - 1)) - targetIndex;
  
  const lat = point1[1] + (point2[1] - point1[1]) * localProgress;
  const lng = point1[0] + (point2[0] - point1[0]) * localProgress;
  
  return { lat, lng };
}

/**
 * Obtiene el centro y zoom óptimo para mostrar ambos puntos y la ruta
 */
export function getOptimalMapView(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number },
  route?: [number, number][]
): { center: { lat: number; lng: number }; zoom: number } {
  let minLat = Math.min(point1.lat, point2.lat);
  let maxLat = Math.max(point1.lat, point2.lat);
  let minLng = Math.min(point1.lng, point2.lng);
  let maxLng = Math.max(point1.lng, point2.lng);
  
  // Si hay una ruta, expandir los límites para incluir todos los puntos
  if (route && route.length > 0) {
    route.forEach(([lng, lat]) => {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });
  }
  
  // Calcular el centro
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  
  // Calcular un zoom apropiado basado en la distancia
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const maxDiff = Math.max(latDiff, lngDiff);
  
  let zoom = 15; // zoom por defecto
  if (maxDiff > 0.1) zoom = 10;
  else if (maxDiff > 0.05) zoom = 12;
  else if (maxDiff > 0.02) zoom = 13;
  else if (maxDiff > 0.01) zoom = 14;
  
  return {
    center: { lat: centerLat, lng: centerLng },
    zoom
  };
} 