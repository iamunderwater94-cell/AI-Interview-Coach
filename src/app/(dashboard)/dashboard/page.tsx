'use client'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BarChart2, Clock, Flame, Trophy, Mic2, ChevronRight
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { interviewApi } from '@/lib/api/interview'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ScoreChart } from '@/components/dashboard/ScoreChart'
import { StatCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Self-healing: if the user object in sessionStorage is corrupted or missing a name
    if (user && (!user.name || typeof user.name !== 'string' || user.name.trim().length === 0)) {
      import('@/lib/api/auth').then(({ authApi }) => {
        authApi.getProfile().then(profileRes => {
          const userData = profileRes.user || profileRes.data?.user || profileRes.data || profileRes
          if (userData && userData.name) {
            useAuthStore.getState().setUser(userData)
          }
        }).catch(console.error)
      })
    }
  }, [user])

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['interview-history'],
    queryFn: () => interviewApi.getHistory(1, 4),
    enabled: !!user,
  })

  const { data: scoreData } = useQuery({
    queryKey: ['score-history'],
    queryFn: () => interviewApi.getScoreHistory(),
    enabled: !!user,
  })

  if (!mounted) return null
  if (!user) return null

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }


  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto relative min-h-screen">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-10 w-[400px] h-[400px] bg-brand-500/15 dark:bg-brand-500/30 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-cyan-500/15 dark:bg-cyan-500/30 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-lavender-950">
            {greeting()}, <span className="text-brand-600">{user.name && typeof user.name === 'string' && user.name.trim().length > 0 && user.name !== 'null' && user.name !== 'undefined' ? user.name.trim().split(' ')[0] : 'Guest'}</span> 👋
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            {user.targetRole ? `Preparing for ${user.targetRole}` : 'Ready to practice?'} — Keep up the momentum!
          </p>
        </div>
        <Link href="/interview/setup">
          <Button variant="glow" size="md" rightIcon={<ChevronRight className="h-4 w-4" />}>
            Start Interview
          </Button>
        </Link>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {historyLoading ? (
          Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatsCard
              title="Interviews Done"
              value={historyData?.total || 0}
              description="Total sessions completed"
              icon={<BarChart2 className="h-5 w-5" />}
              color="purple"
              index={0}
            />
            <StatsCard
              title="Average Score"
              value={Math.round((historyData as any)?.stats?.averageScore || 0)}
              suffix="/100"
              description="Across all interviews"
              icon={<Trophy className="h-5 w-5" />}
              color="cyan"
              index={1}
            />
            <StatsCard
              title="Practice Time"
              value={Math.round(((historyData as any)?.stats?.totalPracticeTime || 0) / 60)}
              suffix="m"
              description="Total time invested"
              icon={<Clock className="h-5 w-5" />}
              color="emerald"
              index={2}
            />
            <StatsCard
              title="Current Streak"
              value={(historyData as any)?.stats?.streak || 0}
              suffix={(historyData as any)?.stats?.streak === 1 ? ' day' : ' days'}
              description="Consecutive days practicing"
              icon={<Flame className="h-5 w-5" />}
              color="yellow"
              index={3}
            />
          </>
        )}
      </div>

      {/* Main content */}
      <div className="mb-6">
        <ScoreChart data={scoreData?.history} />
      </div>

      {/* Quick Start CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -15, 0] }}
        transition={{ 
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          opacity: { delay: 0.7, duration: 0.5 }
        }}
        className="mt-6 rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 via-purple-500/5 to-cyan-500/5 backdrop-blur-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-glow-purple">
            <Mic2 className="h-6 w-6 text-lavender-950" />
          </div>
          <div>
            <p className="text-lavender-950 font-semibold">Ready for your next interview?</p>
            <p className="text-sm text-gray-600">AI-powered questions tailored to your {user.targetRole || 'target role'}</p>
          </div>
        </div>
        <Link href="/interview/setup">
          <Button variant="glow" size="md">
            Practice Now <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
