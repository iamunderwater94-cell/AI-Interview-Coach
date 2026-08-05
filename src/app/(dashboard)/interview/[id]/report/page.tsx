'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  CheckCircle2, XCircle, TrendingUp, ExternalLink,
  BarChart2, Download, RotateCcw, Home, Loader2
} from 'lucide-react'
import { interviewApi } from '@/lib/api/interview'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { formatDate, getScoreColor, getScoreBg, getDifficultyColor } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { Interview } from '@/types/interview'

interface ScoreDialProps {
  score: number
  size?: number
}

function ScoreDial({ score, size = 160 }: ScoreDialProps) {
  const radius = (size / 2) - 14
  const circumference = 2 * Math.PI * radius
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    let frame: number
    const start = performance.now()
    const duration = 1500
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(score * eased))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const strokePct = (displayed / 100) * circumference
  const color = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${strokePct} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.1s linear', filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-4xl font-bold', getScoreColor(score))}>{displayed}</span>
        <span className="text-xs text-gray-600 mt-0.5">/ 100</span>
      </div>
    </div>
  )
}

export default function InterviewReportPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const { data, isLoading, error } = useQuery({
    queryKey: ['interview', params.id],
    queryFn: () => interviewApi.getById(params.id),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lavender-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lavender-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Failed to load report.</p>
          <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  const { interview } = data
  const score = interview.overallScore || 0
  const evaluations = interview.evaluations || []

  const avgTech = evaluations.length ? Math.round(evaluations.reduce((a, e) => a + e.technicalScore, 0) / evaluations.length) : 0
  const avgGrammar = evaluations.length ? Math.round(evaluations.reduce((a, e) => a + e.grammarScore, 0) / evaluations.length) : 0
  const avgClarity = evaluations.length ? Math.round(evaluations.reduce((a, e) => a + e.clarityScore, 0) / evaluations.length) : 0

  const allStrengths = Array.from(new Set(evaluations.flatMap((e) => e.strengths))).slice(0, 5)
  const allWeaknesses = Array.from(new Set(evaluations.flatMap((e) => e.weaknesses))).slice(0, 5)
  const suggestions = interview.insights?.suggestions || []
  const topics = interview.insights?.recommendedTopics || []

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-lavender-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-lavender-950">Interview Report</h1>
            <p className="text-gray-600 mt-1 text-sm">
              {interview.role} · {formatDate(interview.startedAt)} · <span className="capitalize">{interview.difficulty}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" leftIcon={<Home className="h-4 w-4" />} onClick={() => router.push('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="outline" size="sm" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => router.push('/interview/setup')}>
              Retry
            </Button>
          </div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          {/* Score hero */}
          <motion.div variants={itemVariants} className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex flex-col items-center gap-3">
                <ScoreDial score={score} />
                <Badge variant={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger'} className="px-4 py-1 text-sm">
                  {score >= 85 ? '🏆 Excellent' : score >= 70 ? '👍 Good' : score >= 55 ? '📈 Fair' : '💪 Keep Practicing'}
                </Badge>
              </div>

              <div className="flex-1 w-full space-y-4">
                <h3 className="text-lg font-semibold text-lavender-950 mb-4">Score Breakdown</h3>
                {[
                  { label: 'Technical Accuracy', score: avgTech, variant: 'brand' },
                  { label: 'Grammar & Language', score: avgGrammar, variant: 'success' },
                  { label: 'Clarity & Structure', score: avgClarity, variant: 'warning' },
                ].map(({ label, score: s, variant }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-gray-600">{label}</span>
                      <span className={cn('text-sm font-bold', getScoreColor(s))}>{s}/100</span>
                    </div>
                    <Progress value={s} variant={variant as any} size="md" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Strengths */}
            <motion.div variants={itemVariants} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-lavender-950">Strong Areas</h3>
              </div>
              {allStrengths.length > 0 ? (
                <ul className="space-y-2.5">
                  {allStrengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-sm text-gray-600">{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Complete more questions to see patterns.</p>
              )}
            </motion.div>

            {/* Weaknesses */}
            <motion.div variants={itemVariants} className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-5 w-5 text-red-400" />
                <h3 className="text-lg font-semibold text-lavender-950">Areas to Improve</h3>
              </div>
              {allWeaknesses.length > 0 ? (
                <ul className="space-y-2.5">
                  {allWeaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-red-400" />
                      </div>
                      <span className="text-sm text-gray-600">{w}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Keep practicing for personalized feedback.</p>
              )}
            </motion.div>
          </div>

          {/* Q&A Breakdown */}
          {evaluations.length > 0 && (
            <motion.div variants={itemVariants} className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart2 className="h-5 w-5 text-brand-600" />
                <h3 className="text-lg font-semibold text-lavender-950">Question Breakdown</h3>
              </div>
              <div className="space-y-4">
                {evaluations.map((ev, i) => {
                  const q = interview.questions?.[i]
                  return (
                    <div key={ev.questionId} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <p className="text-sm text-gray-600 flex-1 font-medium">{q?.text || `Question ${i + 1}`}</p>
                        <span className={cn('text-lg font-bold flex-shrink-0', getScoreColor(ev.overallScore))}>
                          {ev.overallScore}
                        </span>
                      </div>
                      
                      {ev.userAnswer && (
                        <div className="mb-4 p-3 rounded-lg bg-brand-500/5 border border-brand-500/10">
                          <p className="text-xs font-semibold text-lavender-950 mb-1">Your Answer:</p>
                          <p className="text-sm text-gray-700 italic">"{ev.userAnswer}"</p>
                        </div>
                      )}

                      {ev.improvedAnswer && (
                        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 mb-1">Ideal/Correct Answer:</p>
                          <p className="text-sm text-emerald-800 dark:text-emerald-100">{ev.improvedAnswer}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Technical', score: ev.technicalScore },
                          { label: 'Grammar', score: ev.grammarScore },
                          { label: 'Clarity', score: ev.clarityScore },
                        ].map(({ label, score: s }) => (
                          <div key={label} className={cn('text-center p-2 rounded-lg border text-xs', getScoreBg(s))}>
                            <div className={cn('font-bold text-base', getScoreColor(s))}>{s}</div>
                            <div className="text-gray-600">{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Recommendations */}
          {topics.length > 0 && (
            <motion.div variants={itemVariants} className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.05] backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-lavender-950">Recommended Learning</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topics.map((topic) => (
                  <a
                    key={topic.id}
                    href={topic.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.07] hover:border-cyan-500/20 transition-all group"
                  >
                    <div>
                      <p className="text-sm font-medium text-lavender-950 group-hover:text-cyan-300 transition-colors">{topic.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{topic.estimatedTime}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-cyan-400 flex-shrink-0 ml-auto mt-0.5 transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
            <Button variant="glow" size="lg" className="flex-1" onClick={() => router.push('/interview/setup')} leftIcon={<RotateCcw className="h-4 w-4" />}>
              Practice Again
            </Button>
            <Button variant="secondary" size="lg" className="flex-1" onClick={() => router.push('/practice')} leftIcon={<TrendingUp className="h-4 w-4" />}>
              Targeted Practice
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
