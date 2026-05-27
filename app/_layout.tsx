import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{
        drawerStyle: { backgroundColor: '#fff', width: 250 },
        headerTintColor: '#128C7E',
      }}>
        <Drawer.Screen name="index" options={{ title: 'Chatbot IA', drawerIcon: () => <Ionicons name="chatbubbles-outline" size={22} color="#128C7E" /> }} />
        <Drawer.Screen name="profile" options={{ title: 'Mi Perfil', drawerIcon: () => <Ionicons name="person-outline" size={22} color="#128C7E" /> }} />
        <Drawer.Screen name="camera" options={{ title: 'Cámara', drawerItemStyle: { display: 'none' } }} /> 
      </Drawer>
    </GestureHandlerRootView>
  );
}