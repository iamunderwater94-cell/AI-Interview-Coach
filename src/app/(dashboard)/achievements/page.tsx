'use client'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { GamificationPanel } from '@/components/dashboard/GamificationPanel'
import { Trophy } from 'lucide-react'

export default function AchievementsPage() {
  const { user } = useAuthStore()

  if (!user) return null

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-glow-purple">
          <Trophy className="h-5 w-5 text-lavender-950" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-lavender-950">Achievements</h1>
          <p className="text-gray-600 text-sm">Track your progress and badges</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <GamificationPanel user={user} />
      </motion.div>
    </div>
  )
}
