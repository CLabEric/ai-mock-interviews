import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ApiKeyProvider = 'claude' | 'open-ai' | 'gemini';

// Function to get OpenAI chat completion
export async function getOpenAIChatCompletion(userMessage: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Or another suitable model
        messages: [{ role: 'user', content: userMessage }],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to get AI response.');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in getOpenAIChatCompletion:', error);
    throw error; // Re-throw to be caught by MainPanel
  }
}

// Placeholder for Gemini API call
export async function getGeminiChatCompletion(userMessage: string, apiKey: string): Promise<string> {
  console.warn("Gemini API not implemented yet. Returning mock response.");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Gemini mock response to: "${userMessage}".`);
    }, 1500); // Simulate a 1.5 second delay
  });
}

// Placeholder for Claude API call
export async function getClaudeChatCompletion(userMessage: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch('/claude-api/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229', // Using a powerful Claude model
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to get AI response from Claude.');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error in getClaudeChatCompletion:', error);
    throw error; // Re-throw to be caught by MainPanel
  }
}

export async function getChatCompletion(provider: ApiKeyProvider, userMessage: string, apiKey: string): Promise<string> {
  switch (provider) {
    case 'claude':
      return getClaudeChatCompletion(userMessage, apiKey);
    case 'open-ai':
      return getOpenAIChatCompletion(userMessage, apiKey);
    case 'gemini':
      return getGeminiChatCompletion(userMessage, apiKey);
    default:
      throw new Error("Unknown API provider");
  }
}
