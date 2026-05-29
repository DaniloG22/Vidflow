import { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from '../utils/theme';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { theme } = useTheme();

  const chatItems = [
    { name: 'index', title: 'Asistente', icon: 'chatbubbles-outline' },
    { name: 'john', title: 'John', icon: 'person-outline' },
    { name: 'laura', title: 'Laura', icon: 'person-outline' },
    { name: 'camila', title: 'Camila', icon: 'person-outline' },
  ];

  const accountItems = [
    { name: 'profile', title: 'Perfil', icon: 'person-circle-outline' },
    { name: 'settings', title: 'Ajustes', icon: 'settings-outline' },
  ];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={[styles.drawerContentScrollView, { backgroundColor: theme.drawerBackground }]}>
      <View style={styles.drawerHeader}>
        <Image source={require('../assets/icono.png')} style={styles.drawerLogo} resizeMode="contain" />
        <View>
          <Text style={[styles.drawerAppName, { color: theme.text }]}>VidFlow</Text>
          <Text style={styles.drawerAppSubtitle}>Conversaciones</Text>
        </View>
      </View>

      <View style={[styles.drawerDivider, { backgroundColor: theme.drawerBackground }]} />

      <Text style={[styles.drawerSectionTitle, { color: theme.background }]}>Chats</Text>
      {chatItems.map((item) => (
        <DrawerItem
          key={item.name}
          label={item.title}
          labelStyle={{ color: theme.text }}
          onPress={() => props.navigation.navigate(item.name as any)}
          icon={({ size }) => <Ionicons name={item.icon as any} size={size} color="#0891b2" />}
          style={styles.drawerItem}
        />
      ))}

      <View style={styles.drawerAccountSection}>
        <View style={[styles.drawerSectionDivider, { backgroundColor: theme.drawerBackground }]} />
        <Text style={[styles.drawerSectionTitle, { color: theme.background }]}>Cuenta</Text>
        {accountItems.map((item) => (
          <DrawerItem
            key={item.name}
            label={item.title}
            labelStyle={{ color: theme.text }}
            onPress={() => props.navigation.navigate(item.name as any)}
            icon={({ size }) => <Ionicons name={item.icon as any} size={size} color="#0891b2" />}
            style={styles.drawerItem}
          />
        ))}
      </View>
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  const { theme } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      // MUEVE TODO AQUÍ ADENTRO:
      screenOptions={{
  headerStyle: { backgroundColor: theme.background },
  headerTintColor: theme.text,
  headerTitleStyle: { color: theme.text },
  drawerStyle: { backgroundColor: theme.drawerBackground, width: 250 },
}}
    >
      <Drawer.Screen name="index" options={{ title: 'Asistente' }} />
      <Drawer.Screen name="john" options={{ title: 'John' }} />
      <Drawer.Screen name="laura" options={{ title: 'Laura' }} />
      <Drawer.Screen name="camila" options={{ title: 'Camila' }} />
      <Drawer.Screen name="profile" options={{ title: 'Perfil' }} />
      <Drawer.Screen name="settings" options={{ title: 'Ajustes' }} />
      <Drawer.Screen name="camera" options={{ title: 'Cámara', drawerItemStyle: { display: 'none' } }} />
    </Drawer>
  );
}

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
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawerNavigator />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  bootContainer: { flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { width: 180, height: 180, marginBottom: 18 },
  bootTitle: { fontSize: 28, fontWeight: '700', color: '#0891b2', marginBottom: 16 },
  loader: { marginTop: 10 },
  drawerContentScrollView: { paddingTop: 12, flexGrow: 1 },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12, gap: 12 },
  drawerLogo: { width: 38, height: 38 },
  drawerAppName: { fontSize: 22, fontWeight: '800' },
  drawerAppSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.8 },
  drawerDivider: { height: 1, marginHorizontal: 16, marginBottom: 8 },
  drawerSectionTitle: { marginHorizontal: 16, marginTop: 6, marginBottom: 4, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  drawerAccountSection: { marginTop: 'auto' },
  drawerSectionDivider: { height: 1, marginHorizontal: 16, marginVertical: 10 },
  drawerItem: { marginHorizontal: 8, borderRadius: 10 },
});