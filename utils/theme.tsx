import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Definimos la estructura que tendrá nuestro tema
interface ThemeColors {
  background: string;
  text: string;
  drawerBackground: string;
  accentCyan: string; // 🌟 El cian corporativo para los iconos y detalles
  border: string;
}

// 2. Configuramos los colores para cada modo
const lightTheme: ThemeColors = {
  background: '#ffffff',
  text: '#0f172a',
  drawerBackground: '#ffffff',
  accentCyan: '#0891b2', // Cian en modo claro
  border: '#e2e8f0',
};

const darkTheme: ThemeColors = {
  background: '#0f172a',    // Fondo oscuro (azul pizarra profundo)
  text: '#f8fafc',          // Texto blanco/claro
  drawerBackground: '#1e293b', // Fondo del menú lateral oscuro
  accentCyan: '#0891b2',    // 🌟 Mantiene el MISMO cian para los iconos en modo oscuro
  border: '#334155',
};

// 3. Creamos el contexto
interface ThemeContextType {
  isDarkMode: boolean;
  theme: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para usar el tema de forma sencilla
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
