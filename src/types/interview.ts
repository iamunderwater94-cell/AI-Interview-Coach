// Interview types
export type Difficulty = 'easy' | 'medium' | 'hard'
export type ExperienceLevel = 'fresher' | 'mid' | 'senior'
export type InterviewStatus = 'pending' | 'in_progress' | 'completed' | 'abandoned'

export interface Question {
  id: string
  text: string
  type: 'technical' | 'behavioral' | 'situational'
  category: string
  hint?: string
  timeLimit?: number
}

export interface Evaluation {
  questionId: string
  technicalScore: number
  grammarScore: number
  clarityScore: number
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  userAnswer?: string
  improvedAnswer?: string
  feedback: string
}

export interface Interview {
  id: string
  userId: string
  role: string
  difficulty: Difficulty
  experience: ExperienceLevel
  language: string
  status: InterviewStatus
  questions: Question[]
  evaluations: Evaluation[]
  overallScore?: number
  technicalAvg?: number
  grammarAvg?: number
  clarityAvg?: number
  duration?: number
  startedAt: string
  completedAt?: string
  insights?: InterviewInsights
}

export interface InterviewInsights {
  strongAreas: string[]
  weakAreas: string[]
  suggestions: Suggestion[]
  recommendedTopics: RecommendedTopic[]
}

export interface Suggestion {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

export interface RecommendedTopic {
  id: string
  title: string
  description: string
  url: string
  category: string
  estimatedTime: string
}

export interface StartInterviewPayload {
  role: string
  difficulty: Difficulty
  experience: ExperienceLevel
  language: string
  resume?: File
}

export interface SubmitAnswerPayload {
  questionId: string
  text?: string
  audio?: Blob
  code?: string
  language?: string
}

export interface InterviewSession {
  interview: Interview | null
  currentQuestionIndex: number
  currentEvaluation: Evaluation | null
  isSubmitting: boolean
  isComplete: boolean
}

export interface ScoreHistory {
  date: string
  score: number
  role: string
}

export interface PracticeModule {
  id: string
  title: string
  description: string
  category: string
  difficulty: Difficulty
  estimatedTime: string
  questionCount: number
  weaknessArea: string
}
