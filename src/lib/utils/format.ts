export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

export function formatScore(score: number): string {
  return `${Math.round(score)}/100`
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-yellow-400'
  return 'text-red-400'
}

export function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-400/20 border-emerald-400/30'
  if (score >= 60) return 'bg-yellow-400/20 border-yellow-400/30'
  return 'bg-red-400/20 border-red-400/30'
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20'
    default: return 'text-gray-600 bg-gray-400/10 border-gray-400/20'
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function calculateLevel(xp: number): { level: number; xpInLevel: number; xpForNext: number } {
  const baseXP = 100
  let level = 1
  let totalXP = 0
  while (totalXP + baseXP * level <= xp) {
    totalXP += baseXP * level
    level++
  }
  const xpInLevel = xp - totalXP
  const xpForNext = baseXP * level
  return { level, xpInLevel, xpForNext }
}
