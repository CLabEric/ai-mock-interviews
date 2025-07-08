import React from "react"; // Explicitly import React
import type { Message } from "@/types"; // Import Message as type
import { useState, useEffect } from "react"; // Import useState and useEffect

interface ChatContentProps {
  messages: Message[];
}
 
const ChatContent: React.FC<ChatContentProps> = ({ messages }) => {
  // This component will now primarily display messages passed as props
  // The hasChatStarted state is no longer needed here as it's managed by MainPanel

  const [displayedContent, setDisplayedContent] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    messages.forEach((message) => {
      if (message.type === 'ai' && !displayedContent[message.id]) {
        let i = 0;
        const typingInterval = setInterval(() => {
          setDisplayedContent((prev) => ({
            ...prev,
            [message.id]: message.content.substring(0, i),
          }));
          i++;
          if (i > message.content.length) {
            clearInterval(typingInterval);
          }
        }, 20); // Typing speed (milliseconds per character)
      }
    });
  }, [messages, displayedContent]);
 
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