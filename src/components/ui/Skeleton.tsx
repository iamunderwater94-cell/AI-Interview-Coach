import { cn } from '@/lib/utils/cn'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circle' | 'text'
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-shimmer',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'rounded-md h-4',
        variant === 'default' && 'rounded-xl',
        className
      )}
      {...props}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-brand-500/10 bg-brand-500/5 p-6 space-y-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="h-10 w-10" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-1/3" />
          <Skeleton variant="text" className="w-1/2 h-3" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-brand-500/10 bg-brand-500/5 p-6 space-y-3 backdrop-blur-sm">
      <Skeleton variant="circle" className="h-10 w-10" />
      <Skeleton variant="text" className="w-1/3 h-8" />
      <Skeleton variant="text" className="w-1/2 h-3" />
    </div>
  )
}
