import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { StudentSupport, User, Assessment } from '@/lib/models'

export async function GET() {
  try {
    await connectToDatabase()
    
    // Get all active student support records with their user info
    const supportRecords = await StudentSupport.find({ isActive: true })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })

    const availableStudents = []

    for (const record of supportRecords) {
      // Get latest assessment for this student
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
        notes: record.notes
      })
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