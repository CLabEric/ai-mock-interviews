
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';

const usePusher = (channelName: string, username: string) => {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    const pusherInstance = new Pusher(import.meta.env.VITE_PUSHER_KEY!, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher-auth',
      auth: {
        params: { username },
      },
    });

    setPusher(pusherInstance);

    const channelInstance = pusherInstance.subscribe(channelName);
    setChannel(channelInstance);

    return () => {
      pusherInstance.unsubscribe(channelName);
      pusherInstance.disconnect();
    };
  }, [channelName, username]);

  const sendMessage = async (message: string, history: ChatMessage[], apiKey: string, provider: ApiKeyProvider | null) => {
    try {
      await fetch('/api/llm-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, history, apiKey, provider }),
      });
    } catch (error) {
      console.error('Error sending message to LLM:', error);
    }
  };

  return { pusher, channel, sendMessage };
};

export default usePusher;
