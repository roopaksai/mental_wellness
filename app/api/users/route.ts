import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models'
import bcrypt from 'bcryptjs'

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

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const body = await request.json()
    const { name, email, password, role } = body

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['admin', 'support', 'student'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin, support, or student' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date()
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}