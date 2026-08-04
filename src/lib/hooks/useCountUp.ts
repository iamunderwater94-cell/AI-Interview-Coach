'use client'
import { useEffect, useRef, useState } from 'react'

export function useCountUp(end: number, duration = 1500, start = 0) {
  const [count, setCount] = useState(start)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const startTime = performance.now()
    const range = end - start

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(start + range * eased))
      if (progress < 1) {
        raf.current = requestAnimationFrame(step)
      }
    }

    raf.current = requestAnimationFrame(step)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [end, start, duration])

  return count
}
