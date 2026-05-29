import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useTheme } from '../utils/theme'; // 🌟 Importamos nuestro hook de tema global
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { theme, isDarkMode } = useTheme(); // 🌟 Consumimos el estado del tema

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Sección de la Tarjeta de Perfil */}
      <View style={[styles.profileCard, { backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc' }]}>
        <View style={styles.avatarContainer}>
          {/* Imagen de perfil de usuario */}
          <Image 
            source={require('../assets/icono.png')} // Puedes cambiarlo por tu avatar predeterminado
            style={[styles.avatar, { borderColor: theme.accentCyan }]} 
          />
          <View style={[styles.editBadge, { backgroundColor: theme.accentCyan }]}>
            <Ionicons name="camera" size={16} color="#ffffff" />
          </View>
        </View>

        <Text style={[styles.userName, { color: theme.text }]}>Danilo G.</Text>
        <Text style={[styles.userRole, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>Usuario VidFlow</Text>
      </View>

      {/* Sección de Información de Detalles */}
      <View style={styles.infoSection}>
        <Text style={[styles.sectionTitle, { color: theme.accentCyan }]}>Información de la Cuenta</Text>
        
        {/* Fila: Correo */}
        <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
          <Ionicons name="mail-outline" size={20} color={theme.accentCyan} style={styles.infoIcon} />
          <View>
            <Text style={[styles.infoLabel, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>Correo Electrónico</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>danilo@ejemplo.com</Text>
          </View>
        </View>

        {/* Fila: Estado */}
        <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
          <Ionicons name="checkmark-circle-outline" size={20} color={theme.accentCyan} style={styles.infoIcon} />
          <View>
            <Text style={[styles.infoLabel, { color: isDarkMode ? '#94a3b8' : '#64748b' }]}>Estado de Cuenta</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>Activo</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    gap: 24,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    padding: 6,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoIcon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});