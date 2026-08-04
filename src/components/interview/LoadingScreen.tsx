'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain } from 'lucide-react'

const TIPS = [
  'Structuring your answers using the STAR method increases clarity scores by 40%...',
  'Taking a 3-second pause before answering shows composure and thoughtfulness...',
  'Quantifying your achievements with numbers makes answers 3x more memorable...',
  'Active listening and asking clarifying questions demonstrates senior-level thinking...',
  'Matching the interviewer\'s vocabulary shows cultural fit and communication skills...',
]

const STAGES = [
  'Initializing AI model...',
  'Analyzing your profile...',
  'Crafting personalized questions...',
  'Calibrating difficulty...',
  'Preparing your session...',
]

interface LoadingScreenProps {
  role: string
  difficulty: string
}

export function LoadingScreen({ role, difficulty }: LoadingScreenProps) {
  const [stage, setStage] = useState(0)
  const [tip, setTip] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1))
    }, 700)
    const tipTimer = setInterval(() => {
      setTip((t) => (t + 1) % TIPS.length)
    }, 3000)
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(p + 1.5, 95))
    }, 60)

    return () => {
      clearInterval(stageTimer)
      clearInterval(tipTimer)
      clearInterval(progressTimer)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-lavender-50 flex items-center justify-center z-50">
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative text-center max-w-md px-6">
        {/* Pulsing brain icon */}
        <div className="relative mx-auto mb-8 w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-2 rounded-full bg-brand-500/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
          <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-purple">
            <Brain className="h-12 w-12 text-lavender-950" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-lavender-950 mb-2">
          Preparing your interview
        </h2>
        <p className="text-gray-600 text-sm mb-8">
          <span className="text-brand-700 font-medium">{role}</span> · {difficulty} difficulty
        </p>

        {/* Progress bar */}
        <div className="h-1.5 bg-brand-500/5 rounded-full mb-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-cyan-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Stage text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={stage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-gray-600 mb-8 h-5"
          >
            {STAGES[Math.min(stage, STAGES.length - 1)]}
          </motion.p>
        </AnimatePresence>

        {/* Tip card */}
        <div className="rounded-xl border border-brand-500/20 bg-brand-500/[0.07] p-4">
          <p className="text-xs text-brand-700 font-medium mb-2 uppercase tracking-wide">💡 Pro Tip</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={tip}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-sm text-gray-600 leading-relaxed"
            >
              {TIPS[tip]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
