import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import prisma from '@/lib/db'
import jwt from 'jsonwebtoken'
// Imports removed for dynamic loading
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''
    let role = '', difficulty = '', experience = '', language = ''
    let resumeText = ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      role = formData.get('role') as string
      difficulty = formData.get('difficulty') as string
      experience = formData.get('experience') as string
      language = formData.get('language') as string
      
      const resumeFile = formData.get('resume') as File | null
      if (resumeFile) {
        try {
          const arrayBuffer = await resumeFile.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          
          if (resumeFile.type === 'application/pdf') {
            const PDFParser = (await import('pdf2json')).default;
            resumeText = await new Promise((resolve, reject) => {
              const pdfParser = new PDFParser(null, 1);
              pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
              pdfParser.on("pdfParser_dataReady", () => resolve((pdfParser as any).getRawTextContent()));
              pdfParser.parseBuffer(buffer);
            });
          } else if (resumeFile.type.startsWith('image/')) {
            const Tesseract = (await import('tesseract.js')).default
            const base64Str = buffer.toString('base64')
            const dataUrl = `data:${resumeFile.type};base64,${base64Str}`
            const { data } = await Tesseract.recognize(dataUrl, 'eng')
            resumeText = data.text
          }
        } catch (e) {
          console.error("Failed to parse resume file:", e)
        }
      }
    } else {
      const body = await req.json()
      role = body.role
      difficulty = body.difficulty
      experience = body.experience
      language = body.language
    }

    if (!role || !difficulty || !experience || !language) {
      return NextResponse.json(
        { error: 'Missing required fields (role, difficulty, experience, language)' },
        { status: 400 }
      )
    }

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

    const prompt = `
      You are an expert technical interviewer.
      Generate 3 interview questions for a candidate applying for the role of "${role}".
      The candidate has "${experience}" level of experience.
      The difficulty level of the interview should be "${difficulty}".
      The questions should be in the "${language}" language.
      
      ${resumeText ? `
      CRITICAL INSTRUCTION: The candidate has provided their resume. You MUST heavily tailor the questions to their specific past experiences, projects, and technologies mentioned in the resume below.
      
      --- RESUME TEXT ---
      ${resumeText.substring(0, 3000)} // Truncated to save tokens if it's huge
      --- END RESUME ---
      ` : ''}
      
      Requirements for the questions:
      - Question 1 should be 'technical' (related to specific skills, programming languages, or tools${resumeText ? ' mentioned in their resume' : ''}).
      - Question 2 should be 'situational' (how they would handle a specific project scenario or architecture${resumeText ? ' relevant to their past roles' : ''}).
      - Question 3 should be 'behavioral' (past experiences, teamwork, conflict resolution).

      Return the result ONLY as a valid JSON object with a "questions" key. The "questions" key must contain an array of objects, with each object having the following keys:
      - text (the interview question text)
      - type (either 'technical', 'behavioral', or 'situational')
      - category (a brief 1-3 word category for the question)
      - hint (a short hint for the candidate if they get stuck)
      - timeLimit (suggested time to answer in seconds, usually between 120 and 300)
    `

    let questionsData: any[] = []

    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        response_format: { type: 'json_object' }
      })

      const responseText = response.choices[0]?.message?.content
      if (!responseText) {
         throw new Error("Failed to generate content from Groq")
      }

      const parsed = JSON.parse(responseText)
      questionsData = parsed.questions || []
    } catch (apiError: any) {
      console.warn("Groq API failed, falling back to mock questions:", apiError.message)
      const roleLower = role.toLowerCase()
      
      if (roleLower.includes('frontend') || roleLower.includes('ui')) {
        questionsData = [
          { text: "Can you explain the virtual DOM in React and how it differs from the real DOM? How does this impact performance?", type: "technical", category: "React Core", hint: "Think about diffing algorithms and batch updates.", timeLimit: 180 },
          { text: "Your web application is experiencing slow load times on mobile devices. Walk me through your debugging and optimization process.", type: "situational", category: "Performance Optimization", hint: "Consider network tabs, bundle sizes, lazy loading, and image optimization.", timeLimit: 180 },
          { text: "Tell me about a time you had to build a complex UI component. How did you ensure it was accessible (a11y) and responsive?", type: "behavioral", category: "UI/UX & Accessibility", hint: "Discuss ARIA roles, keyboard navigation, and media queries.", timeLimit: 180 }
        ]
      } else if (roleLower.includes('ml') || roleLower.includes('machine learning') || roleLower.includes('data')) {
        questionsData = [
          { text: "Explain the bias-variance tradeoff. How do you identify if your model is overfitting, and what techniques would you use to mitigate it?", type: "technical", category: "Model Evaluation", hint: "Discuss regularization, cross-validation, and training vs validation loss curves.", timeLimit: 180 },
          { text: "You have deployed a model to production, but its performance degrades over time compared to the training metrics. How do you troubleshoot this?", type: "situational", category: "MLOps & Monitoring", hint: "Think about data drift, concept drift, and continuous retraining.", timeLimit: 180 },
          { text: "Describe a time when you had to explain a complex machine learning concept or model prediction to a non-technical stakeholder.", type: "behavioral", category: "Communication", hint: "Focus on analogies and translating metrics into business value.", timeLimit: 180 }
        ]
      } else if (roleLower.includes('product') || roleLower.includes('pm') || roleLower.includes('manager')) {
        questionsData = [
          { text: "How do you prioritize features for a product roadmap when multiple stakeholders have conflicting requests?", type: "technical", category: "Prioritization", hint: "Consider frameworks like RICE, Kano model, or MoSCoW.", timeLimit: 180 },
          { text: "Your engineering team says a feature will take 3 weeks, but marketing needs it launched in 1 week for a major campaign. How do you handle this?", type: "situational", category: "Stakeholder Management", hint: "Focus on scope negotiation, MVP definitions, and clear communication.", timeLimit: 180 },
          { text: "Tell me about a product you launched that failed or didn't meet expectations. What went wrong and what did you learn?", type: "behavioral", category: "Learning from Failure", hint: "Discuss metrics, post-mortems, and customer feedback.", timeLimit: 180 }
        ]
      } else {
        // Default backend/software engineer
        questionsData = [
          {
            text: `Can you explain the core concepts of your chosen tech stack and how you would design a scalable backend for a high-traffic application?`,
            type: 'technical',
            category: 'System Design',
            hint: 'Think about load balancing, caching, and database sharding.',
            timeLimit: 180
          },
          {
            text: `Imagine you are working on a project with a tight deadline, and a critical bug is discovered in production. Walk me through your troubleshooting and resolution process.`,
            type: 'situational',
            category: 'Incident Response',
            hint: 'Focus on communication, isolation of the issue, and rollback strategies.',
            timeLimit: 180
          },
          {
            text: `Tell me about a time you disagreed with a senior team member or manager about a technical decision. How did you handle it and what was the outcome?`,
            type: 'behavioral',
            category: 'Conflict Resolution',
            hint: 'Use the STAR method (Situation, Task, Action, Result). Focus on data-driven arguments.',
            timeLimit: 180
          }
        ]
      }
    }

    // Save to database
    const interview = await prisma.interview.create({
      data: {
        userId: userId,
        role,
        difficulty,
        experience,
        language,
        status: 'in_progress',
        questions: {
          create: questionsData.map((q: any) => ({
            text: q.text,
            type: q.type,
            category: q.category,
            hint: q.hint,
            timeLimit: q.timeLimit
          }))
        }
      },
      include: {
        questions: true,
        evaluations: true
      }
    })

    return NextResponse.json({ interview })
  } catch (error: any) {
    console.error('Error generating questions:', error)
    return NextResponse.json(
      { error: 'Failed to generate interview questions', details: error.message },
      { status: 500 }
    )
  }
}
