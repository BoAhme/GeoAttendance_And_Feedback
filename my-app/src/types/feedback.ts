export interface FeedbackSubmission {
  sessionId: string;
  overall: number;
  clarity: number;
  relevance: number;
  pace: number;
  comment: string;
}

export interface FeedbackSummary {
  sessionId: string;
  sessionName: string;
  overallAvg: number;
  clarityAvg: number;
  relevanceAvg: number;
  paceAvg: number;
  responseCount: number;
  comments: { id: string; text: string; isBlurred: boolean }[];
}
