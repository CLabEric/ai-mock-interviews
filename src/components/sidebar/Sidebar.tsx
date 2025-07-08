import { Sparkles, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import AccountSection from "./AccountSection";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApiKeyModal: () => void;
  onClearApiKey: () => void;
}

const Sidebar = ({ isOpen, onClose, onOpenApiKeyModal, onClearApiKey }: SidebarProps) => {
  return (
    <aside className={`
      flex flex-col h-full p-4
      lg:flex lg:flex-col lg:h-full lg:p-4
      fixed inset-y-0 left-0 w-80 z-50 lg:static lg:z-auto lg:w-auto lg:inset-auto
      bg-background lg:bg-transparent
      transform transition-transform duration-300 ease-in-out lg:transform-none
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Mobile close button */}
      <div className="lg:hidden flex justify-end mb-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

     {/* Mobile logo */}
     <div className="lg:hidden flex items-center space-x-3 mb-6">
       <Avatar className="w-8 h-8">
         <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
           AI
         </AvatarFallback>
       </Avatar>
       <h1 className="text-lg font-semibold text-foreground">Chat AI</h1>
     </div>


      {/* Ongoing prompt section */}
      <div className="flex-shrink-0 mb-4">
        <Button variant="ghost" className="w-full justify-start">
          <Zap className="w-4 h-4 mr-2" />
          Ongoing prompt
        </Button>
      </div>

      {/* Scrollable middle section - Recent Chats */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {/* Chat history items would go here */}
            {/* Placeholder for when there are no chats */}
            <div className="px-3 py-2 text-sm text-muted-foreground text-center">
              No recent chats
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="flex-shrink-0 mb-4">
        <Button variant="ghost" className="w-full justify-start">
          <Sparkles className="w-4 h-4 mr-2" />
          Start new chat
        </Button>
      </div>

      {/* Fixed bottom section - Account */}
      <div className="flex-shrink-0 mt-auto">
        <AccountSection onOpenApiKeyModal={onOpenApiKeyModal} onClearApiKey={onClearApiKey} />
      </div>
    </aside>
  );
};

export default Sidebar;
