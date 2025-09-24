"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Activity } from "@/lib/recommendations"
import { Clock, Star, ExternalLink } from "lucide-react"

interface ActivityRecommendationsProps {
  activities: Activity[]
}

export function ActivityRecommendations({ activities }: ActivityRecommendationsProps) {
  const getCategoryColor = (category: Activity["category"]) => {
    switch (category) {
      case "mindfulness":
        return "bg-blue-500/10 text-blue-500"
      case "exercise":
        return "bg-green-500/10 text-green-500"
      case "social":
        return "bg-purple-500/10 text-purple-500"
      case "creative":
        return "bg-orange-500/10 text-orange-500"
      case "academic":
        return "bg-yellow-500/10 text-yellow-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getDifficultyColor = (difficulty: Activity["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-500"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500"
      case "hard":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const handleTryActivity = (activity: Activity) => {
    if (activity.youtubeUrl) {
      window.open(activity.youtubeUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Personalized Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {activities.map((activity) => (
            <div key={activity.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{activity.title}</h3>
                <div className="flex gap-2">
                  <Badge className={getCategoryColor(activity.category)}>{activity.category}</Badge>
                  <Badge className={getDifficultyColor(activity.difficulty)}>{activity.difficulty}</Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{activity.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {activity.duration}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTryActivity(activity)}
                  className="flex items-center gap-2"
                >
                  Try This Activity
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
