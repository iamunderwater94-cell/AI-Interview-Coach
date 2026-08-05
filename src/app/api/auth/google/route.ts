import { NextResponse } from 'next/server';
import { auth as adminAuth, db } from '@/lib/firebase-admin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const name = decodedToken.name || '';

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const usersRef = db.collection('users');
    let userDoc = await usersRef.doc(uid).get();
    
    // If the user doesn't exist in our Firestore DB, create them
    if (!userDoc.exists) {
      const newUser = {
        id: uid,
        email,
        name,
        achievements: [],
        createdAt: new Date().toISOString(),
      };
      await usersRef.doc(uid).set(newUser);
      userDoc = await usersRef.doc(uid).get();
    }

    const userData = userDoc.data() as any;

    // Generate our JWT token for the session
    const jwtToken = jwt.sign(
      { userId: uid, email: userData.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      user: {
        id: uid,
        email: userData.email,
        name: userData.name,
      },
      token: jwtToken
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Google login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
