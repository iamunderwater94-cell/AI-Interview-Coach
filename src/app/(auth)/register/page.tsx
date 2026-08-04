'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Brain, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.register(data)
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
      toast.success('Account created! Let\'s set up your profile 🚀')
      router.push('/onboarding')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="flex w-full">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-navy-900 via-cyan-900/20 to-navy-900">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-brand-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }} />

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
          <h2 className="text-4xl font-bold text-lavender-950">
            Start your journey to<br /><span className="gradient-text">interview success</span>.
          </h2>
          <p className="text-gray-600 text-lg">
            Free to start. AI-powered feedback from day one.
          </p>

          <div className="space-y-3 pt-4">
            {[
              'Unlimited practice sessions',
              'Real-time AI scoring & feedback',
              'Voice recording & analysis',
              'Progress tracking & badges',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <span className="text-gray-600 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 text-sm text-gray-600">© 2024 AI Interview Coach</div>
      </div>

      {/* Right - form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12 bg-lavender-50 relative">
        <div className="absolute inset-0 noise-bg" />
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
              <Brain className="h-5 w-5 text-lavender-950" />
            </div>
            <span className="font-bold text-lavender-950">AI Interview Coach</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-lavender-950 mb-2">Create your account</h1>
            <p className="text-gray-600">Get started with AI-powered interview coaching.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="reg-name"
              label="Full name"
              type="text"
              placeholder="Jane Doe"
              autoComplete="name"
              leftIcon={<User className="h-4 w-4" />}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              id="reg-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              id="reg-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-600 hover:text-lavender-950 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              id="reg-confirm"
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="glow"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-gray-600">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
