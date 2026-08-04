'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Brain, Briefcase, GraduationCap, Globe, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils/cn'

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Data Scientist', 'ML Engineer',
  'Product Manager', 'DevOps Engineer', 'System Design', 'QA Engineer',
]

const EXPERIENCE_LEVELS = [
  { value: 'fresher', label: 'Fresher', desc: '0–1 years experience', icon: '🌱' },
  { value: 'mid', label: 'Mid-Level', desc: '2–4 years experience', icon: '🚀' },
  { value: 'senior', label: 'Senior', desc: '5+ years experience', icon: '⭐' },
]

const LANGUAGES = [
  { value: 'English', flag: '🇺🇸' },
  { value: 'Hindi', flag: '🇮🇳' },
  { value: 'Spanish', flag: '🇪🇸' },
  { value: 'French', flag: '🇫🇷' },
  { value: 'German', flag: '🇩🇪' },
  { value: 'Portuguese', flag: '🇧🇷' },
]

const steps = ['Target Role', 'Experience', 'Language']

export default function OnboardingPage() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    targetRole: '',
    experienceLevel: '' as 'fresher' | 'mid' | 'senior' | '',
    preferredLanguage: 'English',
  })

  const canNext =
    (step === 0 && form.targetRole) ||
    (step === 1 && form.experienceLevel) ||
    (step === 2 && form.preferredLanguage)

  const handleNext = () => {
    if (step < 2) setStep(step + 1)
    else handleSubmit()
  }

  const handleSubmit = async () => {
    if (!form.targetRole || !form.experienceLevel || !form.preferredLanguage) return
    setIsSubmitting(true)
    try {
      const updated = await authApi.updateOnboarding({
        targetRole: form.targetRole,
        experienceLevel: form.experienceLevel as 'fresher' | 'mid' | 'senior',
        preferredLanguage: form.preferredLanguage,
      })
      if (user) setUser({ ...user, onboardingComplete: true, ...updated })
      toast.success('Profile set up! Let\'s start practicing 🎉')
      router.push('/dashboard')
    } catch {
      toast.error('Failed to save profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-lavender-50 flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
              <Brain className="h-6 w-6 text-lavender-950" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-lavender-950 mb-2">
            Let&apos;s personalize your experience
          </h1>
          <p className="text-gray-600">Tell us about yourself so we can tailor questions just for you.</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-10 gap-0">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                'flex items-center justify-center h-9 w-9 rounded-full border-2 text-sm font-semibold transition-all duration-300',
                i < step
                  ? 'bg-brand-500 border-brand-500 text-lavender-950'
                  : i === step
                  ? 'border-brand-500 text-brand-600 bg-brand-500/10'
                  : 'border-brand-500/10 text-gray-600 bg-transparent'
              )}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn(
                'ml-2 text-sm font-medium transition-colors duration-300',
                i === step ? 'text-lavender-950' : 'text-gray-500'
              )}>{s}</span>
              {i < steps.length - 1 && (
                <div className={cn(
                  'w-16 h-0.5 mx-4 transition-colors duration-300',
                  i < step ? 'bg-brand-500' : 'bg-brand-500/10'
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="rounded-2xl border border-brand-500/10 bg-white/60 backdrop-blur-xl p-8 min-h-80">
          <AnimatePresence mode="wait">
            {/* Step 0: Target Role */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Briefcase className="h-5 w-5 text-brand-600" />
                  <h2 className="text-xl font-semibold text-lavender-950">What role are you targeting?</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => setForm({ ...form, targetRole: role })}
                      className={cn(
                        'px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left',
                        form.targetRole === role
                          ? 'bg-brand-500/20 border-brand-400 text-brand-700'
                          : 'bg-brand-500/5 border-brand-500/10 text-gray-600 hover:bg-brand-500/10 hover:border-brand-500/20'
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Experience */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="h-5 w-5 text-brand-600" />
                  <h2 className="text-xl font-semibold text-lavender-950">What&apos;s your experience level?</h2>
                </div>
                <div className="grid gap-4">
                  {EXPERIENCE_LEVELS.map(({ value, label, desc, icon }) => (
                    <button
                      key={value}
                      onClick={() => setForm({ ...form, experienceLevel: value as any })}
                      className={cn(
                        'flex items-center gap-4 p-5 rounded-xl border text-left transition-all duration-200',
                        form.experienceLevel === value
                          ? 'bg-brand-500/15 border-brand-500/40 shadow-glow-purple'
                          : 'bg-brand-500/5 border-brand-500/10 hover:bg-brand-500/10 hover:border-brand-500/20'
                      )}
                    >
                      <span className="text-3xl">{icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-lavender-950">{label}</div>
                        <div className="text-sm text-gray-600">{desc}</div>
                      </div>
                      {form.experienceLevel === value && (
                        <div className="h-5 w-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-lavender-950" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Language */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Globe className="h-5 w-5 text-brand-600" />
                  <h2 className="text-xl font-semibold text-lavender-950">Preferred interview language?</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {LANGUAGES.map(({ value, flag }) => (
                    <button
                      key={value}
                      onClick={() => setForm({ ...form, preferredLanguage: value })}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200',
                        form.preferredLanguage === value
                          ? 'bg-brand-500/20 border-brand-400 text-lavender-950'
                          : 'bg-brand-500/5 border-brand-500/10 text-gray-600 hover:bg-brand-500/10 hover:border-brand-500/20'
                      )}
                    >
                      <span className="text-xl">{flag}</span>
                      {value}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={() => {
              if (step === 0) {
                useAuthStore.getState().logout()
                router.push('/')
              } else {
                setStep(step - 1)
              }
            }}
            leftIcon={<ChevronLeft className="h-4 w-4" />}
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            variant="glow"
            onClick={handleNext}
            disabled={!canNext}
            isLoading={isSubmitting}
            rightIcon={step === 2 ? undefined : <ChevronRight className="h-4 w-4" />}
          >
            {step === 2 ? 'Start Coaching 🚀' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}
