import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 36 }: LogoProps) {
  return (
    <div 
      className={cn("relative flex-shrink-0 rounded-xl overflow-hidden shadow-glow-cyan transition-transform duration-300 hover:scale-105", className)}
      style={{ width: size, height: size }}
    >
      <Image 
        src="/AI_Brain.png" 
        alt="AI Interview Coach Logo" 
        fill
        className="object-cover"
        sizes={`${size}px`}
        priority
      />
    </div>
  )
}
