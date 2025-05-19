import React from 'react';
import { useRouter, useSegments } from 'expo-router';

// Crear un objeto global para almacenar el estado de autenticación
const authState = {
  isAuthenticated: false,
};

// Crear contexto con funciones para acceder y modificar el estado de autenticación
type AuthContextType = {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
};

const AuthContext = React.createContext<AuthContextType>({
  get isAuthenticated() { return authState.isAuthenticated; },
  signIn: () => {},
  signOut: () => {},
});

// Proveedor del contexto que contiene la lógica de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Funciones para autenticación
  const signIn = (email: string, password: string) => {
    // Aquí iría la lógica real de autenticación
    // Por ahora solo simulamos un login exitoso
    authState.isAuthenticated = true;
    // Redirigir a la pantalla principal después de iniciar sesión
    router.replace('/');
  };

  const signOut = () => {
    authState.isAuthenticated = false;
    router.replace('/login');
  };

  const value = {
    get isAuthenticated() { return authState.isAuthenticated; },
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para acceder al contexto
export function useAuth() {
  return React.useContext(AuthContext);
}