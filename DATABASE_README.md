# Base de Datos MediGo - Supabase

## 📋 Resumen

He creado una base de datos completa para tu aplicación MediGo usando Supabase. La base de datos incluye todas las funcionalidades identificadas en tu app: gestión de usuarios, citas médicas, farmacia, laboratorio, enfermería, expedientes médicos y más.

## 🗂️ Estructura de Tablas

### 👥 Gestión de Usuarios
- **`users`** - Información personal de usuarios
- **`user_locations`** - Direcciones guardadas por usuario (casa, trabajo, etc.)
- **`emergency_contacts`** - Contactos de emergencia
- **`allergies`** - Alergias del paciente
- **`chronic_conditions`** - Condiciones médicas crónicas

### 🏥 Sistema Médico
- **`medical_specialties`** - Especialidades médicas (cardiología, etc.)
- **`doctors`** - Información de doctores
- **`appointments`** - Citas médicas (consultorio y telemedicina)
- **`medical_records`** - Expedientes médicos

### 💊 Sistema de Farmacia
- **`pharmacies`** - Información de farmacias
- **`medicine_categories`** - Categorías de medicamentos
- **`medicines`** - Catálogo de medicamentos
- **`pharmacy_inventory`** - Inventario por farmacia
- **`pharmacy_orders`** - Órdenes de farmacia
- **`pharmacy_order_items`** - Items de cada orden

### 🧪 Sistema de Laboratorio
- **`laboratories`** - Información de laboratorios
- **`lab_tests`** - Catálogo de exámenes
- **`lab_orders`** - Órdenes de laboratorio
- **`lab_order_tests`** - Exámenes por orden

### 👩‍⚕️ Sistema de Enfermería
- **`nursing_services`** - Servicios de enfermería disponibles
- **`nurses`** - Información de enfermeras
- **`nursing_appointments`** - Citas de enfermería a domicilio

### 💳 Sistema de Pagos y Reseñas
- **`payments`** - Registro de pagos
- **`reviews`** - Reseñas y calificaciones
- **`notifications`** - Notificaciones del sistema

## 🔍 Vistas Útiles

### `doctors_complete`
Vista que combina información de doctores con datos del usuario, especialidad y ratings.

### `medicines_pharmacy_inventory`
Vista que muestra medicamentos con su disponibilidad en farmacias.

### `appointments_complete`
Vista completa de citas con información del paciente y doctor.

### `pharmacy_orders_complete`
Vista de órdenes de farmacia con detalles del cliente y farmacia.

### `lab_orders_complete`
Vista de órdenes de laboratorio con información completa.

## 🛠️ Funciones Útiles

### `find_nearby_pharmacies(lat, lng, radius)`
Encuentra farmacias cercanas usando coordenadas geográficas.

```sql
SELECT * FROM find_nearby_pharmacies(8.9673, -79.5314, 10);
```

### `find_available_doctors(specialty, date, telemedicine)`
Busca doctores disponibles por especialidad y tipo de consulta.

```sql
SELECT * FROM find_available_doctors('Cardiología', null, true);
```

### `search_medicines(term, category, pharmacy_id)`
Busca medicamentos por nombre, categoría o farmacia específica.

```sql
SELECT * FROM search_medicines('paracetamol', null, null);
```

### `get_patient_medical_history(patient_id)`
Obtiene el historial médico completo de un paciente.

```sql
SELECT * FROM get_patient_medical_history('uuid-del-paciente');
```

### `calculate_age(birth_date)`
Calcula la edad a partir de la fecha de nacimiento.

```sql
SELECT calculate_age('1988-04-12');
```

## 🔐 Seguridad (RLS)

La base de datos incluye Row Level Security (RLS) habilitado en todas las tablas sensibles:

- **Usuarios**: Solo pueden ver/editar sus propios datos
- **Citas**: Pacientes ven sus citas, doctores ven las suyas
- **Expedientes**: Solo el paciente y sus doctores pueden acceder
- **Órdenes**: Los usuarios solo ven sus propias órdenes
- **Datos médicos**: Protegidos por paciente

## 📊 Datos de Ejemplo

