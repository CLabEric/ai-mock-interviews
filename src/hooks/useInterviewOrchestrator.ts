import { useState, useCallback, useEffect } from 'react';
import usePusher from './usePusher';
import type { InterviewState, ChatMessage } from '../types/interview';
import { getChatCompletion, checkStageCompletion } from '../lib/utils';
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
  username: string;
}

export const useInterviewOrchestrator = ({ apiKey, provider, username }: InterviewOrchestratorProps) => {
  const [state, setState] = useState<InterviewState>(initialState);
  const [isNetworkLoading, setIsNetworkLoading] = useState(false); // Tracks network requests
  const [isTyping, setIsTyping] = useState(false); // Tracks typing animations
  const { channel, sendMessage } = usePusher('presence-interview-channel', username);

  useEffect(() => {
    if (channel) {
      channel.bind('llm-response', (data: any) => {
        const message: ChatMessage = { role: 'assistant', content: data.message };
        setState(prev => ({ ...prev, history: [...prev.history, message] }));
        setIsNetworkLoading(false); // LLM response received, network request complete
        setIsTyping(true); // Start typing animation for LLM response
        console.log('llm-response received: isTyping set to true, isNetworkLoading set to false');
      });
    }
  }, [channel]);

  const startInterview = useCallback(() => {
    const systemMessage: ChatMessage = { role: 'system', content: SYSTEM_PROMPT };
    setState({
      ...initialState,
      stage: 'INTRODUCTION',
      history: [systemMessage, INTRODUCTION_MESSAGE],
    });
    setIsNetworkLoading(false); // No network request for initial prompt, but it will type
    setIsTyping(true); // Start typing animation for initial prompt
  }, []);

  const handleUserMessage = useCallback(async (content: string) => {
    console.log('handleUserMessage: Initial isNetworkLoading:', isNetworkLoading, 'isTyping:', isTyping);
    if (!apiKey || !provider || isNetworkLoading || isTyping) return; // Disable if network loading or typing

    const userMessage: ChatMessage = { role: 'user', content };
    const newHistory = [...state.history, userMessage];
    let currentStage = state.stage;

    setState(prev => ({ ...prev, history: newHistory }));

    // --- Stage Transition Logic ---
    if (currentStage === 'INTRODUCTION') {
      currentStage = 'PROJECT_DEEP_DIVE';
    } else if (currentStage === 'PROJECT_DEEP_DIVE') {
      setIsNetworkLoading(true); // Show loading indicator during supervisor check (network request)
      const isStageComplete = await checkStageCompletion(provider, newHistory, apiKey);
      setIsNetworkLoading(false); // Supervisor check is a network request, so set isNetworkLoading false here

      if (isStageComplete) {
        currentStage = 'BEHAVIORAL_QUESTIONS';
        const historyWithCanned = [...newHistory, BEHAVIORAL_QUESTION_PROMPT];
        setState({ ...state, stage: currentStage, history: historyWithCanned });
        setIsTyping(true); // Canned response, start typing animation
        return;
      }
    } else if (currentStage === 'BEHAVIORAL_QUESTIONS') {
      currentStage = 'CANDIDATE_QUESTIONS';
      const historyWithCanned = [...newHistory, CANDIDATE_QUESTIONS_PROMPT];
      setState({ ...state, stage: currentStage, history: historyWithCanned });
      setIsTyping(true); // Canned response, start typing animation
      return;
    } else if (currentStage === 'CANDIDATE_QUESTIONS') {
      if (content.toLowerCase().includes('no') || content.toLowerCase().includes("that's all")) {
        currentStage = 'CONCLUSION';
        const historyWithCanned = [...newHistory, CONCLUSION_MESSAGE];
        setState({ ...state, stage: currentStage, history: historyWithCanned });
        setIsTyping(true); // Canned response, start typing animation
        return;
      }
    }

    // If no canned response was triggered, proceed to call the LLM for a conversational response
    setState((prevState) => ({ ...prevState, stage: currentStage }));
    setIsNetworkLoading(true); // Disable input while waiting for LLM response (network request)

    sendMessage(content, newHistory, apiKey, provider);
  }, [apiKey, provider, state, isNetworkLoading, isTyping, sendMessage]); // Add isTyping to dependencies

  const generateFeedback = useCallback(async () => {
    if (!apiKey || !provider || isNetworkLoading || isTyping) return;

    const feedbackSystemPrompt: ChatMessage = { role: 'system', content: FEEDBACK_PROMPT };
    const historyForFeedback = [...state.history, feedbackSystemPrompt];

    setIsNetworkLoading(true);
    setState(prev => ({ ...prev, stage: 'FEEDBACK' }));

    try {
      const feedbackResponse = await getChatCompletion(provider, historyForFeedback, apiKey);
      const feedbackMessage: ChatMessage = { role: 'assistant', content: feedbackResponse };

      setState((prevState) => ({
        ...prevState,
        history: [...prevState.history, feedbackMessage],
      }));
      setIsTyping(true); // Start typing animation for feedback
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
      setIsNetworkLoading(false); // Feedback generation is a network request
    }
  }, [apiKey, provider, state.history, isNetworkLoading, isTyping]);

  return {
    interviewState: state,
    isLoading: isNetworkLoading, // Expose as isLoading for consistency with MainPanel
    isTyping,
    startInterview,
    handleUserMessage,
    generateFeedback,
    setIsTyping,
  };
};