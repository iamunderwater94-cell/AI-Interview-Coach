'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Brain, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'
import { auth } from '@/lib/firebase-client'
import { signInWithRedirect, getRedirectResult, GoogleAuthProvider } from 'firebase/auth'

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
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))
    if (token) {
      router.push('/dashboard')
    }

    // Handle Google Sign-In redirect result
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          setIsGoogleLoading(true)
          const idToken = await result.user.getIdToken()
          
          const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken }),
          })

          if (res.ok) {
            const data = await res.json()
            queryClient.clear()
            setAuth(data.user, data.token)
            toast.success('Account created successfully! 🎉')
            router.push('/dashboard')
          } else {
            const data = await res.json()
            toast.error(`Google Sign-In failed: ${data.error || 'Server error'}`)
            setIsGoogleLoading(false)
          }
        }
      } catch (err: any) {
        console.error(err)
        toast.error(`Google Sign-In failed: ${err.message || err}`)
        setIsGoogleLoading(false)
      }
    }
    
    checkRedirect()
  }, [router, queryClient, setAuth])

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

      queryClient.clear()
      setAuth(userData, authToken)
      toast.success('Account created! Welcome to the dashboard 🚀')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithRedirect(auth, provider)
    } catch (err: any) {
      console.error(err)
      toast.error(`Google Sign-In failed: ${err.message || err}`)
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

        <div className="relative z-10 text-sm text-gray-500">© 2026 AI Interview Coach</div>
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Input
                id="reg-confirm"
                label="Confirm password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
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
            </motion.div>

            <div className="relative my-6 flex items-center justify-center w-full">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-3 text-sm text-gray-500 font-medium">Or continue with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                onClick={handleGoogleSignIn}
                isLoading={isGoogleLoading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </Button>
            </motion.div>
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
