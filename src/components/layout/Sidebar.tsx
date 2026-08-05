'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Mic2,
  History,
  BookOpen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  User,
  Settings,
  Trophy,
  Menu,
  X,
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils/cn'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/lib/api/auth'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Progress } from '@/components/ui/Progress'
import { getInitials } from '@/lib/utils/format'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/interview/setup', icon: Mic2, label: 'New Interview' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/achievements', icon: Trophy, label: 'Achievements' },
  { href: '/practice', icon: BookOpen, label: 'Practice' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const queryClient = useQueryClient()
  const [collapsed, setCollapsed] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await authApi.logout()
    logout()
    queryClient.clear()
    router.push('/login')
  }

  const xpPct = user ? (user.xp / user.xpToNextLevel) * 100 : 0

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-950 border-b border-white/[0.06] shrink-0 z-40">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="font-bold text-lavender-950 text-sm">AI Coach</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -mr-2 text-gray-600 hover:text-lavender-950 hover:bg-black/5 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-950 border-r border-white/[0.06] shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <Logo size={36} />
                  <div>
                    <span className="font-bold text-lavender-950 text-sm whitespace-nowrap">AI Interview</span>
                    <span className="block text-[10px] text-brand-600 font-medium whitespace-nowrap">Coach</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-gray-500 hover:text-lavender-950 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map(({ href, icon: Icon, label }) => {
                  const isActive = pathname === href || pathname.startsWith(href + '/')
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-brand-500/15 text-brand-700 border border-brand-500/20'
                          : 'text-gray-600 hover:text-lavender-950 hover:bg-brand-500/5'
                      )}
                    >
                      <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-brand-600' : '')} />
                      <span>{label}</span>
                    </Link>
                  )
                })}
                
                <div className="pt-2 mt-2 border-t border-white/[0.06] dark:border-white/[0.02]">
                  <ThemeToggle collapsed={false} />
                </div>
              </nav>

              {user && (
                <div className="px-3 pb-6 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-sm font-bold text-lavender-950">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-lavender-950 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="hidden md:flex relative flex-col h-screen bg-lavender-50 border-r border-white/[0.06] flex-shrink-0 overflow-hidden"
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <Logo size={36} />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="font-bold text-lavender-950 text-sm whitespace-nowrap">AI Interview</span>
              <span className="block text-[10px] text-brand-600 font-medium whitespace-nowrap">Coach</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                isActive
                  ? 'bg-brand-500/15 text-brand-700 border border-brand-500/20'
                  : 'text-gray-600 hover:text-lavender-950 hover:bg-brand-500/5'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-xl bg-brand-500/10"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <Icon className={cn('h-5 w-5 flex-shrink-0 relative z-10', isActive ? 'text-brand-600' : '')} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="relative z-10 whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
        
        <div className="pt-2 mt-2 border-t border-white/[0.06] dark:border-white/[0.02]">
          <ThemeToggle collapsed={collapsed} />
        </div>
      </nav>

      {/* User section */}
      {user && (
        <div className="px-3 pb-4 space-y-2 border-t border-white/[0.06] pt-4">
          {/* XP Bar */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-1 mb-3"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs text-gray-600">Level {user.level || 1}</span>
                  </div>
                  <span className="text-xs text-gray-500">{user.xp || 0}/{user.xpToNextLevel || 1000} XP</span>
                </div>
                <Progress value={xpPct} size="sm" variant="gradient" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Avatar + Name + Logout */}
          <div className={cn('flex items-center gap-3 px-2 py-2', collapsed ? 'flex-col justify-center' : '')}>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-lavender-950">
              {getInitials(user.name)}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-medium text-lavender-950 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                  >
                    <LogOut className="h-4 w-4" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>
            {collapsed && (
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-2"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}


      </motion.aside>
    </>
  )
}
