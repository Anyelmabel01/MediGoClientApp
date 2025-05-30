import type { Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, userData: {
    nombre: string;
    apellido: string;
    telefono?: string;
  }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: 'Not implemented' }),
  signUp: async () => ({ error: 'Not implemented' }),
  signOut: async () => {},
  updateProfile: async () => ({ error: 'Not implemented' }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        await loadUserData(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // User profile not found, wait a moment and retry (trigger might be processing)
            console.log(`User profile not found, retry ${retryCount + 1}/${maxRetries}`);
            if (retryCount < maxRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
              retryCount++;
              continue;
            } else {
              console.warn('User profile not found after retries, but user is authenticated');
              // Set loading to false even if no profile found - user is authenticated
              setIsLoading(false);
              return;
            }
          } else {
            console.error('Error loading user data:', error);
            setIsLoading(false);
            return;
          }
        } else if (userData) {
          console.log('User profile loaded successfully:', userData.nombre);
          setUser(userData);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      // La navegación se maneja automáticamente por el listener
      return {};
    } catch (error) {
      return { error: 'Error inesperado al iniciar sesión' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: { nombre: string; apellido: string; telefono?: string }
  ) => {
    try {
      setIsLoading(true);
      
      // Create account in Supabase Auth with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre: userData.nombre,
            apellido: userData.apellido,
            telefono: userData.telefono || null,
          }
        }
      });

      if (authError) {
        return { error: authError.message };
      }

      // The user profile is now created automatically via database trigger
      // No need to manually insert into users table
      console.log('User signup successful. Profile will be created automatically.');

      return {};
    } catch (error) {
      console.error('Unexpected error in signUp:', error);
      return { error: 'Error inesperado al registrarse' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: 'No hay usuario autenticado' };

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { error: error.message };
      }

      // Actualizar estado local
      setUser({ ...user, ...updates });
      return {};
    } catch (error) {
      return { error: 'Error al actualizar perfil' };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}