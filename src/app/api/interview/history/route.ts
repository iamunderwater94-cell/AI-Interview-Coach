import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
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

    const interviewsRef = db.collection('interviews')
    const snapshot = await interviewsRef.where('userId', '==', userId).where('status', '==', 'completed').get()
    
    let allInterviews = snapshot.docs.map((doc: any) => doc.data())
    // Sort descending by completedAt
    allInterviews.sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    
    const total = allInterviews.length
    
    // Aggregations
    let totalScore = 0
    let totalDuration = 0
    allInterviews.forEach((inv: any) => {
      totalScore += (inv.overallScore || 0)
      totalDuration += (inv.duration || 0)
    })
    const averageScore = total > 0 ? totalScore / total : 0

    const paginatedInterviews = allInterviews.slice(skip, skip + limit)

    return NextResponse.json({
      interviews: paginatedInterviews,
      total,
      pages: Math.ceil(total / limit),
      stats: {
        averageScore,
        totalPracticeTime: totalDuration,
        streak: total > 0 ? 1 : 0
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
