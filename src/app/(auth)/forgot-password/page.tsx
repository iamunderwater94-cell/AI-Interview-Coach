'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Brain, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authApi } from '@/lib/api/auth'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await authApi.forgotPassword(data.email)
      setSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6 relative">
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
            <Brain className="h-5 w-5 text-lavender-950" />
          </div>
          <span className="font-bold text-lavender-950">AI Interview Coach</span>
        </Link>

        {!sent ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-lavender-950 mb-2">Reset password</h1>
              <p className="text-gray-600">Enter your email and we&apos;ll send a reset link.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                id="forgot-email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />
              <Button type="submit" variant="glow" size="lg" className="w-full" isLoading={isSubmitting}>
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-lavender-950">Check your email</h1>
            <p className="text-gray-600">We&apos;ve sent a password reset link to your email address.</p>
          </div>
        )}

        <div className="mt-8">
          <Link href="/login" className="flex items-center gap-2 text-sm text-gray-600 hover:text-lavender-950 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
