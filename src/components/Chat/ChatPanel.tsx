import { useAutoScroll } from '../../hooks/useAutoScroll';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import type { ChatMessage } from '../../lib/schemas/chat';
import './ChatPanel.css';

interface ChatPanelProps {
  messages: ChatMessage[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatPanel({ messages, input, handleInputChange, handleSubmit, isLoading }: ChatPanelProps) {
  const messagesEndRef = useAutoScroll(messages);

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h2>Chat Assistant</h2>
        <p className="chat-subtitle">Create and manage your tasks</p>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="message assistant">
             <div className="message-bubble typing-indicator">
                <span></span><span></span><span></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput 
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default ChatPanel;
