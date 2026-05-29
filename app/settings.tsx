 import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../utils/theme'; // 🌟 Consumimos nuestro hook de tema
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  // Extraemos el estado actual, el objeto de colores y la función de intercambio
  const { isDarkMode, theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Ajustes</Text>
      
      <View style={[styles.sectionDivider, { backgroundColor: theme.border }]} />

      {/* Opción de Modo Oscuro */}
      <View style={[styles.settingRow, { backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc' }]}>
        <View style={styles.settingLeft}>
          {/* 🌟 El icono cambia al color cian automáticamente */}
          <Ionicons 
            name={isDarkMode ? "moon" : "moon-outline"} 
            size={24} 
            color={theme.accentCyan} 
          />
          <Text style={[styles.settingText, { color: theme.text }]}>Modo Oscuro</Text>
        </View>
        
        {/* Interruptor que activa/desactiva el modo oscuro */}
        <Switch
          trackColor={{ false: '#cbd5e1', true: '#06b6d4' }}
          thumbColor={isDarkMode ? '#0891b2' : '#f4f3f4'}
          ios_backgroundColor="#cbd5e1"
          onValueChange={toggleTheme}
          value={isDarkMode}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 12,
  },
  sectionDivider: {
    height: 1,
    marginVertical: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});