import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const webStorage = typeof window !== 'undefined' ? window.localStorage : null;
const storageKey = (chatId: string) => `@chat_${chatId}`;

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