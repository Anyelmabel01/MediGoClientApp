import { Stack } from 'expo-router';

export default function ExpedienteLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="editar-info-medica" />
      <Stack.Screen name="recetas" />
      <Stack.Screen name="archivos" />
    </Stack>
  );
} 