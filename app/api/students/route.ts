import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User, Assessment } from '@/lib/models'

export async function GET() {
  try {
    await connectToDatabase()
    
    // Get all students
    const students = await User.find({ role: 'student' }).select('-password')
    
    // Get latest assessment for each student
    const studentData = []
    
    for (const student of students) {
      const latestAssessment = await Assessment.findOne({ userId: student._id })
        .sort({ completedAt: -1 })
      
      const totalAssessments = await Assessment.countDocuments({ userId: student._id })
      
      studentData.push({
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        lastAssessment: latestAssessment?.completedAt || null,
        phq9Score: latestAssessment?.phq9Score || 0,
        parsScore: latestAssessment?.parsScore || 0,
        riskLevel: latestAssessment?.riskLevel || 'low',
        totalAssessments
      })
    }

    return NextResponse.json({ students: studentData })

  } catch (error) {
    console.error('Get students error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}