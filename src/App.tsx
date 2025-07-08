import { useState, useEffect } from "react"
import Header from "./components/Header"
import Sidebar from "./components/sidebar/Sidebar"
import MainPanel from "./components/main-content/MainPanel"
import ApiKeyModal from "./components/ApiKeyModal"
import useLocalStorage from "./hooks/useLocalStorage"
import './App.css';

type ApiKeyProvider = 'claude' | 'open-ai' | 'gemini';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [apiKeyStorage, setApiKeyStorage] = useLocalStorage();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ApiKeyProvider>('claude'); // Default to claude

  useEffect(() => {
    if (!apiKeyStorage[selectedProvider]) {
      setIsApiKeyModalOpen(true);
    }
  }, [apiKeyStorage, selectedProvider]);

  const handleSaveApiKey = (provider: ApiKeyProvider, key: string) => {
    setApiKeyStorage({ [provider]: key });
    setIsApiKeyModalOpen(false);
  };

  const handleClearApiKey = () => {
    setApiKeyStorage({}); // Clear all keys
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
        onSave={handleSaveApiKey} 
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
      />
      <div className="flex flex-col lg:w-80 bg-muted/50 border-r border-border">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1">
          <Sidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            onClearApiKey={handleClearApiKey}
          />
        </div>
      </div>
      <MainPanel 
        apiKey={apiKeyStorage[selectedProvider] || ''} // Pass the selected provider's key
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        selectedProvider={selectedProvider}
      />
    </div>
  );
}

export default App;