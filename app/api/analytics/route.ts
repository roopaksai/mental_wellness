import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Assessment, User } from '@/lib/models'

export async function GET() {
  try {
    await connectToDatabase()
    
    // Get total students
    const totalStudents = await User.countDocuments({ role: 'student' })
    
    // Get all latest assessments for each user
    const latestAssessments = await Assessment.aggregate([
      {
        $sort: { completedAt: -1 }
      },
      {
        $group: {
          _id: '$userId',
          latestAssessment: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$latestAssessment' }
      }
    ])

    // Calculate risk distribution
    const riskDistribution = latestAssessments.reduce(
      (acc, assessment) => {
        acc[assessment.riskLevel]++
        return acc
      },
      { low: 0, moderate: 0, high: 0 }
    )

    // Calculate average scores
    let totalPhq9 = 0
    let totalPars = 0
    let assessmentCount = latestAssessments.length

    latestAssessments.forEach(assessment => {
      totalPhq9 += assessment.phq9Score
      totalPars += assessment.parsScore
    })

    const averageScores = {
      phq9: assessmentCount > 0 ? Math.round(totalPhq9 / assessmentCount) : 0,
      pars: assessmentCount > 0 ? Math.round(totalPars / assessmentCount) : 0
    }

    // Get recent assessments (within last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentAssessments = await Assessment.countDocuments({
      completedAt: { $gte: sevenDaysAgo }
    })

    return NextResponse.json({
      totalStudents,
      riskDistribution,
      averageScores,
      recentAssessments
    })

  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}