import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ChatMessage } from '../types/interview.js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ApiKeyProvider = 'claude' | 'open-ai' | 'gemini';

// Function to get OpenAI chat completion
export async function getOpenAIChatCompletion(messages: ChatMessage[], apiKey: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Or another suitable model
        messages: messages,
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
export async function getGeminiChatCompletion(messages: ChatMessage[], apiKey: string): Promise<string> {
  console.warn("Gemini API not implemented yet. Returning mock response.");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Gemini mock response to: "${JSON.stringify(messages)}".`);
    }, 1500); // Simulate a 1.5 second delay
  });
}

// Placeholder for Claude API call
export async function getClaudeChatCompletion(messages: ChatMessage[], apiKey: string): Promise<string> {
  try {
    const systemMessage = messages.find(msg => msg.role === 'system');
    const userAndAssistantMessages = messages.filter(msg => msg.role !== 'system');

    const requestBody: any = {
      model: 'claude-3-opus-20240229',
      messages: userAndAssistantMessages,
      max_tokens: 1024,
      temperature: 0.7,
    };

    if (systemMessage) {
      requestBody.system = systemMessage.content;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(requestBody),
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

export async function getChatCompletion(provider: ApiKeyProvider, history: ChatMessage[], apiKey: string): Promise<string> {
  switch (provider) {
    case 'claude':
      return getClaudeChatCompletion(history, apiKey);
    case 'open-ai':
      return getOpenAIChatCompletion(history, apiKey);
    case 'gemini':
      return getGeminiChatCompletion(history, apiKey);
    default:
      throw new Error("Unknown API provider");
  }
}

export async function checkStageCompletion(provider: ApiKeyProvider, history: object, apiKey: string): Promise<boolean> {
  const SUPERVISOR_PROMPT = `
You are an expert interview analyst. Your task is to determine if a candidate has provided a sufficiently detailed technical explanation of their project.

Analyze the following interview transcript. The last message is the candidate's most recent answer.

Based on the entire conversation, has the candidate adequately covered the following points?
- The problem they were solving.
- The technology stack used (language, frameworks).
- Key data structures or algorithms.
- Their specific contributions and design decisions.
- The final outcome or impact of the project.

Respond with only the word "COMPLETE" if the explanation is sufficient to move on to behavioral questions. Otherwise, respond with only the word "INCOMPLETE".
`;

  // Combine the supervisor prompt with the history
  const fullPrompt = `${SUPERVISOR_PROMPT}

Interview History:
${JSON.stringify(history, null, 2)}`;

  try {
    const messagesForSupervisor: ChatMessage[] = [
      { role: 'system', content: SUPERVISOR_PROMPT },
      { role: 'user', content: JSON.stringify(history, null, 2) }
    ];
    const response = await getChatCompletion(provider, messagesForSupervisor, apiKey);
    console.log("Supervisor response:", response);
    return response.trim().toUpperCase() === 'COMPLETE';
  } catch (error) {
    console.error("Error in checkStageCompletion:", error);
    // Default to not completing the stage if there's an error.
    return false;
  }
}