import ChatConversation from '../components/ChatConversation';

const johnPersonaReplies = [
  { match: ['hola', 'buenos', 'inicio'], name: 'John', text: '¡Hola! Soy John y esta es mi conversación.' },
  { match: ['como', 'estas', 'que mas'], name: 'John', text: 'Estoy bien, no me quejo y tu?.' },
  { match: ['animacion', 'fluido'], name: 'John', text: 'La animación hace que el chat se sienta más natural.' },
  { match: ['gracias', 'genial'], name: 'John', text: 'Cuando quieras.' },
];

const johnStarterMessages = [
  { id: 'john_intro', text: 'este es mi chat personal.', sender: 'ai' as const, timestamp: Date.now() },
  { id: 'john_followup', text: 'De que quieres hablar?', sender: 'ai' as const, timestamp: Date.now() + 1 },
];

export default function JohnChatScreen() {
  return <ChatConversation chatId="chat_john" starterMessages={johnStarterMessages} personaReplies={johnPersonaReplies} />;
}
