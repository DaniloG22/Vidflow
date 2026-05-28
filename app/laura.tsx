import ChatConversation from '../components/ChatConversation';

const lauraPersonaReplies = [
  { match: ['hola', 'buenos', 'inicio'], name: 'Laura', text: '¡Hola! Soy Laura y estoy en mi chat personal.' },
  { match: ['cian', 'color', 'tono'], name: 'Laura', text: 'El cian me da una sensación muy alegre y clara.' },
  { match: ['animacion', 'fluido'], name: 'Laura', text: 'Las transiciones hacen que todo se vea más fluido.' },
  { match: ['gracias', 'genial'], name: 'Laura', text: '¡Perfecto! Me gusta cómo queda este espacio.' },
  { match: ['foto', 'imagen', 'camara'], name: 'Laura', text: '¡Qué bonita foto! Me encanta ver cómo se siente tu mundo en esta conversación.' },
];

const lauraStarterMessages = [
  { id: 'laura_intro', text: 'Este es mi chat personal.', sender: 'ai' as const, timestamp: Date.now() },
  { id: 'laura_followup', text: 'Estoy aquí para responder en mi propio estil.', sender: 'ai' as const, timestamp: Date.now() + 1 },
];

export default function LauraChatScreen() {
  return <ChatConversation chatId="chat_laura" starterMessages={lauraStarterMessages} personaReplies={lauraPersonaReplies} />;
}
