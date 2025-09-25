import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { StudentSupport, User, Assessment } from '@/lib/models'

export async function GET() {
  try {
    await connectToDatabase()
    
    // Get all students with high or moderate risk levels from latest assessments
    const highRiskAssessments = await Assessment.aggregate([
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
        $match: {
          'latestAssessment.riskLevel': { $in: ['high', 'moderate'] }
        }
      },
      {
        $replaceRoot: { newRoot: '$latestAssessment' }
      }
    ])

    // Get all active student support records
    const supportRecords = await StudentSupport.find({ isActive: true })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })

    // Get registered peer support records for easy lookup
    const registeredStudentSupport = await StudentSupport.find({ isActive: true })
    const supportRecordMap = new Map()
    registeredStudentSupport.forEach(record => {
      supportRecordMap.set(record.userId.toString(), record)
    })

    const availableStudents = []
    const processedStudentIds = new Set()

    // First, add all students who have registered for peer support
    for (const record of supportRecords) {
      const latestAssessment = await Assessment.findOne({ userId: record.userId._id })
        .sort({ completedAt: -1 })

      availableStudents.push({
        id: record.userId._id.toString(),
        name: (record.userId as any).name,
        email: (record.userId as any).email,
        riskLevel: latestAssessment?.riskLevel || 'low',
        lastAssessment: latestAssessment?.completedAt || null,
        phq9Score: latestAssessment?.phq9Score || 0,
        parsScore: latestAssessment?.parsScore || 0,
        preferredContactMethod: record.preferredContactMethod,
        availableSlots: record.availableSlots.map(slot => ({
          id: slot._id.toString(),
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: slot.isBooked,
          bookedBy: slot.bookedBy?.toString()
        })),
        notes: record.notes,
        isRegisteredForSupport: true
      })
      processedStudentIds.add(record.userId._id.toString())
    }

    // Then, add high/moderate risk students who haven't registered for peer support
    for (const assessment of highRiskAssessments) {
      const studentId = assessment.userId.toString()
      
      if (!processedStudentIds.has(studentId)) {
        // Get student user info
        const student = await User.findById(assessment.userId).select('name email')
        
        if (student) {
          availableStudents.push({
            id: studentId,
            name: student.name,
            email: student.email,
            riskLevel: assessment.riskLevel,
            lastAssessment: assessment.completedAt,
            phq9Score: assessment.phq9Score,
            parsScore: assessment.parsScore,
            preferredContactMethod: 'email', // Default contact method
            availableSlots: [], // No available slots since they haven't registered
            notes: 'High/moderate risk student - needs outreach',
            isRegisteredForSupport: false
          })
          processedStudentIds.add(studentId)
        }
      }
    }

    return NextResponse.json({ students: availableStudents })

  } catch (error) {
    console.error('Get available students error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}