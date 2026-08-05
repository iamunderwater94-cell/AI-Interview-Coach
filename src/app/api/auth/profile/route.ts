import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

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
    const { name, email, password, targetRole, experienceLevel, preferredLanguage } = body

    const dataToUpdate: any = {}
    
    if (name) dataToUpdate.name = name
    if (targetRole) dataToUpdate.targetRole = targetRole
    if (experienceLevel) dataToUpdate.experienceLevel = experienceLevel
    if (preferredLanguage) dataToUpdate.preferredLanguage = preferredLanguage

    const usersRef = db.collection('users')

    if (email) {
      const existingSnapshot = await usersRef.where('email', '==', email).limit(1).get()
      if (!existingSnapshot.empty && existingSnapshot.docs[0].id !== userId) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
      }
      dataToUpdate.email = email
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
      }
      dataToUpdate.password = await bcrypt.hash(password, 10)
    }

    dataToUpdate.updatedAt = new Date().toISOString()
    const userRef = usersRef.doc(userId)
    await userRef.update(dataToUpdate)

    const userDoc = await userRef.get()
    const user: any = userDoc.data()

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}
