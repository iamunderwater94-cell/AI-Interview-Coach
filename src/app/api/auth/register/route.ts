import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
    }

    // Check if user already exists
    const usersRef = db.collection('users')
    const snapshot = await usersRef.where('email', '==', email).limit(1).get()

    if (!snapshot.empty) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create the user
    const newUserRef = usersRef.doc()
    const userData = {
      id: newUserRef.id,
      email,
      name: name || '',
      password: hashedPassword,
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    await newUserRef.set(userData)

    // Generate JWT token
    const token = jwt.sign(
      { userId: userData.id, email: userData.email },
      JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    )

    // Don't send the password back to the client
    const { password: _, ...userWithoutPassword } = userData

    return NextResponse.json({
      user: userWithoutPassword,
      token
    })
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
