'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, Calendar, ChevronRight, BarChart2, Loader2, Filter } from 'lucide-react'
import { interviewApi } from '@/lib/api/interview'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { formatDate, getScoreColor, getDifficultyColor } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { Interview } from '@/types/interview'

// Removed mock interviews to prevent un-clickable cards
export default function HistoryPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['interview-history', page],
    queryFn: () => interviewApi.getHistory(page, 10),
  })

  const interviews: Interview[] = data?.interviews || []
  const filtered = interviews.filter((i) =>
    i.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-lavender-950 mb-1">Interview History</h1>
        <p className="text-gray-600 text-sm">Review all your past interview sessions and scores.</p>
      </motion.div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-500/10 bg-brand-500/5 text-sm text-lavender-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 backdrop-blur-sm"
          />
        </div>
        <Button variant="secondary" size="md" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>
      </motion.div>

      {/* Interviews grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <BarChart2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">No interviews found.</p>
          <Button variant="glow" className="mt-4" onClick={() => router.push('/interview/setup')}>Start your first interview</Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {filtered.map((interview, i) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/interview/${interview.id}/report`)}
              className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-5 hover:bg-white/[0.07] hover:border-brand-500/20 hover:-translate-y-0.5 cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lavender-950 truncate">{interview.role}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(interview.startedAt)}
                  </div>
                </div>
                <div className={cn('text-2xl font-bold flex-shrink-0', getScoreColor(interview.overallScore || 0))}>
                  {interview.overallScore ? Math.round(interview.overallScore) : '--'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant={interview.difficulty as any}>{interview.difficulty}</Badge>
                  <Badge variant="ghost">{interview.experience}</Badge>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-gray-600 transition-colors" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm text-gray-600">Page {page} of {data.pages}</span>
          <Button variant="secondary" size="sm" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
    </div>
  )
}
