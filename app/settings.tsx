    import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={28} color="#0891b2" />
        <Text style={styles.title}>Ajustes</Text>
      </View>
      <Text style={styles.subtitle}>Espacio de ajustes disponible.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#0891b2' },
  subtitle: { fontSize: 16, color: '#065f73' },
});
