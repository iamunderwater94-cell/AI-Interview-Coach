import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const interviewId = params.id

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        evaluations: true,
      }
    })

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    // Calculate averages
    const evaluations = interview.evaluations
    let overallScore = 0
    let technicalAvg = 0
    let grammarAvg = 0
    let clarityAvg = 0

    if (evaluations.length > 0) {
      technicalAvg = evaluations.reduce((sum, ev) => sum + ev.technicalScore, 0) / evaluations.length
      grammarAvg = evaluations.reduce((sum, ev) => sum + ev.grammarScore, 0) / evaluations.length
      clarityAvg = evaluations.reduce((sum, ev) => sum + ev.clarityScore, 0) / evaluations.length
      overallScore = evaluations.reduce((sum, ev) => sum + ev.overallScore, 0) / evaluations.length
    }

    // Update interview status and scores
    const updatedInterview = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        overallScore,
        technicalAvg,
        grammarAvg,
        clarityAvg,
        duration: Math.floor((Date.now() - interview.startedAt.getTime()) / 1000)
      },
      include: {
        questions: true,
        evaluations: true
      }
    })

    // Format for frontend (parse JSON strings in evaluations)
    const formattedInterview = {
      ...updatedInterview,
      evaluations: updatedInterview.evaluations.map(ev => ({
        ...ev,
        strengths: JSON.parse(ev.strengths),
        weaknesses: JSON.parse(ev.weaknesses)
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
