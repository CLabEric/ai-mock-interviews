import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ApiKeyProvider = 'claude' | 'open-ai' | 'gemini';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (provider: ApiKeyProvider, apiKey: string) => void;
  selectedProvider: ApiKeyProvider | null;
  setSelectedProvider: (provider: ApiKeyProvider) => void;
}

const ApiKeyModal = ({ isOpen, onClose, onSave, selectedProvider, setSelectedProvider }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (apiKey.trim() && selectedProvider) {
      onSave(selectedProvider, apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enter Your API Key</CardTitle>
          <CardDescription>
            Your API key is stored locally in your browser and never sent to our servers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedProvider || ""} onValueChange={(value) => setSelectedProvider(value as ApiKeyProvider)}>
            <SelectTrigger>
              <SelectValue placeholder="Select API Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="claude">Claude</SelectItem>
              <SelectItem value="open-ai">OpenAI</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
            </SelectContent>
          </Select>
          <Input type="password" placeholder="sk-..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!apiKey.trim() || !selectedProvider}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApiKeyModal;