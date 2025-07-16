import React from "react"; // Explicitly import React
import type { Message } from "@/types"; // Import Message as type
import { useState, useEffect } from "react"; // Import useState and useEffect

interface ChatContentProps {
  messages: Message[];
  setIsTyping: (isTyping: boolean) => void;
}
 
const ChatContent: React.FC<ChatContentProps> = ({ messages, setIsTyping }) => {
  // This component will now primarily display messages passed as props
  // The hasChatStarted state is no longer needed here as it's managed by MainPanel

  const [displayedContent, setDisplayedContent] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.type === 'ai' && displayedContent[lastMessage.id] !== lastMessage.content) {
      let i = displayedContent[lastMessage.id]?.length || 0;
      const typingInterval = setInterval(() => {
        if (i < lastMessage.content.length) {
          setDisplayedContent((prev) => ({
            ...prev,
            [lastMessage.id]: lastMessage.content.substring(0, i + 1),
          }));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false); // Typing animation complete
        }
      }, 20); // Typing speed (milliseconds per character)

      return () => clearInterval(typingInterval);
    } else if (lastMessage.type === 'ai' && displayedContent[lastMessage.id] === lastMessage.content) {
      // If the last message is AI and already fully displayed, ensure typing is false
      setIsTyping(false);
    }
  }, [messages, displayedContent, setIsTyping]);
 
  return (
    <div className="p-6"> {/* Added min-h to reserve space */}
      {
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg min-h-12 min-w-[40px] flex items-center ${message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : message.type === 'ai'
                      ? 'bg-muted text-muted-foreground'
                      : message.error
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-gray-200 text-gray-700'
                  }`}
              >
                {message.type === 'user'
                  ? message.content
                  : message.type === 'loading'
                    ? '...'
                    : displayedContent[message.id] || ''}
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};
 
export default ChatContent;