'use client'
import { motion } from 'framer-motion'
import { Zap, Award, Flame } from 'lucide-react'
import { Progress } from '@/components/ui/Progress'
import type { User } from '@/types/auth'

const BADGE_ICONS: Record<string, string> = {
  'first-interview': '🎯',
  'streak-7': '🔥',
  'score-90': '⭐',
  'voice-master': '🎙️',
  'consistent': '📈',
  'technical-ace': '💻',
}

interface GamificationPanelProps {
  user: User
}

export function GamificationPanel({ user }: GamificationPanelProps) {
  const xp = user.xp || 0
  const xpToNext = user.xpToNextLevel || 100
  const level = user.level || 1
  const streak = user.streak || 0
  const badges = user.badges || []
  const xpPct = (xp / xpToNext) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-6"
    >
      <h3 className="text-lg font-semibold text-lavender-950 mb-5">Achievements</h3>

      {/* Level + XP */}
      <div className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-gradient-to-r from-brand-500/10 to-cyan-500/5 border border-brand-500/20">
        <div className="relative">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-purple">
            <Zap className="h-7 w-7 text-lavender-950" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] font-bold text-navy-900">
            {level}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-semibold text-lavender-950">Level {level}</span>
            <span className="text-xs text-gray-600">{xp} / {xpToNext} XP</span>
          </div>
          <Progress value={xpPct} variant="gradient" size="md" />
          <p className="text-xs text-gray-500 mt-1.5">{xpToNext - xp} XP to Level {level + 1}</p>
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-5">
        <Flame className="h-5 w-5 text-orange-400 flex-shrink-0" />
        <div>
          <span className="text-orange-300 font-bold">{streak} day streak!</span>
          <p className="text-xs text-gray-600">Keep practicing to maintain it</p>
        </div>
      </div>

      {/* Badges */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Award className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-medium text-gray-600">Badges Earned ({badges.length})</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {badges.slice(0, 8).map((badge) => (
            <div
              key={badge.id}
              title={badge.name}
              className="h-12 w-full rounded-xl bg-brand-500/5 border border-brand-500/10 flex items-center justify-center text-2xl hover:bg-brand-500/10 transition-colors cursor-default"
            >
              {BADGE_ICONS[badge.id] || '🏆'}
            </div>
          ))}
          {badges.length === 0 && (
            <div className="col-span-4 text-center py-4 text-sm text-gray-500">
              Complete interviews to earn badges!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
