import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Assessment, User } from '@/lib/models'

// Calculate risk level based on scores
function calculateRiskLevel(phq9Score: number, parsScore: number): 'low' | 'moderate' | 'high' {
  if (phq9Score >= 15 || parsScore >= 20) return 'high'
  if (phq9Score >= 10 || parsScore >= 15) return 'moderate'
  return 'low'
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = searchParams.get('limit')
    
    let query = {}
    if (userId) {
      query = { userId }
    }

    // For single user queries, we usually only need the latest few assessments
    let assessmentQuery = Assessment.find(query).sort({ completedAt: -1 })
    
    if (userId && !limit) {
      // For individual user reports, limit to 10 most recent assessments for better performance
      assessmentQuery = assessmentQuery.limit(10)
    } else if (limit) {
      assessmentQuery = assessmentQuery.limit(parseInt(limit))
    }

    const assessments = await assessmentQuery
      .populate('userId', 'name email')
      .lean() // Use lean() for better performance when we don't need full mongoose documents

    const formattedAssessments = assessments.map(assessment => ({
      id: assessment._id.toString(),
      userId: (assessment.userId as any)._id.toString(),
      userName: (assessment.userId as any).name,
      userEmail: (assessment.userId as any).email,
      phq9Score: assessment.phq9Score,
      parsScore: assessment.parsScore,
      riskLevel: assessment.riskLevel,
      answers: assessment.answers,
      completedAt: assessment.completedAt
    }))

    return NextResponse.json({ assessments: formattedAssessments })

  } catch (error) {
    console.error('Get assessments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { userId, answers } = await request.json()

    if (!userId || !answers) {
      return NextResponse.json(
        { error: 'User ID and answers are required' },
        { status: 400 }
      )
    }

    // Calculate scores based on answers
    let phq9Score = 0
    let parsScore = 0

    answers.forEach((answer: any) => {
      if (answer.questionId.startsWith('phq')) {
        phq9Score += answer.score
      } else if (answer.questionId.startsWith('pars')) {
        parsScore += answer.score
      }
    })

    const riskLevel = calculateRiskLevel(phq9Score, parsScore)

    const assessment = await Assessment.create({
      userId,
      phq9Score,
      parsScore,
      riskLevel,
      answers,
      completedAt: new Date()
    })

    return NextResponse.json({
      assessment: {
        id: assessment._id.toString(),
        userId: assessment.userId.toString(),
        phq9Score: assessment.phq9Score,
        parsScore: assessment.parsScore,
        riskLevel: assessment.riskLevel,
        completedAt: assessment.completedAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create assessment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}