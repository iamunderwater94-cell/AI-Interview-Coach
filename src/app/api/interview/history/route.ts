import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // For a real app you'd filter by the authenticated user's ID
    const total = await prisma.interview.count({
      where: { status: 'completed' }
    })

    const interviews = await prisma.interview.findMany({
      where: { status: 'completed' },
      orderBy: { completedAt: 'desc' },
      skip,
      take: limit,
      include: {
        evaluations: true
      }
    })

    const aggregations = await prisma.interview.aggregate({
      where: { status: 'completed' },
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
