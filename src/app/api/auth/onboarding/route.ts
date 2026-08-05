import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev'

export async function PATCH(req: Request) {
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

    const body = await req.json()
    const { targetRole, experienceLevel, preferredLanguage } = body

    if (!targetRole || !experienceLevel || !preferredLanguage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const userRef = db.collection('users').doc(userId)
    const updateData = {
      targetRole,
      experienceLevel,
      preferredLanguage,
      onboardingComplete: true,
      updatedAt: new Date().toISOString()
    }
    await userRef.update(updateData)

    const userDoc = await userRef.get()
    const user: any = userDoc.data()

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error: any) {
    console.error('Onboarding update error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}
