import React, { createContext, useState, useContext } from 'react';

// Definimos los colores aquí mismo
const themes = {
  light: { background: '#FFFFFF', text: '#000000', drawerBackground: '#F0F0F0',cian: '#0891b2' },
  dark: { background: '#121212', text: '#FFFFFF', drawerBackground: '#1E1E1E', cian:'#67e8f9'}
};

export interface Theme {
  background: string;
  text: string;
  drawerBackground: string;
  divider: string;
  sectionTitle: string;
  cyan: string;
}

export const lightTheme: Theme = {
  background: '#ffffff',
  drawerBackground: '#ffffff',
  text: '#000000',
  divider: '#d0f2ff',
  sectionTitle: '#0891b2',
  cyan: '#0891b2',
};

export const darkTheme: Theme = {
  background: '#121212',
  drawerBackground: '#1e1e1e',
  text: '#ffffff',
  divider: '#333333',
  sectionTitle: '#67e8f9',
  cyan: '#67e8f9',
};

export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: themes.light
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const theme = isDarkMode ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);