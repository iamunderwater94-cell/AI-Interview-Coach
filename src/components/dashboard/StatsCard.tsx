'use client'
import { motion } from 'framer-motion'
import { useCountUp } from '@/lib/hooks/useCountUp'
import { cn } from '@/lib/utils/cn'

interface StatsCardProps {
  title: string
  value: number
  suffix?: string
  prefix?: string
  description: string
  icon: React.ReactNode
  color: 'purple' | 'cyan' | 'emerald' | 'yellow'
  index?: number
}

const colorMap = {
  purple: {
    icon: 'bg-brand-500/20 text-brand-600',
    glow: 'hover:shadow-glow-purple',
    border: 'hover:border-brand-500/30',
    value: 'text-brand-700',
  },
  cyan: {
    icon: 'bg-cyan-500/20 text-cyan-400',
    glow: 'hover:shadow-glow-cyan',
    border: 'hover:border-cyan-500/30',
    value: 'text-cyan-300',
  },
  emerald: {
    icon: 'bg-emerald-500/20 text-emerald-400',
    glow: '',
    border: 'hover:border-emerald-500/30',
    value: 'text-emerald-300',
  },
  yellow: {
    icon: 'bg-yellow-500/20 text-yellow-400',
    glow: '',
    border: 'hover:border-yellow-500/30',
    value: 'text-yellow-300',
  },
}

export function StatsCard({ title, value, suffix = '', prefix = '', description, icon, color, index = 0 }: StatsCardProps) {
  const displayValue = useCountUp(value)
  const c = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.05 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        'rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-6 transition-all duration-300',
        c.glow,
        c.border,
        'hover:-translate-y-1 hover:bg-white/[0.06]'
      )}
    >
      <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center mb-4', c.icon)}>
        {icon}
      </div>
      <div className={cn('text-3xl font-bold mb-1', c.value)}>
        {prefix}{displayValue}{suffix}
      </div>
      <div className="text-sm font-medium text-lavender-950 mb-0.5">{title}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </motion.div>
  )
}
