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

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const total = await prisma.interview.count({
      where: { status: 'completed', userId }
    })

    const interviews = await prisma.interview.findMany({
      where: { status: 'completed', userId },
      orderBy: { completedAt: 'desc' },
      skip,
      take: limit,
      include: {
        evaluations: true
      }
    })

    const aggregations = await prisma.interview.aggregate({
      where: { status: 'completed', userId },
      _avg: { overallScore: true },
      _sum: { duration: true }
    })

    return NextResponse.json({
      interviews,
      total,
      pages: Math.ceil(total / limit),
      stats: {
        averageScore: aggregations._avg.overallScore || 0,
        totalPracticeTime: aggregations._sum.duration || 0,
        streak: total > 0 ? 1 : 0 // Simplified streak logic
      }
    })
  } catch (error: any) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history', details: error.message },
      { status: 500 }
    )
  }
}
