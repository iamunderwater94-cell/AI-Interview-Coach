import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const interviewId = params.id
    
    const interviewDoc = await db.collection('interviews').doc(interviewId).get()
    if (!interviewDoc.exists) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }
    
    const interview = interviewDoc.data() as any
    const evSnapshot = await db.collection('interviews').doc(interviewId).collection('evaluations').get()
    const evaluations = evSnapshot.docs.map((doc: any) => doc.data())

    // Calculate averages
    let overallScore = 0
    let technicalAvg = 0
    let grammarAvg = 0
    let clarityAvg = 0

    if (evaluations.length > 0) {
      technicalAvg = evaluations.reduce((sum: number, ev: any) => sum + ev.technicalScore, 0) / evaluations.length
      grammarAvg = evaluations.reduce((sum: number, ev: any) => sum + ev.grammarScore, 0) / evaluations.length
      clarityAvg = evaluations.reduce((sum: number, ev: any) => sum + ev.clarityScore, 0) / evaluations.length
      overallScore = evaluations.reduce((sum: number, ev: any) => sum + ev.overallScore, 0) / evaluations.length
    }

    const startedAtTime = new Date(interview.startedAt).getTime()
    const duration = Math.floor((Date.now() - startedAtTime) / 1000)

    // Update interview status and scores
    const updateData = {
      status: 'completed',
      completedAt: new Date().toISOString(),
      overallScore,
      technicalAvg,
      grammarAvg,
      clarityAvg,
      duration
    }
    
    await db.collection('interviews').doc(interviewId).update(updateData)

    const updatedInterview = {
      ...interview,
      ...updateData
    }

    // Fetch questions to include in response
    const qSnapshot = await db.collection('interviews').doc(interviewId).collection('questions').get()
    const questions = qSnapshot.docs.map((doc: any) => doc.data())

    // Format for frontend
    const formattedInterview = {
      ...updatedInterview,
      questions,
      evaluations: evaluations.map((ev: any) => ({
        ...ev,
        strengths: typeof ev.strengths === 'string' ? JSON.parse(ev.strengths) : ev.strengths,
        weaknesses: typeof ev.weaknesses === 'string' ? JSON.parse(ev.weaknesses) : ev.weaknesses
      }))
    }

    return NextResponse.json({ interview: formattedInterview })
  } catch (error: any) {
    console.error('Error completing interview:', error)
    return NextResponse.json(
      { error: 'Failed to complete interview', details: error.message },
      { status: 500 }
    )
  }
}
