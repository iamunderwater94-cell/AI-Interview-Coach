'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Settings, Save, User, Mail, Lock, Briefcase, GraduationCap, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'

export default function SettingsPage() {
  const { user, setUser } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    preferredLanguage: '',
  })

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        preferredLanguage: user.preferredLanguage || '',
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload: any = {}
      if (form.name !== user?.name) payload.name = form.name
      if (form.email !== user?.email) payload.email = form.email
      if (form.password) {
        if (form.password.length < 6) {
          toast.error('Password must be at least 6 characters long.')
          setIsSubmitting(false)
          return
        }
        payload.password = form.password
      }
      if (form.preferredLanguage !== user?.preferredLanguage) payload.preferredLanguage = form.preferredLanguage

      if (Object.keys(payload).length === 0) {
        toast.info('No changes to save.')
        setIsSubmitting(false)
        return
      }

      const updated = await authApi.updateProfile(payload)
      if (user) {
        setUser({ ...user, ...updated })
      }
      toast.success('Profile updated successfully!')
      setForm(prev => ({ ...prev, password: '' }))
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-purple">
          <Settings className="h-6 w-6 text-lavender-950 dark:text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-lavender-950 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile and preferences.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-brand-500/10 dark:border-white/10 rounded-3xl p-6 md:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-lavender-950 dark:text-white border-b dark:border-white/10 pb-2">Account Details</h2>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <Input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  leftIcon={<User className="h-4 w-4" />}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <Input
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  type="email"
                  leftIcon={<Mail className="h-4 w-4" />}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <Input
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Leave blank to keep current"
                  type="password"
                  leftIcon={<Lock className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-lavender-950 dark:text-white border-b dark:border-white/10 pb-2">Professional Profile</h2>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Language</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={form.preferredLanguage}
                    onChange={e => setForm({ ...form, preferredLanguage: e.target.value })}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-lavender-50 dark:bg-[#1a1a1a] border border-brand-500/20 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  >
                    <option value="" disabled>Select language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Portuguese">Portuguese</option>
                  </select>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-tight">Note: This controls the language the AI uses to generate questions and evaluate your answers. It does not translate the actual buttons and menus of the web app.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-brand-500/10 dark:border-white/10 flex justify-end">
            <Button
              type="submit"
              variant="glow"
              isLoading={isSubmitting}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
