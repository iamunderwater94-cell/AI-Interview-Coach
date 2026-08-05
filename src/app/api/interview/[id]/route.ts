import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const interviewId = params.id

    const interviewDoc = await db.collection('interviews').doc(interviewId).get()

    if (!interviewDoc.exists) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    const interview = interviewDoc.data()
    
    // Fetch questions
    const questionsSnapshot = await db.collection('interviews').doc(interviewId).collection('questions').get()
    const questions = questionsSnapshot.docs.map((doc: any) => doc.data())
    
    // Fetch evaluations
    const evaluationsSnapshot = await db.collection('interviews').doc(interviewId).collection('evaluations').get()
    const evaluations = evaluationsSnapshot.docs.map((doc: any) => doc.data())

    // Format for frontend (parse JSON strings in evaluations if needed, but Firestore can store maps. Assuming they were stored as strings in Prisma, we'll keep parsing if they are strings)
    const formattedInterview = {
      ...interview,
      questions,
      evaluations: evaluations.map((ev: any) => ({
        ...ev,
        strengths: typeof ev.strengths === 'string' ? JSON.parse(ev.strengths) : ev.strengths,
        weaknesses: typeof ev.weaknesses === 'string' ? JSON.parse(ev.weaknesses) : ev.weaknesses
      }))
    }

    return NextResponse.json({ interview: formattedInterview })
  } catch (error: any) {
    console.error('Error fetching interview:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interview', details: error.message },
      { status: 500 }
    )
  }
}
