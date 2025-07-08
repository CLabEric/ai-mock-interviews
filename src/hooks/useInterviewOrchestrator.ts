import { useState, useCallback } from 'react';
import type { InterviewState, ChatMessage } from '../types/interview';
import { getChatCompletion } from '../lib/utils';
import type { ApiKeyProvider } from '../lib/utils';
import {
  SYSTEM_PROMPT,
  INTRODUCTION_MESSAGE,
  BEHAVIORAL_QUESTION_PROMPT,
  CANDIDATE_QUESTIONS_PROMPT,
  CONCLUSION_MESSAGE,
  FEEDBACK_PROMPT,
} from '../lib/interviewProtocol';

const initialState: InterviewState = {
  stage: 'IDLE',
  history: [],
  notes: {},
};

interface InterviewOrchestratorProps {
  apiKey: string;
  provider: ApiKeyProvider | null;
}

export const useInterviewOrchestrator = ({ apiKey, provider }: InterviewOrchestratorProps) => {
  const [state, setState] = useState<InterviewState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const startInterview = useCallback(() => {
    const systemMessage: ChatMessage = { role: 'system', content: SYSTEM_PROMPT };
    setState({
      ...initialState,
      stage: 'INTRODUCTION',
      history: [systemMessage, INTRODUCTION_MESSAGE],
    });
  }, []);

  const handleUserMessage = useCallback(async (content: string) => {
    if (!apiKey || !provider || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content };
    let newHistory = [...state.history, userMessage];
    let currentStage = state.stage;

    // --- Stage Transition Logic ---
    if (currentStage === 'INTRODUCTION') {
      currentStage = 'PROJECT_DEEP_DIVE';
    } else if (currentStage === 'PROJECT_DEEP_DIVE') {
      // For simplicity, we'll transition after 2 user messages in the deep dive.
      // A more robust solution would use LLM-based analysis to decide when to move on.
      const userMessagesCount = newHistory.filter(m => m.role === 'user').length;
      if (userMessagesCount >= 3) { // 1 from intro, 2 from deep dive
        currentStage = 'BEHAVIORAL_QUESTIONS';
        newHistory = [...newHistory, BEHAVIORAL_QUESTION_PROMPT];
      }
    } else if (currentStage === 'BEHAVIORAL_QUESTIONS') {
      currentStage = 'CANDIDATE_QUESTIONS';
      newHistory = [...newHistory, CANDIDATE_QUESTIONS_PROMPT];
    } else if (currentStage === 'CANDIDATE_QUESTIONS') {
      // If user indicates they have no more questions, conclude.
      if (content.toLowerCase().includes('no') || content.toLowerCase().includes("that's all")) {
        currentStage = 'CONCLUSION';
        newHistory = [...newHistory, CONCLUSION_MESSAGE];
        setState({ ...state, stage: currentStage, history: newHistory });
        return; // Stop here, don't call the LLM
      }
    }

    setState((prevState) => ({ ...prevState, history: newHistory, stage: currentStage }));
    setIsLoading(true);

    try {
      const prompt = JSON.stringify(newHistory);
      const aiResponse = await getChatCompletion(provider, prompt, apiKey);
      const aiMessage: ChatMessage = { role: 'assistant', content: aiResponse };

      setState((prevState) => ({
        ...prevState,
        history: [...prevState.history, aiMessage],
      }));
    } catch (error) {
      console.error("Error getting chat completion:", error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
      };
      setState((prevState) => ({
        ...prevState,
        history: [...prevState.history, errorMessage],
      }));
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, provider, state, isLoading]);

  const generateFeedback = useCallback(async () => {
    if (!apiKey || !provider || isLoading) return;

    const feedbackSystemPrompt: ChatMessage = { role: 'system', content: FEEDBACK_PROMPT };
    // We add the full history for context, but the system prompt will guide the output.
    const historyForFeedback = [...state.history, feedbackSystemPrompt];

    setIsLoading(true);
    setState(prev => ({ ...prev, stage: 'FEEDBACK' }));

    try {
      const prompt = JSON.stringify(historyForFeedback);
      const feedbackResponse = await getChatCompletion(provider, prompt, apiKey);
      const feedbackMessage: ChatMessage = { role: 'assistant', content: feedbackResponse };

      setState((prevState) => ({
        ...prevState,
        history: [...prevState.history, feedbackMessage],
      }));
    } catch (error) {
      console.error("Error generating feedback:", error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "Sorry, I encountered an error while generating your feedback.",
      };
      setState((prevState) => ({
        ...prevState,
        history: [...prevState.history, errorMessage],
      }));
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, provider, state.history, isLoading]);

  return {
    interviewState: state,
    isLoading,
    startInterview,
    handleUserMessage,
    generateFeedback,
  };
};
