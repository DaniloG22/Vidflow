import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, FlatList, Text, KeyboardAvoidingView, Platform, Image } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import SplitActionBar from './SplitActionBar';
import TypingIndicator from './TypingIndicator';
import { useTheme } from '../utils/theme';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  imageUri?: string;
}

export interface ChatPersonaReply {
  match: string[];
  name: string;
  text: string;
}

interface ChatConversationProps {
  chatId: string;
  starterMessages: ChatMessage[];
  personaReplies: ChatPersonaReply[];
}

export default function ChatConversation({ chatId, starterMessages, personaReplies }: ChatConversationProps) {
  const { theme } = useTheme(); // Obtenemos el tema dinámico
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useLocalSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const storageKey = `@chat_${chatId}_v2`;

  // ... (Tus funciones loadStoredMessages y saveStoredMessages se quedan igual)
  const loadStoredMessages = async () => {
    try {
      if (Platform.OS === 'web') {
        const jsonValue = window.localStorage.getItem(storageKey);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
      }
      const jsonValue = await AsyncStorage.getItem(storageKey);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error cargando mensajes', e);
      return [];
    }
  };

  const saveStoredMessages = async (nextMessages: ChatMessage[]) => {
    try {
      if (Platform.OS === 'web') {
        window.localStorage.setItem(storageKey, JSON.stringify(nextMessages));
        return;
      }
      await AsyncStorage.setItem(storageKey, JSON.stringify(nextMessages));
    } catch (e) {
      console.error('Error guardando mensajes', e);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const history = await loadStoredMessages();
      if (history.length > 0) {
        setMessages(history);
      } else {
        const seededMessages = [...starterMessages];
        setMessages(seededMessages);
        await saveStoredMessages(seededMessages);
      }
    };
    fetchMessages();
  }, []);

  const handleAIResponse = async (currentMessages: ChatMessage[]) => {
    setIsTyping(true);
    setTimeout(async () => {
      const userMessage = currentMessages[currentMessages.length - 1].text.toLowerCase();
      const matchedPersona = personaReplies.find((persona) => persona.match.some((keyword) => userMessage.includes(keyword))) || personaReplies[Math.floor(Math.random() * personaReplies.length)];
      const aiText = `Soy ${matchedPersona.name}: ${matchedPersona.text}`;
      const aiMessage: ChatMessage = { id: `ai_${Date.now()}`, text: aiText, sender: 'ai', timestamp: Date.now() };
      const updatedHistory = [...currentMessages, aiMessage];
      setMessages(updatedHistory);
      await saveStoredMessages(updatedHistory);
      setIsTyping(false);
    }, 1800);
  };

  const handleSendMessage = async (text: string, imageUri?: string) => {
    const trimmedText = text.trim();
    if (!trimmedText && !imageUri) return;
    setMessages((currentMessages) => {
      const newUserMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        text: trimmedText || 'Foto enviada',
        sender: 'user',
        timestamp: Date.now(),
        imageUri,
      };
      const updatedMessages = [...currentMessages, newUserMessage];
      void saveStoredMessages(updatedMessages);
      void handleAIResponse(updatedMessages);
      return updatedMessages;
    });
  };

  useEffect(() => {
    const photoUri = Array.isArray(searchParams.chatPhotoUri) ? searchParams.chatPhotoUri[0] : searchParams.chatPhotoUri;
    if (!photoUri) return;
    void handleSendMessage('Foto enviada', photoUri);
    router.setParams({ chatPhotoUri: undefined });
  }, [searchParams.chatPhotoUri]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90} style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <Animated.View 
              entering={isUser ? FadeInRight.springify() : FadeInLeft.springify()} 
              style={[
                styles.bubble, 
                { backgroundColor: theme.cian}, 
                isUser ? styles.userBubble : styles.aiBubble
              ]}
            >
              {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.messageImage} resizeMode="cover" /> : null}
              {item.text ? <Text style={styles.bubbleText}>{item.text}</Text> : null}
            </Animated.View>
          );
        }}
      />
      {isTyping && <TypingIndicator />}
      <SplitActionBar onSendMessage={handleSendMessage} onCameraPress={() => router.push({ pathname: '/camera', params: { from: pathname } })} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messagesList: { paddingHorizontal: 15, paddingVertical: 20, gap: 12 },
  bubble: { 
    maxWidth: '80%', 
    padding: 12, 
    borderRadius: 18, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 3, 
    elevation: 2, 
    overflow: 'hidden' 
  },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  messageImage: { width: 220, height: 220, borderRadius: 12, marginBottom: 8, alignSelf: 'center' },
  bubbleText: { color: '#ffffff', fontSize: 16 }, // Texto siempre blanco para contraste
});