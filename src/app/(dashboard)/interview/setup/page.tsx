'use client'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'
import { Briefcase, Zap, User, Globe, ChevronRight, ArrowLeft, Upload, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { interviewApi } from '@/lib/api/interview'
import { useInterviewStore } from '@/store/interviewStore'
import { useAuthStore } from '@/store/authStore'
import { LoadingScreen } from '@/components/interview/LoadingScreen'
import { cn } from '@/lib/utils/cn'

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Data Scientist', 'ML Engineer',
  'Product Manager', 'DevOps Engineer', 'QA Engineer', 'System Design',
]

const schema = z.object({
  role: z.string().min(1, 'Select a role'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  experience: z.enum(['fresher', 'mid', 'senior']),
  language: z.string().min(1),
  resume: z.any().optional(),
})
type FormData = z.infer<typeof schema>

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', desc: 'Fundamentals & basics', color: 'emerald', emoji: '🌱' },
  { value: 'medium', label: 'Medium', desc: 'Real interview level', color: 'yellow', emoji: '🚀' },
  { value: 'hard', label: 'Hard', desc: 'FAANG & top companies', color: 'red', emoji: '🔥' },
]

const EXPERIENCE_LEVELS = [
  { value: 'fresher', label: 'Fresher', desc: '0–1 years', emoji: '🌱' },
  { value: 'mid', label: 'Mid-Level', desc: '2–4 years', emoji: '💼' },
  { value: 'senior', label: 'Senior', desc: '5+ years', emoji: '⭐' },
]

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German']

export default function InterviewSetupPage() {
  const router = useRouter()
  const { setInterview } = useInterviewStore()
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMeta, setLoadingMeta] = useState({ role: '', difficulty: '' })

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: user?.targetRole || '',
      difficulty: 'medium',
      experience: (user?.experienceLevel as any) || 'mid',
      language: user?.preferredLanguage || 'English',
      resume: undefined
    },
  })

  const selectedRole = watch('role')
  const selectedDiff = watch('difficulty')
  const selectedExp = watch('experience')
  const selectedLang = watch('language')
  const selectedResume = watch('resume') as File | undefined

  const onSubmit = async (data: FormData) => {
    setLoadingMeta({ role: data.role, difficulty: data.difficulty })
    setIsLoading(true)
    try {
      const res = await interviewApi.start(data)
      setInterview(res.interview)
      router.push(`/interview/${res.interview.id}`)
    } catch (err: any) {
      setIsLoading(false)
      toast.error(err?.response?.data?.message || 'Failed to start interview. Please try again.')
    }
  }

  if (isLoading) {
    return <LoadingScreen role={loadingMeta.role} difficulty={loadingMeta.difficulty} />
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-lavender-950 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-lavender-950 mb-2">Set Up Your Interview</h1>
        <p className="text-gray-600">Configure your session and let AI generate personalized questions.</p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Role */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-semibold text-lavender-950">Target Role</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setValue('role', role)}
                className={cn(
                  'px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all duration-200',
                  selectedRole === role
                    ? 'bg-brand-500/20 border-brand-400 text-brand-700'
                    : 'bg-white/[0.03] border-brand-500/10 text-gray-600 hover:bg-brand-500/10 hover:border-brand-500/20'
                )}
              >
                {role}
              </button>
            ))}
          </div>
          {errors.role && <p className="text-red-400 text-xs mt-2">{errors.role.message}</p>}
        </motion.div>

        {/* Difficulty */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-lavender-950">Difficulty Level</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map(({ value, label, desc, color, emoji }) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue('difficulty', value as any)}
                className={cn(
                  'p-4 rounded-xl border text-center transition-all duration-200',
                  selectedDiff === value
                    ? color === 'emerald'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : color === 'yellow'
                      ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300'
                      : 'bg-red-500/15 border-red-500/40 text-red-300'
                    : 'bg-white/[0.03] border-brand-500/10 text-gray-600 hover:bg-brand-500/10'
                )}
              >
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="font-semibold text-sm">{label}</div>
                <div className="text-xs opacity-70 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Experience */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-lavender-950">Experience Level</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {EXPERIENCE_LEVELS.map(({ value, label, desc, emoji }) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue('experience', value as any)}
                className={cn(
                  'p-4 rounded-xl border text-center transition-all duration-200',
                  selectedExp === value
                    ? 'bg-brand-500/15 border-brand-500/40 text-brand-700'
                    : 'bg-white/[0.03] border-brand-500/10 text-gray-600 hover:bg-brand-500/10'
                )}
              >
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="font-semibold text-sm">{label}</div>
                <div className="text-xs opacity-70 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-lavender-950">Language</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setValue('language', lang)}
                className={cn(
                  'px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200',
                  selectedLang === lang
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/[0.03] border-brand-500/10 text-gray-600 hover:bg-brand-500/10'
                )}
              >
                {lang}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Resume Upload */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-lavender-950 dark:text-white">Resume <span className="text-sm font-normal text-gray-500">(Optional)</span></h2>
          </div>
          
          <div className="relative">
            {selectedResume ? (
              <div className="flex items-center justify-between p-4 rounded-xl border border-brand-500/30 bg-brand-500/5">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-brand-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-brand-600" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-lavender-950 dark:text-white truncate">{selectedResume.name}</p>
                    <p className="text-xs text-gray-500">{(selectedResume.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setValue('resume', undefined)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-brand-500/30 rounded-xl cursor-pointer hover:bg-brand-500/5 hover:border-brand-500/50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-brand-400" />
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-brand-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF or Image files (Max 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,application/pdf,image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const isValidType = file.type === 'application/pdf' || file.type.startsWith('image/')
                      if (!isValidType) {
                        toast.error('Only PDF and image files are supported')
                        return
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error('File size must be under 5MB')
                        return
                      }
                      setValue('resume', file)
                    }
                  }}
                />
              </label>
            )}
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Button type="submit" variant="glow" size="xl" className="w-full" rightIcon={<ChevronRight className="h-5 w-5" />}>
            Generate Interview Questions
          </Button>
        </motion.div>
      </form>
    </div>
  )
}
