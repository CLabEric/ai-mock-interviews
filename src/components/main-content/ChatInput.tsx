import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    hasSentFirstMessage: boolean;
    disabled?: boolean; // Make disabled optional
    onStartInterview: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, hasSentFirstMessage, disabled = false, onStartInterview }) => {
    const [inputValue, setInputValue] = useState("");

    const handleSend = () => {
        if (inputValue.trim() && !disabled) {
            onSendMessage(inputValue.trim());
            setInputValue("");
        }
    };

    return (
        <div className="flex flex-col p-4 bg-background">
            {/* Example Prompts - visible when input is empty, with smooth transition */}
            <div 
                className={`flex flex-col items-center justify-center text-center mb-4 
                    transition-all duration-500 ease-in-out 
                    ${hasSentFirstMessage ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-96'}
                 `}
            >
                {/* Content is always rendered, visibility controlled by parent div's classes */}
                     <h1 className="text-3xl font-bold mb-4">Welcome to Chat AI</h1>
                     <p className="text-muted-foreground mb-8">Choose an interview type to begin:</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                         <Button variant="outline" className="h-auto py-4 text-left whitespace-normal" onClick={onStartInterview}>
                             Technical/Behavioral Interview
                         </Button>
                         <Button variant="outline" className="h-auto py-4 text-left whitespace-normal" disabled>
                             Coming Soon
                         </Button>
                     </div>
            </div>
             
             {/* Input Area */}
             <div className="flex items-center space-x-2">
               <Textarea 
                   placeholder="Ask me anything..." 
                   className="flex-1 rounded-full border-border py-3"
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                   disabled={disabled}
               />
               <Button 
                   size="icon" 
                   className="rounded-full bg-primary hover:bg-primary/90"
                   disabled={!inputValue.trim() || disabled}
                   onClick={handleSend}
               >
                   <Send className="w-4 h-4" />
               </Button>
             </div>
           </div>
    );
};

export default ChatInput;
