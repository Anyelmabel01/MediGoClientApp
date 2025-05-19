import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

// Tipo para el contexto de tema
type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  themeColors: typeof Colors.light | typeof Colors.dark;
};

// Crear el contexto con valores por defecto para evitar errores si se usa fuera del provider
const defaultThemeContext: ThemeContextType = {
  isDarkMode: false,
  toggleDarkMode: () => console.warn('ThemeProvider no encontrado'),
  setDarkMode: () => console.warn('ThemeProvider no encontrado'),
  themeColors: Colors.light,
};

// Crear el contexto
const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

// Proveedor del contexto
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Usar el esquema de color del sistema como valor inicial
  const systemColorScheme = useNativeColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemColorScheme === 'dark');

  // Actualizar el tema cuando cambie el esquema de color del sistema
  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  // Obtener los colores basados en el tema actual
  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  // Función para cambiar el modo oscuro
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Función para establecer el modo oscuro explícitamente
  const setDarkMode = (value: boolean) => {
    setIsDarkMode(value);
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      setDarkMode,
      themeColors
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook para acceder al contexto
export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}

// Hook compatible con el hook useColorScheme original
export function useColorScheme() {
  const { isDarkMode } = useTheme();
  return isDarkMode ? 'dark' : 'light';
} 