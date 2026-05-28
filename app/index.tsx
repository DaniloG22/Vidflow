import ChatConversation from '../components/ChatConversation';

const generalPersonaReplies = [
  { match: ['hola', 'buenos', 'inicio'], name: 'John', text: '¡Hola! Soy John y comienzo esta charla con energía.' },
  { match: ['cian', 'color', 'tono'], name: 'Camila', text: 'El tono cian me hace sentir la conversación más fresca y clara.' },
  { match: ['animacion', 'fluido', 'suave'], name: 'Laura', text: 'Me encanta cómo se siente fluido todo el chat con estos movimientos.' },
  { match: ['cámara', 'foto', 'camara'], name: 'Carlos', text: 'Si usas la cámara, la conversación se vuelve mucho más dinámica.' },
  { match: ['perfil', 'mi perfil', 'nombre'], name: 'Sofía', text: 'A mí me gusta que se vea más personal y menos robotizado.' },
  { match: ['gracias', 'genial', 'cool'], name: 'Pablo', text: '¡Genial! Este chat de personas tiene una vibra muy natural.' },
];

const generalStarterMessages = [
  { id: 'welcome', text: '¡Hola! Como te puedo ayudar el dia de hoy?', sender: 'ai' as const, timestamp: Date.now() },
];

export default function ChatScreen() {
  return (
    <ChatConversation
      chatId="chat_general"
      starterMessages={generalStarterMessages}
      personaReplies={generalPersonaReplies}
    />
  );
}