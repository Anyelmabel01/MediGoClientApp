# Módulo de Emergencia - MediGo App

## 📋 Descripción General

El módulo de emergencia permite a los usuarios solicitar servicios médicos de emergencia con seguimiento en tiempo real. Incluye funcionalidades de geolocalización, mapas interactivos y tracking del paramédico.

## 🗺️ Flujo de Navegación

### 1. Selección de Tipo de Emergencia
- **Emergencia Médica** (`medica.tsx`): Para situaciones médicas generales
- **Accidente** (`accidente.tsx`): Para accidentes con heridas o lesiones  
- **Traslado** (`traslado.tsx`): Para traslados médicos programados

### 2. Información del Paciente (`paciente.tsx`)
- Selección "Para mí" o "Para otra persona"
- Datos del paciente (nombre, edad)
- Tipo de sangre (opcional)
- Condiciones médicas conocidas
- Alergias y medicamentos

### 3. Detalles de la Emergencia
- Descripción específica según el tipo
- Nivel de severidad/urgencia
- Información adicional relevante

### 4. Selección de Ubicación (`ubicacion.tsx`) 🆕
**Nuevas funcionalidades implementadas:**
- **Ubicación actual**: Usa GPS del dispositivo
- **Direcciones guardadas**: Direcciones previamente almacenadas
- **Selección en mapa**: Mapa interactivo con Mapbox
- **Nueva dirección**: Ingreso manual con detalles

#### Mapa Interactivo:
- Implementado con Mapbox GL JS a través de WebView
- Permite seleccionar ubicación tocando en el mapa
- Muestra ubicación actual del usuario
- Marcadores visuales para diferentes ubicaciones

### 5. Información de Contacto (`contacto.tsx`)
- Usar información personal
- Ingresar contacto diferente
- Relación con el paciente

### 6. Confirmación (`confirmacion.tsx`)
- Resumen completo de la solicitud
- Información del proveedor
- Cálculo de costos
- Selección de método de pago

### 7. Seguimiento en Tiempo Real (`seguimiento.tsx`) 🆕
**Nuevas funcionalidades implementadas:**

#### Estados de la Emergencia:
- **PAID**: Pago confirmado, buscando paramédico
- **ACCEPTED**: Paramédico asignado
- **IN_PROGRESS**: Paramédico en camino
- **ARRIVING**: Llegando (menos de 3 minutos)

#### Mapa de Tracking:
- **Mapa en tiempo real** con ubicaciones de paciente y paramédico
- **Marcadores diferenciados**: 
  - 🔴 Rojo: Ubicación del paciente (fija)
  - 🟢 Verde: Paramédico en movimiento
- **Actualización automática** cada 3 segundos (simulación)
- **Cálculo de distancia** en tiempo real
- **Leyenda** para identificar marcadores

### 8. Servicio Completado (`completado.tsx`)
- Resumen del servicio
- Detalles de pago
- Sistema de calificación
- Descarga de recibo

### 9. Historial (`historial.tsx`)
- Lista de emergencias anteriores
- Filtros por estado
- Detalles de cada servicio

## 🗺️ Implementación de Mapas

### Componente MapboxMap (`components/MapboxMap.tsx`)

**Características:**
- Integración con Mapbox GL JS v2.15.0
- Renderizado via WebView para máximo rendimiento
- Soporte para múltiples marcadores
- Geolocalización automática
- Eventos de interacción (tocar para seleccionar)
- Manejo de errores y estados de carga

**Props principales:**
```typescript
interface MapboxMapProps {
  latitude?: number;           // Latitud inicial
  longitude?: number;          // Longitud inicial
  zoom?: number;              // Nivel de zoom inicial
  onLocationSelect?: (lat: number, lng: number) => void;  // Callback selección
  markers?: Array<{           // Marcadores a mostrar
    id: string;
    latitude: number;
    longitude: number;
    color?: string;
    title?: string;
  }>;
  showCurrentLocation?: boolean;  // Mostrar ubicación actual
  interactive?: boolean;          // Permitir interacción
  style?: any;                   // Estilos personalizados
}
```

### API Key de Mapbox
```typescript
const MAPBOX_API_KEY = "pk.eyJ1Ijoia2V2aW5uMjMiLCJhIjoiY204Y2J0bWN1MTg5ZzJtb2xobXljODM0MiJ9.48MFADtQhp_sFuQjewLFeA";
```

## 📱 Dependencias Requeridas

```json
{
  "expo-location": "^16.x.x",    // Geolocalización
  "react-native-webview": "^13.x.x"  // WebView para mapas
}
```

## 🚀 Uso del Componente MapboxMap

### Ejemplo 1: Selección de Ubicación
```typescript
<MapboxMap
  latitude={8.9824}
  longitude={-79.5199}
  zoom={15}
  onLocationSelect={(lat, lng) => {
    console.log('Ubicación seleccionada:', lat, lng);
  }}
  showCurrentLocation={true}
  interactive={true}
/>
```

### Ejemplo 2: Tracking en Tiempo Real
```typescript
<MapboxMap
  latitude={(pacienteLat + paramedicoLat) / 2}
  longitude={(pacienteLng + paramedicoLng) / 2}
  zoom={14}
  markers={[
    {
      id: 'paciente',
      latitude: pacienteLat,
      longitude: pacienteLng,
      color: '#FF0000',
      title: 'Ubicación del Paciente'
    },
    {
      id: 'paramedico',
      latitude: paramedicoLat,
      longitude: paramedicoLng,
      color: '#00FF00',
      title: 'Paramédico en Camino'
    }
  ]}
  showCurrentLocation={false}
  interactive={true}
/>
```

## 🔧 Funcionalidades Técnicas

### Geolocalización
- Solicitud automática de permisos
- Obtención de ubicación con alta precisión
- Manejo de errores (permisos denegados, GPS desactivado)

### Comunicación WebView-React Native
- Mensajes bidireccionales entre WebView y React Native
- Manejo de eventos del mapa (clic, carga, error)
- Actualización dinámica de marcadores

### Simulación de Tracking
- Movimiento automático del paramédico hacia el paciente
- Cálculo de distancia usando fórmula Haversine
- Actualización de estados cada 5 segundos
- Interpolación suave de posiciones

## 🐛 Manejo de Errores

### Estados de Error Comunes:
1. **Error de conexión**: Sin internet para cargar Mapbox
2. **Error de permisos**: GPS no autorizado
3. **Error de API**: API key inválida o límite excedido
4. **Error de comunicación**: Fallo en WebView messaging

### Recuperación:
- Mensajes de error descriptivos
- Botones de reintento
- Fallbacks a ubicación manual

## 📊 Métricas y Seguimiento

### Datos Simulados:
- Tiempo estimado de llegada
- Distancia en metros
- Estados de progreso
- Información del paramédico

### Datos Reales (para implementar):
- API de tracking GPS real
- WebSockets para actualizaciones en vivo
- Base de datos de paramédicos
- Sistema de notificaciones push

## 🔮 Próximas Mejoras

1. **Rutas optimizadas**: Mostrar ruta desde paramédico hasta paciente
2. **Notificaciones push**: Actualizaciones en background
3. **Modo offline**: Mapas descargados para zonas sin conexión
4. **Múltiples paramédicos**: Mostrar opciones disponibles
5. **Chat en vivo**: Comunicación directa con paramédico
6. **Historial de ubicaciones**: Guardar direcciones frecuentes

---

*Desarrollado para MediGo App - Servicios Médicos de Emergencia* 