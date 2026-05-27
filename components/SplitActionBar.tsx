import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface SplitActionBarProps {
  onSendMessage: (text: string) => void;
  onCameraPress: () => void;
}

export default function SplitActionBar({ onSendMessage, onCameraPress }: SplitActionBarProps) {
  const [text, setText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  
  const menuScale = useSharedValue(0);
  const menuOpacity = useSharedValue(0);

  const toggleMenu = () => {
    if (showMenu) {
      menuScale.value = withSpring(0);
      menuOpacity.value = withSpring(0);
    } else {
      menuScale.value = withSpring(1, { damping: 15 });
      menuOpacity.value = withSpring(1);
    }
    setShowMenu(!showMenu);
  };

  const animatedMenuStyle = useAnimatedStyle(() => ({
    transform: [{ scale: menuScale.value }],
    opacity: menuOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.actionMenu, animatedMenuStyle]}>
        <TouchableOpacity style={styles.menuButton} onPress={onCameraPress}>
          <Ionicons name="camera" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="image" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.inputBar}>
        <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
          <Ionicons name={showMenu ? "close" : "add"} size={26} color="#128C7E" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity 
          onPress={() => { if(text.trim()) { onSendMessage(text); setText(''); } }} 
          style={styles.sendButton}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', bottom: 0, width: '100%', padding: 10, backgroundColor: '#f7f9fa' },
  inputBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#e0e0e0' },
  input: { flex: 1, height: 40, paddingHorizontal: 10 },
  iconButton: { padding: 5 },
  sendButton: { backgroundColor: '#128C7E', borderRadius: 20, padding: 8, marginLeft: 5 },
  actionMenu: { flexDirection: 'row', position: 'absolute', bottom: 70, left: 20, backgroundColor: '#128C7E', borderRadius: 20, padding: 10, gap: 15, zIndex: 10 },
  menuButton: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 50 }
});