La base de datos incluye datos de ejemplo para:
- ✅ 4 usuarios de prueba
- ✅ 15 especialidades médicas
- ✅ 15 categorías de medicamentos
- ✅ 10 servicios de enfermería
- ✅ 10 exámenes de laboratorio comunes
- ✅ 2 doctores de ejemplo
- ✅ 3 farmacias de ejemplo
- ✅ 3 laboratorios de ejemplo
- ✅ Medicamentos con inventario
- ✅ Datos médicos de ejemplo

## 🚀 Conexión desde tu App

### 1. Instalar Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Configurar Supabase

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = 'https://kavwytklydmgkleejoxn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthdnd5dGtseWRtZ2tsZWVqb3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTY2MzUsImV4cCI6MjA2NDE5MjYzNX0.VzkW0w7pDDefwuQspdrqzyTgAdjX8wHNjMsIveJjYzM'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

### 3. Ejemplos de Uso

#### Obtener especialidades médicas
```typescript
const { data: specialties } = await supabase
  .from('medical_specialties')
  .select('*')
  .eq('is_active', true)
```

#### Buscar doctores disponibles
```typescript
const { data: doctors } = await supabase
  .rpc('find_available_doctors', {
    specialty_name: 'Cardiología',
    is_telemedicine: true
  })
```

#### Buscar farmacias cercanas
```typescript
const { data: pharmacies } = await supabase
  .rpc('find_nearby_pharmacies', {
    user_lat: 8.9673,
    user_lng: -79.5314,
    radius_km: 10
  })
```

#### Crear una cita médica
```typescript
const { data, error } = await supabase
  .from('appointments')
  .insert({
    patient_id: userId,
    doctor_id: doctorId,
    appointment_date: '2024-06-15 10:00:00',
    appointment_type: 'telemedicina',
    motivo_consulta: 'Consulta de rutina'
  })
```

#### Obtener medicamentos con inventario
```typescript
const { data: medicines } = await supabase
  .from('medicines_pharmacy_inventory')
  .select('*')
  .eq('disponible', true)
  .ilike('nombre', '%paracetamol%')
```

#### Crear orden de farmacia
```typescript
const { data: order } = await supabase
  .from('pharmacy_orders')
  .insert({
    user_id: userId,
    pharmacy_id: pharmacyId,
    tipo_entrega: 'domicilio',
    subtotal: 25.50,
    total: 30.50,
    costo_envio: 5.00
  })
  .select()
  .single()
```

## 📱 Integración con React Native

### Hook personalizado para usuarios
```typescript
// hooks/useUser.ts
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '../types/supabase'

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar datos del usuario autenticado
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()
        setUser(data)
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  return { user, loading, setUser }
}
```

### Hook para citas médicas
```typescript
// hooks/useAppointments.ts
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useAppointments = (userId: string) => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAppointments = async () => {
      const { data } = await supabase
        .from('appointments_complete')
        .select('*')
        .eq('patient_id', userId)
        .order('appointment_date', { ascending: true })
      
      setAppointments(data || [])
      setLoading(false)
    }

    if (userId) {
      loadAppointments()
    }
  }, [userId])

  return { appointments, loading }
}
```

## 🔄 Actualizaciones en Tiempo Real

```typescript
// Escuchar cambios en citas
useEffect(() => {
  const subscription = supabase
    .channel('appointments')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'appointments',
        filter: `patient_id=eq.${userId}`
      },
      (payload) => {
        console.log('Cambio en cita:', payload)
        // Actualizar estado local
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}, [userId])
```

## 🧪 Pruebas

La base de datos está lista para usar. Puedes probar las funciones directamente desde el dashboard de Supabase o usando el cliente en tu aplicación.

### Datos de prueba disponibles:
- **Usuario**: jose.daniel@ejemplo.com
- **Doctores**: 2 doctores registrados
- **Farmacias**: 3 farmacias con inventario
- **Servicios**: Todos los servicios de enfermería y laboratorio

## 🆘 Soporte

Si necesitas modificaciones o tienes preguntas sobre la estructura, puedes:
1. Ver los logs en el dashboard de Supabase
2. Usar el SQL Editor para consultas directas
3. Revisar la documentación de tipos TypeScript generada

¡Tu base de datos MediGo está lista para usar! 🚀
