import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
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

    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser && existingUser.id !== userId) {
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

    const user = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate
    })

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}
