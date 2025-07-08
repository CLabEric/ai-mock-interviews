export type InterviewStage =
  | 'IDLE' // Before the interview has started
  | 'INTRODUCTION' // AI introduces itself and the format
  | 'PROJECT_DEEP_DIVE' // User describes a project, AI asks follow-ups
  | 'BEHAVIORAL_QUESTIONS' // AI asks a targeted behavioral question
  | 'CANDIDATE_QUESTIONS' // User asks questions
  | 'CONCLUSION' // AI wraps up and explains next steps
  | 'FEEDBACK'; // AI provides feedback on the user's performance

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface InterviewState {
  stage: InterviewStage;
  history: ChatMessage[];
  notes: {
    // A simple key-value store for the AI's "notes" on the candidate.
    // This can be expanded later.
    [key: string]: unknown;
  };
}
