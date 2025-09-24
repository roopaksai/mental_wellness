export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "suggestion" | "resource"
}

export interface ChatSuggestion {
  id: string
  text: string
  category: "coping" | "emergency" | "resources" | "assessment"
}

export const chatSuggestions: ChatSuggestion[] = [
  { id: "1", text: "I'm feeling anxious", category: "coping" },
  { id: "2", text: "I need help with depression", category: "coping" },
  { id: "3", text: "I'm having trouble sleeping", category: "coping" },
  { id: "4", text: "I need crisis support", category: "emergency" },
  { id: "5", text: "Show me breathing exercises", category: "resources" },
  { id: "6", text: "I want to retake the assessment", category: "assessment" },
]

export const generateBotResponse = async (userMessage: string, conversationHistory: ChatMessage[] = []): Promise<ChatMessage[]> => {
  try {
    const response = await fetch('/api/chat/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        conversationHistory: conversationHistory
      })
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    const data = await response.json()
    
    return [{
      id: `bot-${Date.now()}`,
      content: data.response,
      sender: "bot" as const,
      timestamp: new Date(),
      type: "text" as const,
    }]

  } catch (error) {
    console.log('Error generating AI response:', error)
    
    // Fallback response if AI fails
    return [{
      id: `bot-${Date.now()}`,
      content: "I'm here to support you, though I'm having some technical difficulties right now. Your feelings are valid, and I want you to know that you're not alone. If you need immediate support, please consider reaching out to our campus counseling center at (555) 123-4567 or the National Suicide Prevention Lifeline at 988.",
      sender: "bot" as const,
      timestamp: new Date(),
      type: "text" as const,
    }]
  }
}

export const emergencyResources = [
  {
    name: "National Suicide Prevention Lifeline",
    contact: "988",
    description: "24/7 crisis support",
  },
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    description: "24/7 text-based crisis support",
  },
  {
    name: "Campus Counseling Center",
    contact: "(555) 123-4567",
    description: "On-campus mental health services",
  },
]
