import ChatContent from "./ChatContent";
import ChatInput from "./ChatInput";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import type { Message } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInterviewOrchestrator } from "@/hooks/useInterviewOrchestrator";
import type { ChatMessage } from "@/types/interview";
import type { ApiKeyProvider } from "@/lib/utils";

// Helper function to map our internal ChatMessage to the UI's Message type
const toUIMessage = (chatMessage: ChatMessage, index: number): Message => {
  if (chatMessage.role === 'system') {
    return {
      id: `system-${index}`,
      type: 'ai',
      content: '',
      error: false,
    };
  }
  return {
    id: `${chatMessage.role}-${index}`,
    type: chatMessage.role === 'user' ? 'user' : 'ai',
    content: chatMessage.content,
    error: false,
  };
};

interface MainPanelProps {
  apiKey: string;
  onOpenApiKeyModal: () => void;
  selectedProvider: ApiKeyProvider | null;
}

const MainPanel = ({ apiKey, selectedProvider }: MainPanelProps) => {
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const {
    interviewState,
    isLoading,
    startInterview,
    handleUserMessage,
    generateFeedback,
  } = useInterviewOrchestrator({ apiKey, provider: selectedProvider });

  const handleScroll = useCallback(() => {
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      setShowJumpToBottom(scrollHeight - scrollTop > clientHeight + 200);
    }
  }, []);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]',
    );

    if (viewport) {
      const scrollToBottom = () => {
        viewport.scrollTop = viewport.scrollHeight;
      };

      // Initial scroll to bottom
      scrollToBottom();

      // Create a MutationObserver to watch for content changes
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            scrollToBottom();
          }
        }
      });

      // Start observing the viewport for changes
      observer.observe(viewport, { 
        childList: true, 
        subtree: true, 
        characterData: true 
      });

      // Add scroll event listener
      viewport.addEventListener('scroll', handleScroll);

      // Cleanup on component unmount
      return () => {
        observer.disconnect();
        viewport.removeEventListener('scroll', handleScroll);
      };
    }
  }, [interviewState.history, handleScroll]);

  const uiMessages = interviewState.history
    .map(toUIMessage)
    .filter((msg) => msg.content !== '');

  return (
    <main className="flex-1 flex flex-col bg-background h-full">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
        {interviewState.stage === 'IDLE' ? (
          <div className="flex items-center justify-center h-full">
            {/* The interview start options are now handled by ChatInput */}
          </div>
        ) : (
          <ChatContent messages={uiMessages} />
        )}
      </ScrollArea>

      {showJumpToBottom && (
        <Button
          onClick={() => {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
              viewport.scrollTop = viewport.scrollHeight;
            }
          }}
          className="fixed bottom-24 right-8 rounded-full shadow-lg z-50"
          size="icon"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>
        </Button>
      )}

      <ChatInput
        onSendMessage={handleUserMessage}
        hasSentFirstMessage={interviewState.stage !== 'IDLE'}
        disabled={interviewState.stage === 'IDLE' || interviewState.stage === 'CONCLUSION' || interviewState.stage === 'FEEDBACK' || isLoading}
        onStartInterview={startInterview}
      />

      {interviewState.stage === 'CONCLUSION' && (
        <div className="p-4 text-center">
          <Button onClick={generateFeedback}>Get Feedback</Button>
        </div>
      )}
    </main>
  );
};

export default MainPanel;