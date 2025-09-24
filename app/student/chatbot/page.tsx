"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { ChatMessageComponent } from "@/components/chat-message"
import { ChatSuggestions } from "@/components/chat-suggestions"
import { EmergencyResources } from "@/components/emergency-resources"
import { getCurrentUser } from "@/lib/auth"
import { chatSuggestions, generateBotResponse, type ChatMessage, type ChatSuggestion } from "@/lib/chatbot"
import { Send, RotateCcw } from "lucide-react"

export default function StudentChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const user = getCurrentUser()

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/")
      return
    }

    // Initial bot greeting
    const initialMessage: ChatMessage = {
      id: "initial",
      content: `Hello ${user.name}! I'm here to provide mental health support and resources. How are you feeling today?`,
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    }
    setMessages([initialMessage])
  }, [user, router])

  // useEffect(() => {
  //   scrollToBottom()
  // }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setShowSuggestions(false)
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponses = generateBotResponse(content)
      setMessages((prev) => [...prev, ...botResponses])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: ChatSuggestion) => {
    handleSendMessage(suggestion.text)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputMessage)
    }
  }

  const handleResetChat = () => {
    if (!user) return

    const initialMessage: ChatMessage = {
      id: "reset",
      content: `Hello ${user.name}! I'm here to provide mental health support and resources. How are you feeling today?`,
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    }
    setMessages([initialMessage])
    setShowSuggestions(true)
    setInputMessage("")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>AI Mental Health Support</CardTitle>
                <Button variant="outline" size="sm" onClick={handleResetChat}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Chat
                </Button>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {messages.map((message) => (
                    <ChatMessageComponent key={message.id} message={message} />
                  ))}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    disabled={isTyping}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleSendMessage(inputMessage)}
                    disabled={!inputMessage.trim() || isTyping}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Suggestions */}
            {showSuggestions && (
              <ChatSuggestions suggestions={chatSuggestions} onSuggestionClick={handleSuggestionClick} />
            )}

            {/* Emergency Resources */}
            <EmergencyResources />

            {/* Additional Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/student/test")}
                >
                  Retake Assessment
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/student/report")}
                >
                  View My Report
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Schedule Professional Help
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/student/support")}
                >
                  Join Peer Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
