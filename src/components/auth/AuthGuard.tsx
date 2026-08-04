'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/']

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '?'))

    if (!isAuthenticated && !isPublic) {
      router.replace('/login')
      return
    }

    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      router.replace('/dashboard')
      return
    }
  }, [isAuthenticated, pathname, router, user])

  return <>{children}</>
}
