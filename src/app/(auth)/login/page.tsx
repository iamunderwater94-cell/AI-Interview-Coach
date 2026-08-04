'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Brain, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.login(data)
      let userData = res.user || (res as any).data?.user || (res as any).data
      const authToken = res.token || (res as any).accessToken || (res as any).data?.accessToken || (res as any).data?.token

      // If backend doesn't return user, fetch it
      if (!userData || !userData.name) {
        useAuthStore.getState().setAuth({} as any, authToken)
        try {
          const profileRes = await authApi.getProfile()
          userData = profileRes.user || profileRes.data?.user || profileRes.data || profileRes
        } catch (e) {
          console.error('Failed to fetch profile', e)
        }
      }

      setAuth(userData, authToken)
      toast.success('Welcome back! 👋')
      
      if (!userData?.onboardingComplete) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="flex w-full">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-navy-900 via-brand-900/30 to-navy-900">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-purple">
              <Brain className="h-6 w-6 text-lavender-950" />
            </div>
            <span className="font-bold text-lavender-950 text-xl">AI Interview Coach</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 space-y-6"
        >
          <h2 className="text-4xl font-bold text-lavender-950 leading-tight">
            Your next job offer<br />starts here.
          </h2>
          <p className="text-gray-600 text-lg">
            Practice with AI, track your progress,<br />and walk into interviews with confidence.
          </p>

          <div className="space-y-4 pt-4">
            {[
              { stat: '87%', label: 'of users improve scores within 5 sessions' },
              { stat: '3.2×', label: 'faster interview preparation vs. traditional methods' },
              { stat: '50+', label: 'roles across tech, product, and business' },
            ].map(({ stat, label }) => (
              <div key={stat} className="flex items-center gap-4">
                <div className="text-2xl font-bold gradient-text min-w-[64px]">{stat}</div>
                <div className="text-sm text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 text-sm text-gray-600">
          © 2024 AI Interview Coach
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12 bg-lavender-50 relative">
        <div className="absolute inset-0 noise-bg" />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
              <Brain className="h-5 w-5 text-lavender-950" />
            </div>
            <span className="font-bold text-lavender-950">AI Interview Coach</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-lavender-950 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to continue your interview practice.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-600 hover:text-lavender-950 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-sm text-brand-600 hover:text-brand-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="glow"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
