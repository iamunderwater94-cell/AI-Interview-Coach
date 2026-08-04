import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const interviewId = params.id

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        questions: true,
        evaluations: true,
      }
    })

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    // Format for frontend (parse JSON strings in evaluations)
    const formattedInterview = {
      ...interview,
      evaluations: interview.evaluations.map(ev => ({
        ...ev,
        strengths: JSON.parse(ev.strengths),
        weaknesses: JSON.parse(ev.weaknesses)
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
