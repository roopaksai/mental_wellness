"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { QuestionCard } from "@/components/question-card"
import { getCurrentUser } from "@/lib/auth-db"
import { mentalHealthQuestions, calculateScores, type TestResponse, type TestResult } from "@/lib/questions"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function StudentTestPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<TestResponse[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = getCurrentUser()

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/")
    }
  }, [user, router])

  const currentQuestion = mentalHealthQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / mentalHealthQuestions.length) * 100
  const isLastQuestion = currentQuestionIndex === mentalHealthQuestions.length - 1

  const getCurrentResponse = () => {
    return responses.find((r) => r.questionId === currentQuestion.id)
  }

  const handleAnswerSelect = (answer: number) => {
    const newResponse: TestResponse = {
      questionId: currentQuestion.id,
      answer,
      category: currentQuestion.category,
    }

    setResponses((prev) => {
      const filtered = prev.filter((r) => r.questionId !== currentQuestion.id)
      return [...filtered, newResponse]
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < mentalHealthQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) return

    setIsSubmitting(true)

    try {
      const scores = calculateScores(responses)
      
      // Save assessment to database
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          answers: responses.map(r => ({
            questionId: r.questionId,
            answer: r.answer.toString(),
            score: r.answer
          }))
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Store result in localStorage for immediate access
        localStorage.setItem("latestTestResult", JSON.stringify({
          responses,
          phq9Score: scores.phq9Score,
          parsScore: scores.parsScore,
          completedAt: new Date(),
          userId: user.id,
          assessmentId: data.assessment.id
        }))

        // Redirect to report page
        router.push("/student/report")
      } else {
        throw new Error('Failed to save assessment')
      }
    } catch (error) {
      console.error("Error submitting test:", error)
      alert("Failed to submit assessment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = getCurrentResponse() !== undefined
  const allQuestionsAnswered = responses.length === mentalHealthQuestions.length

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Mental Health Assessment</h1>
          <p className="text-muted-foreground text-center mb-6">
            Please answer all questions honestly. This assessment will help us provide you with personalized support.
          </p>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="mb-8">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={mentalHealthQuestions.length}
            selectedAnswer={getCurrentResponse()?.answer ?? null}
            onAnswerSelect={handleAnswerSelect}
          />
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {responses.length} of {mentalHealthQuestions.length} questions answered
          </div>

          {isLastQuestion ? (
            <Button onClick={handleSubmit} disabled={!allQuestionsAnswered || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
