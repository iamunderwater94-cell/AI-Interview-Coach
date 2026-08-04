import { create } from 'zustand'
import type { Interview, Evaluation, InterviewSession } from '@/types/interview'

interface InterviewStore extends InterviewSession {
  setInterview: (interview: Interview) => void
  setEvaluation: (evaluation: Evaluation) => void
  nextQuestion: () => void
  setSubmitting: (isSubmitting: boolean) => void
  completeInterview: () => void
  reset: () => void
}

const initialState: InterviewSession = {
  interview: null,
  currentQuestionIndex: 0,
  currentEvaluation: null,
  isSubmitting: false,
  isComplete: false,
}

export const useInterviewStore = create<InterviewStore>((set) => ({
  ...initialState,

  setInterview: (interview) =>
    set({
      interview,
      currentQuestionIndex: 0,
      currentEvaluation: null,
      isComplete: false,
    }),

  setEvaluation: (evaluation) => set({ currentEvaluation: evaluation, isSubmitting: false }),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
      currentEvaluation: null,
    })),

  setSubmitting: (isSubmitting) => set({ isSubmitting }),

  completeInterview: () => set({ isComplete: true }),

  reset: () => set(initialState),
}))
