import { ToolResultRenderer } from './TaskCards';
import Markdown from 'react-markdown';
import type { ChatMessage } from '../../lib/schemas/chat';
import './ChatPanel.css';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`message ${message.role}`}>
      <div className="message-bubble">
        <div className="message-content">
          {(!isUser && message.parts && message.parts.length > 0) ? (
            <>
              {message.parts
                .filter((p: any) => p.type === 'text' && p.text)
                .map((part: any, i: number) => (
                  <Markdown key={`text-${i}`}>{part.text}</Markdown>
                ))}
              {message.parts
                .filter((p: any) => p.type === 'tool-invocation' || p.type === 'tool-result')
                .map((part: any, i: number) => (
                  <ToolResultRenderer key={`tool-${i}`} part={part} />
                ))}
            </>
          ) : (
            // Fallback for user messages or non-part messages
            isUser ? message.content : <Markdown>{message.content}</Markdown>
          )}
        </div>
        <span className="message-time">
          {message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            : ''}
        </span>
      </div>
    </div>
  );
}
