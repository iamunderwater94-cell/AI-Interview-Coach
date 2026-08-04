import { cn } from '@/lib/utils/cn'

interface ProgressProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animated?: boolean
}

const trackColors: Record<string, string> = {
  default: 'bg-brand-500/10',
  brand: 'bg-brand-900/50',
  success: 'bg-emerald-900/50',
  warning: 'bg-yellow-900/50',
  danger: 'bg-red-900/50',
  gradient: 'bg-brand-500/10',
}

const fillColors: Record<string, string> = {
  default: 'bg-gray-400',
  brand: 'bg-gradient-to-r from-brand-500 to-brand-400',
  success: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
  warning: 'bg-gradient-to-r from-yellow-600 to-yellow-400',
  danger: 'bg-gradient-to-r from-red-600 to-red-400',
  gradient: 'bg-gradient-to-r from-brand-500 via-purple-500 to-cyan-500',
}

const heights: Record<string, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'brand',
  size = 'md',
  className,
  animated = false,
}: ProgressProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-gray-600">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-lavender-950">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={cn('w-full rounded-full overflow-hidden', heights[size], trackColors[variant])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            fillColors[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
