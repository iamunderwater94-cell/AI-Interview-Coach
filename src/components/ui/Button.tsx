import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-brand-500 to-brand-600 text-lavender-950 shadow-lg shadow-brand-500/25 hover:from-brand-400 hover:to-brand-500 hover:shadow-brand-500/40 hover:-translate-y-0.5',
        secondary:
          'bg-brand-500/5 border border-brand-500/10 text-lavender-950 hover:bg-brand-500/10 hover:border-brand-500/20 hover:-translate-y-0.5 backdrop-blur-sm',
        ghost:
          'text-gray-600 hover:text-lavender-950 hover:bg-brand-500/5 rounded-xl',
        danger:
          'bg-gradient-to-r from-red-600 to-red-700 text-lavender-950 shadow-lg shadow-red-500/25 hover:from-red-500 hover:to-red-600 hover:-translate-y-0.5',
        outline:
          'border border-brand-400 text-brand-600 hover:bg-brand-500/10 hover:border-brand-500 hover:-translate-y-0.5',
        glow:
          'bg-gradient-to-r from-brand-500 to-cyan-500 text-lavender-950 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5',
      },
      size: {
        xs: 'h-7 px-3 text-xs',
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "disabled">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  disabled?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.90 }}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
export { Button, buttonVariants }
