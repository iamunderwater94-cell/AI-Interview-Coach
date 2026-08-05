import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0a0f1e',
}

export const metadata: Metadata = {
  title: {
    default: 'AI Interview Coach — Ace Your Next Interview',
    template: 'AI Interview Coach | %s',
  },
  description:
    'Practice interviews with AI-powered feedback. Get real-time scores on technical knowledge, grammar, and clarity to land your dream job.',
  keywords: ['interview', 'AI', 'practice', 'coaching', 'job prep', 'mock interview'],
  openGraph: {
    title: 'AI Interview Coach',
    description: 'Practice interviews with AI-powered feedback.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AuthGuard>
              {children}
            </AuthGuard>
          </Providers>
        </ThemeProvider>
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgba(13,20,36,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f1f5f9',
              backdropFilter: 'blur(16px)',
            },
          }}
        />
      </body>
    </html>
  )
}
