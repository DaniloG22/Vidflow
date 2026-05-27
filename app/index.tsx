import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, FlatList, Text, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import SplitActionBar from '../components/SplitActionBar';
import TypingIndicator from '../components/TypingIndicator';
import { loadMessages, saveMessages } from '../utils/storage';
import { useRouter } from 'expo-router';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const chatId = "chat_principal";

  useEffect(() => {
    const fetchMessages = async () => {
      const history = await loadMessages(chatId);
      if (history.length > 0) {
        setMessages(history);
      } else {
        const welcome: Message = { id: 'welcome', text: '¡Hola! Soy tu asistente de IA con animaciones fluidas. ¿En qué puedo ayudarte?', sender: 'ai', timestamp: Date.now() };
        setMessages([welcome]);
        await saveMessages(chatId, [welcome]);
      }
    };
    fetchMessages();
  }, []);

  const handleAIResponse = async (currentMessages: Message[]) => {
    setIsTyping(true);
    setTimeout(async () => {
      const userMessage = currentMessages[currentMessages.length - 1].text.toLowerCase();
      let aiText = "¡Qué interesante! Cuéntame más al respecto.";
      
      if (userMessage.includes('hola')) aiText = "¡Hola! ¿Cómo va tu día?";
      else if (userMessage.includes('animacion')) aiText = "¡Me encantan las animaciones! Reanimated corre de forma nativa a 60 FPS.";

      const aiMessage: Message = { id: `ai_${Date.now()}`, text: aiText, sender: 'ai', timestamp: Date.now() };
      const updatedHistory = [...currentMessages, aiMessage];
      setMessages(updatedHistory);
      await saveMessages(chatId, updatedHistory);
      setIsTyping(false);
    }, 1800);
  };

  const handleSendMessage = async (text: string) => {
    const newUserMessage: Message = { id: `user_${Date.now()}`, text, sender: 'user', timestamp: Date.now() };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    await saveMessages(chatId, updatedMessages);
    handleAIResponse(updatedMessages);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90} style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <Animated.View entering={isUser ? FadeInRight.springify() : FadeInLeft.springify()} style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
              <Text style={isUser ? styles.userText : styles.aiText}>{item.text}</Text>
            </Animated.View>
          );
        }}
      />
      {isTyping && <TypingIndicator />}
      <SplitActionBar onSendMessage={handleSendMessage} onCameraPress={() => router.push({ pathname: '/camera', params: { from: 'chat' } })} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f5f7' },
  messagesList: { paddingHorizontal: 15, paddingVertical: 20, gap: 12 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 18, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  userBubble: { backgroundColor: '#128C7E', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  aiBubble: { backgroundColor: '#ffffff', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  userText: { color: '#fff', fontSize: 16 },
  aiText: { color: '#333', fontSize: 16 },
});