# Configuración del Bucket de Storage para Avatares

## Paso 1: Crear el bucket en Supabase Dashboard

1. Ve a tu proyecto de Supabase: https://app.supabase.com
2. Ve a Storage en el menú lateral
3. Crea un nuevo bucket llamado `user-avatars`
4. Configúralo como **público** para que las imágenes sean accesibles

## Paso 2: Configurar las políticas de seguridad

Ejecuta estos SQL scripts en el SQL Editor de Supabase:

```sql
-- Política para permitir que los usuarios suban sus propios avatares
CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'user-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Política para permitir que los usuarios actualicen sus propios avatares
CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'user-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Política para permitir que los usuarios vean todos los avatares (públicos)
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'user-avatars');

-- Política para permitir que los usuarios eliminen sus propios avatares
CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'user-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
```

## Paso 3: Verificar configuración

Una vez configurado, las imágenes se subirán a rutas como:
- `user-avatars/avatars/[user_id]_[timestamp].jpg`

Y serán accesibles públicamente via:
- `https://[project-id].supabase.co/storage/v1/object/public/user-avatars/avatars/[filename]`

## Permisos necesarios en la app

Ya están configurados en `app.json`:
- `android.permission.CAMERA`
- `android.permission.READ_EXTERNAL_STORAGE` 
- `android.permission.WRITE_EXTERNAL_STORAGE`
- `NSCameraUsageDescription` en iOS 