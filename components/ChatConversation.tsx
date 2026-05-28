import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, FlatList, Text, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import SplitActionBar from './SplitActionBar';
import TypingIndicator from './TypingIndicator';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const storageKey = `@chat_${chatId}_v2`;

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

  const handleSendMessage = async (text: string) => {
    const newUserMessage: ChatMessage = { id: `user_${Date.now()}`, text, sender: 'user', timestamp: Date.now() };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    await saveStoredMessages(updatedMessages);
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
  container: { flex: 1, backgroundColor: '#ffffff' },
  messagesList: { paddingHorizontal: 15, paddingVertical: 20, gap: 12 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 18, shadowColor: '#0891b2', shadowOpacity: 0.16, shadowRadius: 3, elevation: 2 },
  userBubble: { backgroundColor: '#0891b2', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  aiBubble: { backgroundColor: '#e0fbff', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  userText: { color: '#fff', fontSize: 16 },
  aiText: { color: '#065f73', fontSize: 16 },
});
