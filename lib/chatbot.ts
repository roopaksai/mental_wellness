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

export const botResponses: Record<string, string[]> = {
  anxiety: [
    "I understand you're feeling anxious. That's a very common experience, and you're not alone in feeling this way.",
    "Here are some immediate techniques that might help: Try the 4-7-8 breathing technique - breathe in for 4 counts, hold for 7, exhale for 8.",
    "Would you like me to guide you through a quick grounding exercise? It can help bring you back to the present moment.",
  ],
  depression: [
    "Thank you for sharing that with me. Depression can feel overwhelming, but there are ways to manage these feelings.",
    "Remember that seeking help is a sign of strength. Small steps can make a big difference - even getting out of bed is an achievement.",
    "Have you considered talking to a counselor? I can help you find resources or schedule an appointment with our support team.",
  ],
  sleep: [
    "Sleep difficulties are very common, especially when dealing with stress or mental health challenges.",
    "Here are some tips that might help: Try to maintain a consistent sleep schedule, avoid screens 1 hour before bed, and create a relaxing bedtime routine.",
    "If sleep problems persist, it might be worth discussing with a healthcare provider as it could be related to your mental health.",
  ],
  crisis: [
    "I'm concerned about you and want to make sure you get the help you need right away.",
    "If you're having thoughts of self-harm, please reach out to a crisis hotline immediately: National Suicide Prevention Lifeline: 988",
    "You can also text 'HELLO' to 741741 for the Crisis Text Line. Is there someone you trust who you can talk to right now?",
  ],
  breathing: [
    "Breathing exercises are a great way to manage stress and anxiety. Let me guide you through a simple technique.",
    "Box Breathing: Breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. Repeat this cycle 4-6 times.",
    "Progressive Muscle Relaxation: Tense and then relax each muscle group in your body, starting from your toes and working up to your head.",
  ],
  default: [
    "I hear you, and I want you to know that your feelings are valid. It's okay to not be okay sometimes.",
    "I'm here to support you. Can you tell me more about what you're experiencing right now?",
    "Remember, you don't have to go through this alone. There are people who want to help, including our support team.",
  ],
}

export const generateBotResponse = (userMessage: string): ChatMessage[] => {
  const message = userMessage.toLowerCase()
  let responses: string[] = []

  if (message.includes("anxious") || message.includes("anxiety") || message.includes("worried")) {
    responses = botResponses.anxiety
  } else if (message.includes("depressed") || message.includes("depression") || message.includes("sad")) {
    responses = botResponses.depression
  } else if (message.includes("sleep") || message.includes("insomnia") || message.includes("tired")) {
    responses = botResponses.sleep
  } else if (
    message.includes("crisis") ||
    message.includes("emergency") ||
    message.includes("harm") ||
    message.includes("suicide")
  ) {
    responses = botResponses.crisis
  } else if (message.includes("breathing") || message.includes("exercise") || message.includes("relax")) {
    responses = botResponses.breathing
  } else {
    responses = botResponses.default
  }

  return responses.map((content, index) => ({
    id: `bot-${Date.now()}-${index}`,
    content,
    sender: "bot" as const,
    timestamp: new Date(Date.now() + index * 1000), // Stagger timestamps
    type: "text" as const,
  }))
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
