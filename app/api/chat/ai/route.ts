import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client with OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "mental-wellness-app",
    "X-Title": "Mental Wellness App",
  },
})

// System prompt for the AI mental health chatbot
const SYSTEM_PROMPT = `You are a compassionate AI mental health support assistant for a student wellness platform. Your role is to provide empathetic, helpful, and appropriate responses to students seeking mental health support.

Guidelines:
1. Always be empathetic, supportive, and non-judgmental
2. Provide practical coping strategies and resources when appropriate
3. Recognize signs of crisis and direct users to appropriate emergency resources
4. Keep responses concise but comprehensive (1-3 paragraphs)
5. Encourage professional help when needed
6. Never provide medical diagnoses or prescribe treatments
7. Be culturally sensitive and inclusive
8. If someone mentions self-harm or suicide, immediately provide crisis resources

Emergency Resources:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Campus Counseling Center: (555) 123-4567

Remember: You're providing peer support and guidance, not professional therapy.`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check for crisis keywords first for immediate response
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'self-harm', 'hurt myself', 'don\'t want to live']
    const isCrisis = crisisKeywords.some(keyword => message.toLowerCase().includes(keyword))

    if (isCrisis) {
      return NextResponse.json({
        response: `I'm very concerned about you and want to make sure you get immediate help. Please reach out to these crisis resources right now:

🆘 **National Suicide Prevention Lifeline: 988**
📱 **Crisis Text Line: Text HOME to 741741**
🏥 **Campus Counseling Center: (555) 123-4567**

You don't have to go through this alone. There are people who want to help you right now. Is there someone you trust who you can contact or be with?`
      })
    }

    // Prepare conversation context for AI
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      // Include recent conversation history (last 6 messages to maintain context)
      ...conversationHistory.slice(-6).map((msg: any) => ({
        role: msg.sender === "user" ? "user" as const : "assistant" as const,
        content: msg.content
      })),
      { role: "user" as const, content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: "amazon/nova-2-lite-v1:free",
      messages: messages,
    })

    const aiResponse = completion.choices[0]?.message?.content ||
      "I'm here to support you. Could you tell me more about what you're experiencing?"

    return NextResponse.json({ response: aiResponse })

  } catch (error) {
    console.error('Error generating AI response:', error)

    // Return fallback response if AI fails
    return NextResponse.json({
      response: "I'm here to support you, though I'm having some technical difficulties right now. Your feelings are valid, and I want you to know that you're not alone. If you need immediate support, please consider reaching out to our campus counseling center at (555) 123-4567 or the National Suicide Prevention Lifeline at 988."
    })
  }
}