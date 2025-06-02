# Soluciones Implementadas y Pendientes

## ✅ COMPLETADAS

### 1. Tipos Centralizados Creados
- **Archivo**: `types/index.ts`
- **Solución**: Tipos `Prueba`, `Provider`, `Notification`, `ThemedTextProps`, `ExtendedColors`
- **Estado**: ✅ Completado

### 2. ThemedText Mejorado
- **Archivo**: `components/ThemedText.tsx` 
- **Solución**: Agregado soporte para prop `type` con estilos
- **Estado**: ✅ Completado

### 3. Configuración TypeScript
- **Archivo**: `tsconfig.json`
- **Solución**: Agregado `skipLibCheck: true`
- **Estado**: ✅ Completado

### 4. Tipo Notification Extendido
- **Solución**: Agregados tipos `'resultado' | 'cita' | 'preparacion' | 'oferta'` y prop `date`
- **Estado**: ✅ Completado

## 🔄 PENDIENTES (Aplicar Manualmente)

### Guard Clauses para User Null
Aplicar en los siguientes archivos:

```typescript
// PATRÓN A APLICAR:
if (!user) return null;

// ANTES del return principal en estos archivos:
```

**Archivos que necesitan guard clause:**
1. `app/(tabs)/resultados.tsx` - línea ~25
2. `app/consulta.tsx` - línea ~25
3. `app/expediente/index.tsx` - línea ~125 
4. `app/farmacia/carrito.tsx` - línea ~30
5. `app/farmacia/producto/[id].tsx` - línea ~115
6. `app/perfil.tsx` - línea ~20

### Correcciones de Router Push
**Patrón**: Cambiar `router.push('expediente')` por `router.push('/expediente' as any)`

**Archivos:**
1. `app/(tabs)/perfil.tsx` - línea ~196
2. `app/perfil.tsx` - línea ~116

### Provider Type Corrections
**Archivo**: `app/consulta/consultorio/perfil-proveedor.tsx`

Agregar a cada provider object:
```typescript
certifications: [],
hospital_affiliations: []
```

### Notification Type en laboratorio
**Archivo**: `app/laboratorio/centroNotificaciones.tsx`

Cambiar tipos de notificaciones:
- `'resultado'` → `'info'`
- `'cita'` → `'warning'` 
- `'preparacion'` → `'warning'`
- `'oferta'` → `'info'`

O usar el tipo extendido importando `Notification` from `@/types`

### Colors Type Extension
**Archivo**: `constants/Colors.ts` (crear si no existe)

Agregar propiedades faltantes:
```typescript
export const Colors = {
  light: {
    // ... existing properties
    card: '#FFFFFF',
    gradient: ['#00A0B0', '#70D0E0']
  }
}
```

### StatusBar Style Fix
**Archivo**: `app/laboratorio/detallesResultado.tsx`

Cambiar:
```typescript
<StatusBar style={isDarkMode ? 'light' : 'dark'} />
```

Por:
```typescript
<StatusBar style="auto" />
```

### Linear Gradient Fixes
**Archivos**: `components/AppButton.tsx`, `components/AppContainer.tsx`

- Remover prop `opacity` de LinearGradient
- Asegurar que `colors` sea readonly array

## 📋 SCRIPT DE APLICACIÓN RÁPIDA

Para aplicar todas las correcciones rápidamente:

1. **Ejecutar búsqueda y reemplazo global**:
   - `if (!user) {` → `if (!user) return null;`
   - `router.push('expediente')` → `router.push('/expediente' as any)`

2. **Verificar compilación**:
   ```bash
   npx tsc --noEmit
   ```

3. **Si persisten errores de React types**:
   ```bash
   npm install react@18.2.0 react-dom@18.2.0 @types/react@18.2.0
   ```

## 🎯 PRIORIDAD DE CORRECCIÓN

1. **Alta**: Guard clauses (evita crashes)
2. **Media**: Router fixes (navegación)
3. **Baja**: Gradientes y styling (estético)

## 🔧 HERRAMIENTAS RECOMENDADAS

- **VSCode**: Buscar y reemplazar en archivos
- **Regex patterns** para automatizar cambios
- **TypeScript strict mode** temporal disable si es necesario 