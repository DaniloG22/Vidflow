import ChatConversation from '../components/ChatConversation';

const camilaPersonaReplies = [
  { match: ['hola', 'buenos', 'inicio'], name: 'Camila', text: '¡Hola! Soy Camila y este es mi chat.' },
  { match: ['cian', 'color', 'tono'], name: 'Camila', text: 'El azul cian me hace sentir más concentrada y fresca.' },
  { match: ['animacion', 'fluido'], name: 'Camila', text: 'Los movimientos se sienten suaves y cómodos.' },
  { match: ['gracias', 'genial'], name: 'Camila', text: '¡Qué bonito! Este chat se siente muy personal.' },
];

const camilaStarterMessages = [
  { id: 'camila_intro', text: 'Este es mi chat personal.', sender: 'ai' as const, timestamp: Date.now() },
  { id: 'camila_followup', text: 'Aquí tengo mi propio espacio y mi propio tono jsjsjsj.', sender: 'ai' as const, timestamp: Date.now() + 1 },
];

export default function CamilaChatScreen() {
  return <ChatConversation chatId="chat_camila" starterMessages={camilaStarterMessages} personaReplies={camilaPersonaReplies} />;
}
