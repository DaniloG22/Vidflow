import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from '../utils/theme';

// 1. Menú lateral personalizado
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { theme } = useTheme();
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: theme.drawerBackground }}>
      <DrawerItem
        label="Asistente"
        labelStyle={{ color: theme.text }}
        onPress={() => props.navigation.navigate('index')}
        icon={({ size }) => <Ionicons name="chatbubbles-outline" size={size} color="#0891b2" />}
      />
      <DrawerItem
        label="Ajustes"
        labelStyle={{ color: theme.text }}
        onPress={() => props.navigation.navigate('settings')}
        icon={({ size }) => <Ionicons name="settings-outline" size={size} color="#0891b2" />}
      />
    </DrawerContentScrollView>
  );
}

// 2. Navegador principal
function DrawerNavigator() {
  const { theme } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeChatId, setActiveChatId] = useState('');

  const triggerHeaderClearChat = async (currentChatId: string) => {
    Alert.alert(
      "Eliminar Historial",
      "¿Estás seguro de que quieres borrar todos los mensajes?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(`chat_messages_${currentChatId}`);
            Alert.alert("Éxito", "Historial eliminado.");
          }
        }
      ]
    );
  };

  return (
    <>
      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }} />
        </TouchableWithoutFeedback>
        <View style={[styles.menuContainer, { backgroundColor: theme.drawerBackground }]}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              setMenuVisible(false);
              triggerHeaderClearChat(activeChatId);
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
            <Text style={{ color: '#ef4444', marginLeft: 10 }}>Eliminar chat</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        // 🌟 CORRECCIÓN DE TIPO: sceneContainerStyle movido dentro de screenOptions
        screenOptions={({ route }) => ({
          sceneContainerStyle: { backgroundColor: theme.background },
          headerShown: true,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: '#0891b2',
          headerTitleStyle: { color: theme.text },
          headerRight: () => {
            if (['settings', 'gallery', 'profile', 'camera'].includes(route.name)) return null;
            const chatId = route.name === 'index' ? 'chat_general' : `chat_${route.name}`;
            
            return (
              <TouchableOpacity 
                style={{ marginRight: 16 }} 
                onPress={() => {
                  setActiveChatId(chatId);
                  setMenuVisible(true);
                }}
              >
                <Ionicons name="ellipsis-vertical" size={24} color="#0891b2" />
              </TouchableOpacity>
            );
          }
        })}
      >
        <Drawer.Screen name="index" options={{ title: 'Asistente' }} />
        <Drawer.Screen name="settings" options={{ title: 'Ajustes' }} />
      </Drawer>
    </>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawerNavigator />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 15,
    padding: 10,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: 150,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  }
});