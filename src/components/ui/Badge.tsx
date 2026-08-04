import { cn } from '@/lib/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-brand-500/20 border-brand-500/30 text-brand-700',
        success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
        warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
        danger: 'bg-red-500/20 border-red-500/30 text-red-300',
        info: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
        ghost: 'bg-brand-500/5 border-brand-500/10 text-gray-600',
        easy: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
        medium: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
        hard: 'bg-red-500/20 border-red-500/30 text-red-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}
