import apiClient from './axios'
import type {
  Interview,
  StartInterviewPayload,
  SubmitAnswerPayload,
  Evaluation,
  ScoreHistory,
  PracticeModule,
} from '@/types/interview'

export const interviewApi = {
  start: async (payload: StartInterviewPayload): Promise<{ interview: Interview }> => {
    if (payload.resume) {
      const formData = new FormData()
      formData.append('role', payload.role)
      formData.append('difficulty', payload.difficulty)
      formData.append('experience', payload.experience)
      formData.append('language', payload.language)
      formData.append('resume', payload.resume)
      const { data } = await apiClient.post('/interview/start', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    }
    const { data } = await apiClient.post('/interview/start', payload)
    return data
  },

  submitAnswer: async (
    interviewId: string,
    payload: SubmitAnswerPayload
  ): Promise<{ evaluation: Evaluation }> => {
    // Handle both text and audio answers
    if (payload.audio) {
      const formData = new FormData()
      formData.append('questionId', payload.questionId)
      formData.append('audio', payload.audio, 'recording.webm')
      if (payload.code) formData.append('code', payload.code)
      if (payload.language) formData.append('language', payload.language)
      const { data } = await apiClient.post(`/interview/${interviewId}/answer`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    }
    const { data } = await apiClient.post(`/interview/${interviewId}/answer`, payload)
    return data
  },

  complete: async (interviewId: string): Promise<{ interview: Interview }> => {
    const { data } = await apiClient.post(`/interview/${interviewId}/complete`)
    return data
  },

  getById: async (interviewId: string): Promise<{ interview: Interview }> => {
    const { data } = await apiClient.get(`/interview/${interviewId}`)
    return data
  },

  getHistory: async (page = 1, limit = 10): Promise<{ interviews: Interview[]; total: number; pages: number }> => {
    const { data } = await apiClient.get('/interview/history', { params: { page, limit } })
    return data
  },

  getScoreHistory: async (): Promise<{ history: ScoreHistory[] }> => {
    const { data } = await apiClient.get('/interview/score-history')
    return data
  },

  getPracticeModules: async (): Promise<{ modules: PracticeModule[] }> => {
    const { data } = await apiClient.get('/interview/practice-modules')
    return data
  },
}
