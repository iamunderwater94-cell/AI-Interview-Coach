'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Brain,
  Mic2,
  BarChart3,
  Shield,
  Star,
  ChevronRight,
  CheckCircle2,
  Zap,
  Target,
  TrendingUp,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Feedback',
    description: 'Get instant, detailed analysis on technical accuracy, grammar, and communication clarity after every answer.',
    color: 'from-brand-500/20 to-purple-500/10',
    iconColor: 'text-brand-600',
    border: 'border-brand-500/20',
  },
  {
    icon: Mic2,
    title: 'Voice & Text Answers',
    description: 'Practice naturally by speaking your answers aloud with real-time audio waveform visualization, or type them out.',
    color: 'from-cyan-500/20 to-blue-500/10',
    iconColor: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Track your improvement over time with beautiful charts showing score trends across Technical, Grammar, and Clarity metrics.',
    color: 'from-emerald-500/20 to-green-500/10',
    iconColor: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  {
    icon: Target,
    title: 'Role-Specific Practice',
    description: 'Get questions tailored to your target role — Software Engineer, Product Manager, Data Scientist and more.',
    color: 'from-orange-500/20 to-yellow-500/10',
    iconColor: 'text-orange-400',
    border: 'border-orange-500/20',
  },
  {
    icon: Zap,
    title: 'Gamification & XP',
    description: 'Earn XP, level up, and unlock achievement badges as you practice. Stay motivated with streaks and leaderboards.',
    color: 'from-yellow-500/20 to-amber-500/10',
    iconColor: 'text-yellow-400',
    border: 'border-yellow-500/20',
  },
  {
    icon: TrendingUp,
    title: 'Personalized Practice',
    description: 'AI identifies your weak areas and recommends targeted practice modules with curated learning resources.',
    color: 'from-pink-500/20 to-rose-500/10',
    iconColor: 'text-pink-400',
    border: 'border-pink-500/20',
  },
]

const stats = [
  { value: '10K+', label: 'Interviews Practiced' },
  { value: '95%', label: 'User Satisfaction' },
  { value: '3x', label: 'Faster Improvement' },
  { value: '50+', label: 'Target Roles' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-lavender-50">
      {/* Background mesh */}
      <div className="absolute inset-0 mesh-bg pointer-events-none" />
      <div className="absolute inset-0 noise-bg pointer-events-none" />

      {/* Animated orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '0.75s' }} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.06] backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-glow-purple">
            <Brain className="h-5 w-5 text-lavender-950" />
          </div>
          <span className="font-bold text-lavender-950 text-lg">AI Interview <span className="gradient-text">Coach</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button variant="glow" size="sm">
              Get Started <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-20 pb-32 px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-700 mb-8 backdrop-blur-sm"
          >
            <Zap className="h-3.5 w-3.5 text-brand-600" />
            Powered by Advanced AI — Get interview-ready faster
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-lavender-950 mb-6 leading-tight text-balance">
            Ace Every Interview with{' '}
            <span className="gradient-text">AI-Powered</span>{' '}
            Coaching
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto text-balance">
            Practice with real interview questions, get instant AI feedback on your answers, and track your progress to confidently land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button variant="glow" size="xl" className="min-w-48">
                Start Practicing Free
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="xl" className="min-w-40">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-500">
            {['No credit card required', 'Free to get started', 'Instant AI feedback'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Hero visual: mock interview card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-brand-500/10 bg-white/60 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-gray-500">Interview Session • Software Engineer</span>
            </div>
            <div className="p-6 text-left space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-600 font-semibold uppercase tracking-wide">Question 3 of 10</span>
                  <div className="flex-1 h-1 bg-brand-500/5 rounded-full">
                    <div className="h-full w-[30%] bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full" />
                  </div>
                </div>
                <p className="text-lavender-950 text-lg font-medium">
                  Explain the difference between <span className="text-brand-700">REST</span> and <span className="text-cyan-300">GraphQL</span>. When would you choose one over the other?
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-semibold">Recording...</span>
                  <span className="text-xs text-gray-500 ml-auto">0:32</span>
                </div>
                <div className="flex items-end gap-1 h-10">
                  {[0.3,0.6,0.9,0.7,1,0.8,0.5,0.4,0.7,0.9,0.6,0.4,0.8,1,0.7,0.5,0.6,0.8,0.4,0.3].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-gradient-to-t from-brand-600 to-brand-400 audio-bar"
                      style={{ height: `${h * 100}%`, animationDelay: `${i * 0.05}s` }}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Technical', score: 87, color: 'text-emerald-400' },
                  { label: 'Grammar', score: 92, color: 'text-cyan-400' },
                  { label: 'Clarity', score: 78, color: 'text-yellow-400' },
                ].map(({ label, score, color }) => (
                  <div key={label} className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-3 text-center">
                    <div className={`text-2xl font-bold ${color}`}>{score}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] backdrop-blur-sm py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map(({ value, label }) => (
            <motion.div key={label} variants={itemVariants}>
              <div className="text-3xl md:text-4xl font-bold gradient-text">{value}</div>
              <div className="text-sm text-gray-600 mt-1">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-lavender-950 mb-4">
              Everything you need to{' '}
              <span className="gradient-text">land the job</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A complete AI-powered interview preparation platform built for serious candidates.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map(({ icon: Icon, title, description, color, iconColor, border }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className={`rounded-2xl border ${border} bg-gradient-to-br ${color} backdrop-blur-sm p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}
              >
                <div className={`h-11 w-11 rounded-xl bg-brand-500/5 border border-brand-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <h3 className="text-lavender-950 font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 to-cyan-500/5 backdrop-blur-xl p-12">
            <Award className="h-12 w-12 text-brand-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-lavender-950 mb-4">
              Ready to ace your next interview?
            </h2>
            <p className="text-gray-600 mb-8">
              Join thousands of candidates who have improved their interview performance with AI-powered coaching.
            </p>
            <Link href="/register">
              <Button variant="glow" size="xl" className="min-w-56">
                Start Free Today
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-6 text-center text-sm text-gray-500">
        <p>© 2024 AI Interview Coach. Built to help you succeed.</p>
      </footer>
    </main>
  )
}
