'use client'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { motion } from 'framer-motion'
import type { ScoreHistory } from '@/types/interview'
import { TrendingUp } from 'lucide-react'

// Mock data for fallback
const MOCK_DATA: ScoreHistory[] = [
  { date: 'Jul 1', score: 58, role: 'SWE' },
  { date: 'Jul 5', score: 63, role: 'SWE' },
  { date: 'Jul 9', score: 71, role: 'PM' },
  { date: 'Jul 13', score: 68, role: 'SWE' },
  { date: 'Jul 17', score: 76, role: 'SWE' },
  { date: 'Jul 22', score: 82, role: 'ML' },
  { date: 'Jul 28', score: 87, role: 'SWE' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border border-brand-500/10 bg-white/80/95 backdrop-blur-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-gray-600 mb-1">{label}</p>
        <p className="text-lg font-bold text-brand-700">{payload[0].value}<span className="text-xs text-gray-600">/100</span></p>
        <p className="text-xs text-gray-500">{payload[0].payload.role}</p>
      </div>
    )
  }
  return null
}

interface ScoreChartProps {
  data?: ScoreHistory[]
}

export function ScoreChart({ data }: ScoreChartProps) {
  const chartData = data && data.length > 0 ? data : MOCK_DATA

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl border border-brand-500/10 bg-white/[0.04] backdrop-blur-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-lavender-950">Score Progress</h3>
          <p className="text-xs text-gray-600 mt-0.5">Your interview scores over time</p>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
          <TrendingUp className="h-4 w-4" />
          <span className="font-semibold">+29pts</span>
          <span className="text-gray-500 text-xs">this month</span>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#7c3aed"
              strokeWidth={2.5}
              fill="url(#scoreGrad)"
              dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4, stroke: '#0a0f1e' }}
              activeDot={{ r: 6, fill: '#a78bfa', stroke: '#0a0f1e', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
