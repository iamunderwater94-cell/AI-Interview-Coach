'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BarChart2, Clock, ChevronRight } from 'lucide-react'
import type { Interview } from '@/types/interview'
import { formatDate, getScoreColor, getDifficultyColor } from '@/lib/utils/format'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'

// Mock data fallback
const MOCK_INTERVIEWS: Partial<Interview>[] = [
  { id: '1', role: 'Software Engineer', difficulty: 'medium', overallScore: 82, startedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', role: 'Product Manager', difficulty: 'hard', overallScore: 74, startedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: '3', role: 'Frontend Developer', difficulty: 'easy', overallScore: 91, startedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
]

interface RecentInterviewsProps {
  interviews?: Interview[]
}

export function RecentInterviews({ interviews }: RecentInterviewsProps) {
  const router = useRouter()
  const data = (interviews && interviews.length > 0 ? interviews : MOCK_INTERVIEWS) as Interview[]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-lavender-950">Recent Interviews</h3>
        <button
          onClick={() => router.push('/history')}
          className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
        >
          View all <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {data.slice(0, 4).map((interview, i) => (
          <motion.div
            key={interview.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            onClick={() => router.push(`/interview/${interview.id}/report`)}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-brand-500/10 cursor-pointer transition-all duration-200 group"
          >
            <div className="h-9 w-9 rounded-xl bg-brand-500/15 flex items-center justify-center flex-shrink-0">
              <BarChart2 className="h-4.5 w-4.5 text-brand-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-lavender-950 truncate">{interview.role}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-500">{formatDate(interview.startedAt)}</span>
              </div>
            </div>
            <Badge variant={interview.difficulty as any}>{interview.difficulty}</Badge>
            <div className={cn('text-lg font-bold ml-1', getScoreColor(interview.overallScore || 0))}>
              {interview.overallScore}
            </div>
            <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-600 transition-colors flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
