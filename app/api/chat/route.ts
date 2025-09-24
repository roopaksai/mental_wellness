import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ChatMessage } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let query: any = { userId }
    if (sessionId) {
      query.sessionId = sessionId
    }

    const messages = await ChatMessage.find(query)
      .sort({ timestamp: 1 })
      .limit(100) // Limit to last 100 messages

    const formattedMessages = messages.map(message => ({
      id: message._id.toString(),
      content: message.content,
      sender: message.sender,
      timestamp: message.timestamp,
      type: message.type,
      sessionId: message.sessionId
    }))

    return NextResponse.json({ messages: formattedMessages })

  } catch (error) {
    console.error('Get chat messages error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { userId, content, sender, type = 'text', sessionId } = await request.json()

    if (!userId || !content || !sender) {
      return NextResponse.json(
        { error: 'User ID, content, and sender are required' },
        { status: 400 }
      )
    }

    const message = await ChatMessage.create({
      userId,
      content,
      sender,
      type,
      sessionId,
      timestamp: new Date()
    })

    return NextResponse.json({
      message: {
        id: message._id.toString(),
        content: message.content,
        sender: message.sender,
        timestamp: message.timestamp,
        type: message.type,
        sessionId: message.sessionId
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create chat message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}