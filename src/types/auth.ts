// Auth types
export interface User {
  id: string
  name: string
  email: string
  targetRole?: string
  experienceLevel?: 'fresher' | 'mid' | 'senior'
  preferredLanguage?: string
  level: number
  xp: number
  xpToNextLevel: number
  streak: number
  totalInterviews: number
  averageScore: number
  totalPracticeTime: number
  badges: Badge[]
  onboardingComplete: boolean
  avatar?: string
  createdAt: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
  color: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  targetRole?: string
  experienceLevel?: string
  preferredLanguage?: string
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

export interface OnboardingPayload {
  targetRole: string
  experienceLevel: 'fresher' | 'mid' | 'senior'
  preferredLanguage: string
}
