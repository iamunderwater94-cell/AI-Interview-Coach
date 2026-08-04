import apiClient from './axios'
import type { AuthResponse, LoginPayload, OnboardingPayload, RegisterPayload, UpdateProfilePayload } from '@/types/auth'

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload)
    return data
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', payload)
    return data
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/forgot-password', { email })
    return data
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/auth/reset-password', { token, password })
    return data
  },

  getProfile: async () => {
    const { data } = await apiClient.get('/auth/me')
    return data
  },

  updateOnboarding: async (payload: OnboardingPayload) => {
    const { data } = await apiClient.patch('/auth/onboarding', payload)
    return data
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const { data } = await apiClient.patch('/auth/profile', payload)
    return data
  },

  logout: async () => {
    await apiClient.post('/auth/logout').catch(() => {})
  },
}
