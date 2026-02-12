import { useRef, useEffect } from 'react';
import './ChatPanel.css';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input when loading finishes
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="chat-input-container">
      <textarea
        ref={inputRef}
        className="chat-input"
        placeholder="Type 'Add buy milk' or 'List tasks'..."
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        rows={1}
        disabled={isLoading}
      />
      <button 
        className="send-button"
        onClick={(e) => handleSubmit(e)}
        disabled={!input.trim() || isLoading}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
      </button>
    </div>
  );
}
