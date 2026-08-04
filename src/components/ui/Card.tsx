import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const cardVariants = cva(
  'rounded-2xl border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-brand-500/5 border-brand-500/10 backdrop-blur-sm',
        glass: 'bg-white/[0.03] border-white/[0.07] backdrop-blur-xl shadow-glass',
        elevated: 'bg-white/80/80 border-brand-500/10 backdrop-blur-xl shadow-xl',
        gradient:
          'bg-gradient-to-br from-brand-500/10 to-cyan-500/5 border-brand-500/20 backdrop-blur-xl',
        glow: 'bg-brand-500/5 border-brand-500/30 backdrop-blur-xl shadow-glow-purple',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hoverable: {
        true: 'hover:-translate-y-1 hover:border-brand-500/20 hover:shadow-lg cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hoverable: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hoverable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, hoverable, className }))}
      {...props}
    />
  )
)

Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold text-lavender-950', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-600', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

export { Card, CardHeader, CardTitle, CardDescription, cardVariants }
