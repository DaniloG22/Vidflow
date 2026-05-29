import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const GLOBAL_PHOTOS_KEY = '@global_chat_photos_v1';

export interface StoredPhoto {
  id: string;
  uri: string;
  chatId: string;
  timestamp: number;
}

// Carga todas las fotos guardadas en la app
export const loadGlobalPhotos = async (): Promise<StoredPhoto[]> => {
  try {
    if (Platform.OS === 'web') {
      const jsonValue = window.localStorage.getItem(GLOBAL_PHOTOS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    }
    const jsonValue = await AsyncStorage.getItem(GLOBAL_PHOTOS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error cargando galería global', e);
    return [];
  }
};

// Agrega una nueva foto a la lista global sin duplicarla
export const saveGlobalPhoto = async (uri: string, chatId: string) => {
  try {
    const currentPhotos = await loadGlobalPhotos();
    
    // Evitamos guardar la misma foto si se recarga el estado
    const photoExists = currentPhotos.some(p => p.uri === uri);
    if (photoExists) return;

    const newPhoto: StoredPhoto = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uri,
      chatId,
      timestamp: Date.now()
    };

    const updatedPhotos = [newPhoto, ...currentPhotos]; // La más reciente primero

    if (Platform.OS === 'web') {
      window.localStorage.setItem(GLOBAL_PHOTOS_KEY, JSON.stringify(updatedPhotos));
      return;
    }
    await AsyncStorage.setItem(GLOBAL_PHOTOS_KEY, JSON.stringify(updatedPhotos));
  } catch (e) {
    console.error('Error guardando en galería global', e);
  }
};