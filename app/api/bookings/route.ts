import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Booking, StudentSupport, User } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const role = searchParams.get('role')
    
    let query = {}
    if (userId && role === 'student') {
      query = { studentId: userId }
    } else if (userId && role === 'support') {
      query = { supportStaffId: userId }
    }

    const bookings = await Booking.find(query)
      .populate('studentId', 'name email')
      .populate('supportStaffId', 'name email')
      .sort({ date: -1 })

    const formattedBookings = bookings.map(booking => ({
      id: booking._id.toString(),
      studentId: booking.studentId._id.toString(),
      studentName: (booking.studentId as any).name,
      studentEmail: (booking.studentId as any).email,
      supportStaffId: booking.supportStaffId._id.toString(),
      supportStaffName: (booking.supportStaffId as any).name,
      timeSlotId: booking.timeSlotId,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.createdAt
    }))

    return NextResponse.json({ bookings: formattedBookings })

  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { studentId, supportStaffId, timeSlotId, date, startTime, endTime, notes } = await request.json()

    if (!studentId || !supportStaffId || !timeSlotId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'All booking fields are required' },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await Booking.create({
      studentId,
      supportStaffId,
      timeSlotId,
      date: new Date(date),
      startTime,
      endTime,
      notes,
      status: 'scheduled'
    })

    // Update the time slot as booked in StudentSupport
    await StudentSupport.updateOne(
      { userId: studentId, 'availableSlots._id': timeSlotId },
      { 
        $set: { 
          'availableSlots.$.isBooked': true,
          'availableSlots.$.bookedBy': supportStaffId
        }
      }
    )

    return NextResponse.json({
      booking: {
        id: booking._id.toString(),
        studentId: booking.studentId.toString(),
        supportStaffId: booking.supportStaffId.toString(),
        timeSlotId: booking.timeSlotId,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        notes: booking.notes
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}