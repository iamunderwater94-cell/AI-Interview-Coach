'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BookOpen, Clock, ChevronRight, Target, Zap, Brain } from 'lucide-react'
import { interviewApi } from '@/lib/api/interview'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils/cn'
import type { PracticeModule } from '@/types/interview'

const MOCK_MODULES: PracticeModule[] = [
  { id: '1', title: 'System Design Fundamentals', description: 'Master distributed systems, databases, and scalability concepts for senior roles.', category: 'Technical', difficulty: 'hard', estimatedTime: '45 min', questionCount: 10, weaknessArea: 'Architecture' },
  { id: '2', title: 'Behavioral STAR Method', description: 'Practice structuring behavioral answers using the Situation-Task-Action-Result framework.', category: 'Behavioral', difficulty: 'easy', estimatedTime: '25 min', questionCount: 8, weaknessArea: 'Communication' },
  { id: '3', title: 'Data Structures & Algorithms', description: 'Cover arrays, trees, graphs, and dynamic programming with interview-style problems.', category: 'Technical', difficulty: 'medium', estimatedTime: '60 min', questionCount: 15, weaknessArea: 'Technical Accuracy' },
  { id: '4', title: 'Communication & Clarity', description: 'Improve how you structure and deliver clear, concise answers under pressure.', category: 'Communication', difficulty: 'easy', estimatedTime: '20 min', questionCount: 6, weaknessArea: 'Clarity' },
  { id: '5', title: 'Leadership & Management', description: 'Practice scenarios around team leadership, conflict resolution, and stakeholder management.', category: 'Behavioral', difficulty: 'medium', estimatedTime: '35 min', questionCount: 8, weaknessArea: 'Leadership' },
  { id: '6', title: 'SQL & Database Design', description: 'Cover joins, indexes, normalization, and query optimization for data roles.', category: 'Technical', difficulty: 'medium', estimatedTime: '40 min', questionCount: 12, weaknessArea: 'SQL' },
]

const CATEGORIES = ['All', 'Technical', 'Behavioral', 'Communication']

const categoryIcons: Record<string, React.ReactNode> = {
  Technical: <Brain className="h-4 w-4" />,
  Behavioral: <Target className="h-4 w-4" />,
  Communication: <Zap className="h-4 w-4" />,
}

export default function PracticePage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All')

  const { data, isLoading } = useQuery({
    queryKey: ['practice-modules'],
    queryFn: () => interviewApi.getPracticeModules(),
  })

  const modules: PracticeModule[] = (data?.modules && data.modules.length > 0)
    ? data.modules
    : MOCK_MODULES

  const filtered = activeCategory === 'All'
    ? modules
    : modules.filter((m) => m.category === activeCategory)

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-lavender-950 mb-1">Practice Modules</h1>
        <p className="text-gray-600 text-sm">Targeted practice based on your weak areas and goals.</p>
      </motion.div>

      {/* Category filter pills */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200',
              activeCategory === cat
                ? 'bg-brand-500/20 border-brand-500/40 text-brand-700'
                : 'bg-brand-500/5 border-brand-500/10 text-gray-600 hover:text-lavender-950 hover:bg-brand-500/10'
            )}
          >
            {categoryIcons[cat] || <BookOpen className="h-4 w-4" />}
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Modules grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {filtered.map((module, i) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-5 hover:bg-white/[0.07] hover:border-brand-500/20 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-lavender-950 group-hover:text-brand-700 transition-colors">{module.title}</h3>
                <Badge variant={module.difficulty as any}>{module.difficulty}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{module.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {module.estimatedTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    {module.questionCount} questions
                  </span>
                </div>
                <Badge variant="ghost" className="text-[10px]">{module.category}</Badge>
              </div>

              {module.weaknessArea && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-gray-500">Targets: <span className="text-orange-400">{module.weaknessArea}</span></span>
                  <button
                    onClick={() => router.push(`/interview/setup`)}
                    className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
                  >
                    Start <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
