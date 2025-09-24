"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { ScoreVisualization } from "@/components/score-visualization"
import { ActivityRecommendations } from "@/components/activity-recommendations"
import { MusicRecommendations } from "@/components/music-recommendations"
import { getCurrentUser } from "@/lib/auth"
import { getScoreInterpretation, type TestResult } from "@/lib/questions"
import { getPersonalizedActivities, getPersonalizedMusic } from "@/lib/recommendations"
import { MessageCircle, Users, Calendar, TrendingUp } from "lucide-react"

export default function StudentReportPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [showPeerSupport, setShowPeerSupport] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (!currentUser || currentUser.role !== "student") {
      router.push("/")
      return
    }

    // Load test result from localStorage
    const savedResult = localStorage.getItem("latestTestResult")
    if (savedResult) {
      setTestResult(JSON.parse(savedResult))
    } else {
      router.push("/student/test")
      return
    }

    setIsLoading(false)
  }, []) // Empty dependency array to run only once on mount

  if (isLoading || !testResult || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading your report...</h2>
          <p className="text-muted-foreground">Please wait while we analyze your results.</p>
        </div>
      </div>
    )
  }

  const { depressionLevel, anxietyLevel } = getScoreInterpretation(testResult.phq9Score, testResult.parsScore)
  const personalizedActivities = getPersonalizedActivities(testResult.phq9Score, testResult.parsScore)
  const personalizedMusic = getPersonalizedMusic(testResult.phq9Score, testResult.parsScore)

  const getMotivationalMessage = () => {
    const totalScore = testResult.phq9Score + testResult.parsScore

    if (totalScore < 10) {
      return "You're doing great! Your mental health appears to be in a good place. Keep up the positive habits and remember that it's normal to have ups and downs."
    } else if (totalScore < 20) {
      return "You're taking an important step by completing this assessment. While you may be experiencing some challenges, there are many effective ways to improve your wellbeing."
    } else {
      return "Thank you for being honest about your experiences. Remember that seeking help is a sign of strength, and there are people who want to support you on your journey to better mental health."
    }
  }

  const handlePeerSupportRegistration = () => {
    router.push("/student/support")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Your Mental Health Report</h1>
          <p className="text-muted-foreground text-center">
            Completed on {new Date(testResult.completedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Motivational Message */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <TrendingUp className="h-6 w-6 text-primary mt-1" />
              <div>
                <h2 className="text-lg font-semibold mb-2">Your Journey Matters</h2>
                <p className="text-muted-foreground leading-relaxed">{getMotivationalMessage()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Visualization */}
        <div className="mb-8">
          <ScoreVisualization
            phq9Score={testResult.phq9Score}
            parsScore={testResult.parsScore}
            depressionLevel={depressionLevel}
            anxietyLevel={anxietyLevel}
            showSeverity={false}
          />
        </div>

        {/* Recommendations Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <ActivityRecommendations activities={personalizedActivities} />
          <MusicRecommendations music={personalizedMusic} />
        </div>

        {/* Peer Support Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Peer Support Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Connect with other students who understand what you're going through. Our peer support network provides a
              safe space to share experiences and support each other.
            </p>
            <div className="flex gap-4">
              <Button onClick={handlePeerSupportRegistration} disabled={showPeerSupport}>
                {showPeerSupport ? "Registering..." : "Join Peer Support"}
              </Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={() => router.push("/student/chatbot")} className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat with AI Support
          </Button>
          <Button variant="outline" onClick={() => router.push("/student/test")}>
            Retake Assessment
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Professional Help
          </Button>
        </div>
      </div>
    </div>
  )
}
