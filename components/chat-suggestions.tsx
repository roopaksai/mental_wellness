"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChatSuggestion } from "@/lib/chatbot"
import { MessageCircle, AlertTriangle, BookOpen, ClipboardList } from "lucide-react"

interface ChatSuggestionsProps {
  suggestions: ChatSuggestion[]
  onSuggestionClick: (suggestion: ChatSuggestion) => void
}

export function ChatSuggestions({ suggestions, onSuggestionClick }: ChatSuggestionsProps) {
  const getCategoryIcon = (category: ChatSuggestion["category"]) => {
    switch (category) {
      case "coping":
        return <MessageCircle className="h-4 w-4" />
      case "emergency":
        return <AlertTriangle className="h-4 w-4" />
      case "resources":
        return <BookOpen className="h-4 w-4" />
      case "assessment":
        return <ClipboardList className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: ChatSuggestion["category"]) => {
    switch (category) {
      case "coping":
        return "text-blue-500"
      case "emergency":
        return "text-red-500"
      case "resources":
        return "text-green-500"
      case "assessment":
        return "text-purple-500"
      default:
        return "text-gray-500"
    }
  }

  const groupedSuggestions = suggestions.reduce(
    (acc, suggestion) => {
      if (!acc[suggestion.category]) {
        acc[suggestion.category] = []
      }
      acc[suggestion.category].push(suggestion)
      return acc
    },
    {} as Record<string, ChatSuggestion[]>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">How can I help you today?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedSuggestions).map(([category, categorySuggestions]) => (
            <div key={category}>
              <h4
                className={`text-sm font-medium mb-2 flex items-center gap-2 ${getCategoryColor(category as ChatSuggestion["category"])}`}
              >
                {getCategoryIcon(category as ChatSuggestion["category"])}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h4>
              <div className="grid gap-2">
                {categorySuggestions.map((suggestion) => (
                  <Button
                    key={suggestion.id}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto p-3 text-left bg-transparent"
                    onClick={() => onSuggestionClick(suggestion)}
                  >
                    {suggestion.text}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
