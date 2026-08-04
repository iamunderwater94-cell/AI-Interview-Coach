'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, ChevronRight, Star } from 'lucide-react'
import type { Evaluation } from '@/types/interview'
import { Progress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/Button'

interface FeedbackOverlayProps {
  evaluation: Evaluation
  isLastQuestion: boolean
  onNext: () => void
}

const scoreVariant = (score: number) =>
  score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger'

const scoreLabel = (score: number) =>
  score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 55 ? 'Fair' : 'Needs Work'

export function FeedbackOverlay({ evaluation, isLastQuestion, onNext }: FeedbackOverlayProps) {
  const metrics = [
    { label: 'Technical Accuracy', score: evaluation.technicalScore, variant: scoreVariant(evaluation.technicalScore) },
    { label: 'Grammar & Language', score: evaluation.grammarScore, variant: scoreVariant(evaluation.grammarScore) },
    { label: 'Clarity & Structure', score: evaluation.clarityScore, variant: scoreVariant(evaluation.clarityScore) },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="rounded-2xl border border-brand-500/10 bg-white/80/80 backdrop-blur-xl p-6 space-y-5"
      >
        {/* Overall score */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-brand-500/10 to-cyan-500/5 border border-brand-500/20">
          <div className="relative h-16 w-16 flex-shrink-0">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="26"
                fill="none"
                stroke="url(#scoreGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(evaluation.overallScore / 100) * 163.4} 163.4`}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-lavender-950">{evaluation.overallScore}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-lavender-950">{scoreLabel(evaluation.overallScore)}</span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">Overall performance</p>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-600">Score Breakdown</h4>
          {metrics.map(({ label, score, variant }) => (
            <div key={label}>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-gray-600">{label}</span>
                <span className="text-xs font-semibold text-lavender-950">{score}/100</span>
              </div>
              <Progress value={score} variant={variant as any} size="sm" />
            </div>
          ))}
        </div>

        {/* Feedback text */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-3">
          <p className="text-sm text-gray-600 leading-relaxed">{evaluation.feedback}</p>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Strengths
            </p>
            <ul className="space-y-1">
              {evaluation.strengths.slice(0, 3).map((s, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="text-emerald-400 mt-0.5">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-red-400 mb-2 flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5" /> Improve
            </p>
            <ul className="space-y-1">
              {evaluation.weaknesses.slice(0, 3).map((w, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="text-red-400 mt-0.5">•</span> {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <Button
          variant="glow"
          size="md"
          className="w-full"
          onClick={onNext}
          rightIcon={<ChevronRight className="h-4 w-4" />}
        >
          {isLastQuestion ? 'View Final Report' : 'Next Question'}
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}
