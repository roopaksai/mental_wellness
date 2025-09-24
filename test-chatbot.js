// Test script to verify AI chatbot integration
import { generateBotResponse } from '../lib/chatbot'

async function testChatbot() {
  console.log('Testing AI chatbot integration...')
  
  try {
    const testMessage = "I'm feeling anxious about my upcoming exams"
    const response = await generateBotResponse(testMessage, [])
    
    console.log('User message:', testMessage)
    console.log('AI response:', response[0].content)
    console.log('Test successful!')
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testChatbot()