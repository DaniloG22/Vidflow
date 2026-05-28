import { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isBooting) {
    return (
      <View style={styles.bootContainer}>
        <Image source={require('../assets/logo-inicial.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.bootTitle}>VidFlow</Text>
        <ActivityIndicator size="large" color="#0891b2" style={styles.loader} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: { backgroundColor: '#ffffff', width: 250 },
          headerTintColor: '#0891b2',
        }}
      >
        <Drawer.Screen name="index" options={{ title: 'Asistente', drawerIcon: () => <Ionicons name="chatbubbles-outline" size={22} color="#0891b2" /> }} />
        <Drawer.Screen name="john" options={{ title: 'John', drawerIcon: () => <Ionicons name="person-outline" size={22} color="#0891b2" /> }} />
        <Drawer.Screen name="laura" options={{ title: 'Laura', drawerIcon: () => <Ionicons name="person-outline" size={22} color="#0891b2" /> }} />
        <Drawer.Screen name="camila" options={{ title: 'Camila', drawerIcon: () => <Ionicons name="person-outline" size={22} color="#0891b2" /> }} />
        <Drawer.Screen name="camera" options={{ title: 'Cámara', drawerItemStyle: { display: 'none' } }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  bootContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 18,
  },
  bootTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0891b2',
    marginBottom: 16,
  },
  loader: {
    marginTop: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 12,
  },
  drawerLogo: {
    width: 36,
    height: 36,
  },
  drawerAppName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0891b2',
  },
  drawerHeaderSpacer: {
    height: 12,
  },
});