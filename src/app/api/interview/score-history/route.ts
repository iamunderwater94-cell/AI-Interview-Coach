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

    const snapshot = await db.collection('interviews').where('userId', '==', userId).where('status', '==', 'completed').get()
    const interviews = snapshot.docs.map((doc: any) => doc.data())
    interviews.sort((a: any, b: any) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())

    const history = interviews.map((inv: any) => ({
      date: inv.completedAt ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(inv.completedAt)) : '',
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
