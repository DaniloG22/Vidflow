import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, FlatList, Text, KeyboardAvoidingView, Platform, Image, View, TouchableOpacity, Alert } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplitActionBar from './SplitActionBar';
import TypingIndicator from './TypingIndicator';
import { useTheme } from '../utils/theme';
import { saveGlobalPhoto } from '../utils/photoStorage';

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useLocalSearchParams();
  const { theme } = useTheme();
  
  // 🌟 SOLUCIÓN IMAGE_C967F9: Aseguramos el estado de los mensajes e indicador de escritura
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const STORAGE_KEY = `chat_messages_${chatId}`;

  useEffect(() => {
    const loadSavedMessages = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData !== null) {
          setMessages(JSON.parse(savedData));
        } else {
          setMessages(starterMessages);
        }
      } catch (error) {
        console.error("Error cargando mensajes:", error);
        setMessages(starterMessages);
      }
      setIsTyping(false);
    };

    loadSavedMessages();
  }, [chatId]);

  const saveMessagesToDisk = async (newMessagesList: ChatMessage[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMessagesList));
    } catch (error) {
      console.error("Error guardando mensajes:", error);
    }
  };

  const handleLocalResponse = (currentMessages: ChatMessage[]) => {
    const lastUserMessageObj = currentMessages[currentMessages.length - 1];
    if (!lastUserMessageObj) return;

    setIsTyping(true);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 60);

    let replyName = "Asistente";
    let replyText = "Recibí tu mensaje correctamente.";

    if (chatId === 'chat_general') {
      replyName = "Asistente General";
      replyText = "Hola, soy tu Asistente General local. ¿En qué te puedo colaborar hoy?";
    } else if (personaReplies.length > 0) {
      replyName = personaReplies[0].name;
      
      const userTextLower = lastUserMessageObj.text.toLowerCase();
      const matchedReply = personaReplies.find(reply => 
        reply.match.some(keyword => userTextLower.includes(keyword.toLowerCase()))
      );

      if (matchedReply) {
        replyText = matchedReply.text;
      } else {
        replyText = `Soy ${replyName}: Entendido perfectamente. Guardaré tu mensaje de forma permanente.`;
      }
    }
    
    const localReplyMessage: ChatMessage = { 
      id: `ai_${Date.now()}`, 
      text: replyText, 
      sender: 'ai', 
      timestamp: Date.now() 
    };
    
    setTimeout(() => {
      setMessages(prev => {
        const nextMessages = [...prev, localReplyMessage];
        void saveMessagesToDisk(nextMessages);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 60);
        return nextMessages;
      });
      setIsTyping(false);
    }, 800);
  };

  const handleSendMessage = async (text: string, imageUri?: string) => {
    const trimmedText = text.trim();
    if (!trimmedText && !imageUri) return;

    const newUserMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      text: trimmedText || 'Foto enviada',
      sender: 'user',
      timestamp: Date.now(),
      imageUri,
    };

    if (imageUri) {
      void saveGlobalPhoto(imageUri, chatId);
    }

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    void saveMessagesToDisk(updatedMessages);
    handleLocalResponse(updatedMessages);
  };

  useEffect(() => {
    const photoUri = Array.isArray(searchParams.chatPhotoUri) ? searchParams.chatPhotoUri[0] : searchParams.chatPhotoUri;
    if (!photoUri) return;

    void handleSendMessage('Foto enviada', photoUri);
    router.setParams({ chatPhotoUri: undefined });
  }, [searchParams.chatPhotoUri]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={90} 
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.messagesList}
        style={{ backgroundColor: 'transparent' }}
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <Animated.View 
              entering={isUser ? FadeInRight.springify() : FadeInLeft.springify()} 
              // 🌟 SOLUCIÓN IMAGE_C95475: Sintaxis de arreglo de estilos limpia y corregida con llaves {}
              style={[
                styles.bubble, 
                isUser ? styles.userBubble : styles.aiBubble,
                { backgroundColor: '#0891b2' }
              ]}
            >
              {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.messageImage} resizeMode="cover" /> : null}
              {item.text ? (
                <Text style={{ color: '#ffffff', fontSize: 16 }}>
                  {item.text}
                </Text>
              ) : null}
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
  messagesList: { paddingHorizontal: 15, paddingVertical: 10, gap: 12 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 18, shadowColor: '#0891b2', shadowOpacity: 0.16, shadowRadius: 3, elevation: 2, overflow: 'hidden' },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  messageImage: { width: 220, height: 220, borderRadius: 12, marginBottom: 8, alignSelf: 'center' },
});