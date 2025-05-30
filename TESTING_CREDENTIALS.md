# 🔐 Credenciales de MediGo

## Supabase Configuration

Las credenciales de Supabase están configuradas de manera segura usando variables de entorno.

### ⚙️ Configuración Actual

**URL del Proyecto:** `https://kavwytklydmgkleejoxn.supabase.co`

**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthdnd5dGtseWRtZ2tsZWVqb3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTY2MzUsImV4cCI6MjA2NDE5MjYzNX0.VzkW0w7pDDefwuQspdrqzyTgAdjX8wHNjMsIveJjYzM`

### 🔒 Seguridad

- ✅ **Estas son claves PÚBLICAS** - seguras para usar en aplicaciones cliente
- ✅ **Row Level Security (RLS)** está configurado en la base de datos
- ✅ **Configuradas en `app.config.js`** con fallback values
- ✅ **Pueden ser sobrescritas** con variables de entorno

### 📝 Variables de Entorno (Opcional)

Para desarrollo local, puedes crear un archivo `.env` con:

```env
EXPO_PUBLIC_SUPABASE_URL=https://kavwytklydmgkleejoxn.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthdnd5dGtseWRtZ2tsZWVqb3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTY2MzUsImV4cCI6MjA2NDE5MjYzNX0.VzkW0w7pDDefwuQspdrqzyTgAdjX8wHNjMsIveJjYzM
```

### 🚀 Estado Actual

- ✅ **Configuración:** Completada y funcional
- ✅ **Seguridad:** Implementada correctamente
- ✅ **Flexibilidad:** Soporta variables de entorno
- ✅ **Fallback:** Valores por defecto configurados

**¡No necesitas hacer nada adicional!** Las credenciales ya están configuradas y funcionando. 