// Common types and interfaces for the application

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Example of a more complex type
export type Theme = 'light' | 'dark' | 'auto';

export interface AppConfig {
  theme: Theme;
  apiUrl: string;
  version: string;
}

export type MessageType = 'user' | 'ai' | 'loading';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  error?: boolean;
}