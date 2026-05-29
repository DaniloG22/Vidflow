import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../utils/theme';


export default function ProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [avatar, setAvatar] = useState('https://via.placeholder.com/150');
  const buttonScale = useSharedValue(1);

  
  useEffect(() => {
    const loadProfileData = async () => {
      const savedName = await AsyncStorage.getItem('@profile_name');
      const savedStatus = await AsyncStorage.getItem('@profile_status');
      const savedAvatar = await AsyncStorage.getItem('@profile_avatar');
      if (savedName) setName(savedName);
      if (savedStatus) setStatus(savedStatus);
      if (savedAvatar) setAvatar(savedAvatar);
    };
    loadProfileData();
  }, []);

  useEffect(() => {
    if (params?.photoUri) {
      setAvatar(params.photoUri as string);
    }
  }, [params?.photoUri]);

  const handleSave = async () => {
    buttonScale.value = withSpring(0.95, {}, () => { buttonScale.value = withSpring(1); });
    try {
      await AsyncStorage.setItem('@profile_name', name);
      await AsyncStorage.setItem('@profile_status', status);
      await AsyncStorage.setItem('@profile_avatar', avatar);
      Alert.alert("¡Éxito!", "Perfil guardado.");
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar.");
    }
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({ transform: [{ scale: buttonScale.value }] }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View entering={FadeInUp.delay(100)} style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <TouchableOpacity style={styles.changePictureButton} onPress={() => router.push({ pathname: '/camera', params: { from: 'profile' } })}>
          <Ionicons name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250)} style={styles.form}>
        <Text style={styles.label}>Nombre de Usuario</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={{ marginRight: 10 }} />
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ej. Danilo" />
        </View>

        <Text style={styles.label}>Estado del Perfil</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="chatbubble-outline" size={20} color="#666" style={{ marginRight: 10 }} />
          <TextInput style={styles.input} value={status} onChangeText={setStatus} placeholder="Ej. Programando..." />
        </View>

        <TouchableOpacity onPress={handleSave}>
          <Animated.View style={[styles.saveButton, animatedButtonStyle]}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </View>

    

  );
    
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fa', alignItems: 'center', padding: 20 },
  avatarContainer: { position: 'relative', marginTop: 30, marginBottom: 40 },
  avatar: { width: 130, height: 130, borderRadius: 65, borderWidth: 3, borderColor: '#128C7E' },
  changePictureButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#128C7E', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#f7f9fa' },
  form: { width: '100%' },
  label: { fontSize: 14, color: '#128C7E', fontWeight: '600', marginBottom: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, marginBottom: 20, height: 50, elevation: 1 },
  input: { flex: 1, fontSize: 16 },
  saveButton: { backgroundColor: '#128C7E', borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});