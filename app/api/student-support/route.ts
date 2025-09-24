import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { StudentSupport } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supportRecord = await StudentSupport.findOne({ userId })
    
    return NextResponse.json({ 
      isRegistered: !!supportRecord,
      supportRecord: supportRecord ? {
        id: supportRecord._id.toString(),
        preferredContactMethod: supportRecord.preferredContactMethod,
        availableSlots: supportRecord.availableSlots,
        notes: supportRecord.notes,
        isActive: supportRecord.isActive
      } : null
    })

  } catch (error) {
    console.error('Get student support error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { userId, preferredContactMethod, availableSlots, notes } = await request.json()

    if (!userId || !preferredContactMethod) {
      return NextResponse.json(
        { error: 'User ID and preferred contact method are required' },
        { status: 400 }
      )
    }

    // Check if user already registered
    const existingRecord = await StudentSupport.findOne({ userId })
    
    if (existingRecord) {
      return NextResponse.json(
        { error: 'User already registered for support' },
        { status: 409 }
      )
    }

    // Create new support registration
    const supportRecord = await StudentSupport.create({
      userId,
      preferredContactMethod,
      availableSlots: availableSlots || [],
      notes,
      isActive: true
    })

    return NextResponse.json({
      supportRecord: {
        id: supportRecord._id.toString(),
        userId: supportRecord.userId.toString(),
        preferredContactMethod: supportRecord.preferredContactMethod,
        availableSlots: supportRecord.availableSlots,
        notes: supportRecord.notes,
        isActive: supportRecord.isActive
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create student support error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { userId, preferredContactMethod, availableSlots, notes, isActive } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (preferredContactMethod) updateData.preferredContactMethod = preferredContactMethod
    if (availableSlots) updateData.availableSlots = availableSlots
    if (notes !== undefined) updateData.notes = notes
    if (isActive !== undefined) updateData.isActive = isActive

    const supportRecord = await StudentSupport.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    )

    if (!supportRecord) {
      return NextResponse.json(
        { error: 'Support record not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      supportRecord: {
        id: supportRecord._id.toString(),
        userId: supportRecord.userId.toString(),
        preferredContactMethod: supportRecord.preferredContactMethod,
        availableSlots: supportRecord.availableSlots,
        notes: supportRecord.notes,
        isActive: supportRecord.isActive
      }
    })

  } catch (error) {
    console.error('Update student support error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}