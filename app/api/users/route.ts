import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    
    let query = {}
    if (role) {
      query = { role }
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })

    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    }))

    return NextResponse.json({ users: formattedUsers })

  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}