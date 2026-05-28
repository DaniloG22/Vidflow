import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const webStorage = typeof window !== 'undefined' ? window.localStorage : null;
const storageKey = (chatId: string) => `@chat_${chatId}`;
const chatPrefix = '@chat_';

export const saveMessages = async (chatId: string, messages: any[]) => {
  try {
    const key = storageKey(chatId);

    if (Platform.OS === 'web' && webStorage) {
      webStorage.setItem(key, JSON.stringify(messages));
      return;
    }

    await AsyncStorage.setItem(key, JSON.stringify(messages));
  } catch (e) {
    console.error("Error guardando mensajes", e);
  }
};

export const loadMessages = async (chatId: string) => {
  try {
    const key = storageKey(chatId);

    if (Platform.OS === 'web' && webStorage) {
      const jsonValue = webStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    }

    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error cargando mensajes", e);
    return [];
  }
};

export const clearAllChatData = async () => {
  try {
    if (Platform.OS === 'web' && webStorage) {
      Object.keys(webStorage)
        .filter((key) => key.startsWith(chatPrefix))
        .forEach((key) => webStorage.removeItem(key));
      return;
    }

    const keys = await AsyncStorage.getAllKeys();
    const chatKeys = keys.filter((key) => key.startsWith(chatPrefix));

    if (chatKeys.length > 0) {
      await AsyncStorage.multiRemove(chatKeys);
    }
  } catch (e) {
    console.error("Error limpiando chats", e);
  }
};