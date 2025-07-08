import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface AccountSectionProps {
  onOpenApiKeyModal: () => void;
  onClearApiKey: () => void;
}

const AccountSection = ({ onOpenApiKeyModal, onClearApiKey }: AccountSectionProps) => {
    return (
        <section className="space-y-3 p-3 border border-border rounded-lg">
            <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" onClick={onOpenApiKeyModal}>
                    Update API Key
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600" onClick={onClearApiKey}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Clear API Key
                </Button>
            </div>
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">
                    Let's create an account
                </h3>
                <p className="text-xs text-muted-foreground">
                    Save your chat history, share chat, and personalize your experience.
                </p>
            </div>
            
            <div className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Sign in
                </Button>
                <button className="w-full text-xs text-blue-600 hover:text-blue-700 hover:underline bg-transparent border-none cursor-pointer">
                    Create account
                </button>
            </div>
        </section>
    )
}

export default AccountSection
