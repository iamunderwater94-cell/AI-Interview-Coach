import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const userId = decoded.userId

    const interviews = await prisma.interview.findMany({
      where: { status: 'completed', userId },
      orderBy: { completedAt: 'asc' },
      select: {
        completedAt: true,
        overallScore: true,
        role: true
      }
    })

    const history = interviews.map(inv => ({
      date: inv.completedAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(inv.completedAt) : '',
      score: Math.round(inv.overallScore || 0),
      role: inv.role
    }))

    return NextResponse.json({ history })
  } catch (error: any) {
    console.error('Error in score-history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
