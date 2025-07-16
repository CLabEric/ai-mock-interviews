
import express from 'express';
import bodyParser from 'body-parser';
import Pusher from 'pusher';
import { getChatCompletion, ApiKeyProvider } from './src/lib/utils.js';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

const pusher = new Pusher({
  appId: process.env.VITE_PUSHER_APP_ID!,
  key: process.env.VITE_PUSHER_KEY!,
  secret: process.env.VITE_PUSHER_SECRET!,
  cluster: process.env.VITE_PUSHER_CLUSTER!,
  useTLS: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/pusher-auth', (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const username = req.body.username;
  const auth = pusher.authenticate(socketId, channel, {
    user_id: username,
    user_info: { username }
  });
  res.send(auth);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.post('/api/llm-chat', async (req, res) => {
  const { message, history, apiKey, provider } = req.body;
  console.log('Received provider:', provider);
  try {
    const llmResponse = await getChatCompletion(provider, history, apiKey);
    await pusher.trigger('presence-interview-channel', 'llm-response', { message: llmResponse });
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing LLM chat:', error);
    res.status(500).send('Error');
  }
});
