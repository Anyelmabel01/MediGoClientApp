# Configuración de Supabase para MediGo

## Configuración de Políticas RLS (Row Level Security)

Para solucionar el error de RLS en la tabla `users`, ejecuta el siguiente SQL en el editor SQL de Supabase:

### 1. Configurar la tabla users

```sql
-- Crear la tabla users si no existe
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    telefono TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Crear nuevas políticas
CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Otorgar permisos
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO anon, authenticated;
```

### 2. Crear función para updated_at automático

```sql
-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para la tabla users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Solución Alternativa

Si los errores de RLS persisten, la aplicación ahora incluye un mecanismo de respaldo que:

1. Guarda los datos del usuario en los metadatos de autenticación
2. Intenta crear el perfil en la tabla `users` 
3. Si falla por RLS, continúa con el registro usando los metadatos
4. Crea el perfil automáticamente en el primer inicio de sesión

## Variables de Entorno

Asegúrate de que tu archivo `app.config.js` tenga las variables correctas:

```javascript
export default {
  // ... otras configuraciones
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
};
```

Y tu archivo `.env` local:

```
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

## Verificación

Para verificar que todo funciona correctamente:

1. Ejecuta el SQL de configuración en Supabase
2. Reinicia el servidor de desarrollo: `npx expo start --clear`
3. Intenta registrar un nuevo usuario
4. Verifica que el usuario aparece en la tabla `users` en Supabase

## Troubleshooting

- **Error 42501**: Significa que RLS está bloqueando la operación. Ejecuta el SQL de configuración.
- **Usuario registrado pero no aparece en tabla**: Los datos están en auth.users.user_metadata y se crearán en la tabla al siguiente login.
- **Error de sesión**: Asegúrate de que las claves de Supabase sean correctas y la URL esté bien configurada. 