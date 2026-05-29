import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { loadGlobalPhotos, StoredPhoto } from '../utils/photoStorage';
import { useTheme } from '../utils/theme';

const { width } = Dimensions.get('window');
const COLUMN_SIZE = width / 3 - 10; // Ajusta el tamaño para 3 columnas responsivas

export default function GlobalPhotoGallery() {
  const [photos, setPhotos] = useState<StoredPhoto[]>([]);
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Cargamos las fotos cada vez que el componente se enfoca o se abre
  useEffect(() => {
    const fetchPhotos = async () => {
      const stored = await loadGlobalPhotos();
      setPhotos(stored);
    };

    fetchPhotos();
    // Opcional: Añadir un listener de enfoque por si estás usando React Navigation/Expo Router
    const unsubscribe = navigation.addListener('focus', fetchPhotos);
    return unsubscribe;
  }, [navigation]);

  if (photos.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.text }]}>No se han enviado fotos aún.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Galería Compartida</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.photoContainer}
            activeOpacity={0.8}
            onPress={() => console.log(`Foto origen: ${item.chatId}`)} // Puedes usarlo para navegar al chat de origen
          >
            <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, paddingHorizontal: 5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, opacity: 0.6 },
  grid: { justifyContent: 'flex-start' },
  photoContainer: {
    width: COLUMN_SIZE,
    height: COLUMN_SIZE,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  image: { width: '100%', height: '100%' },
});