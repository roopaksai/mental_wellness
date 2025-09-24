"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ScoreVisualizationProps {
  phq9Score: number
  parsScore: number
  depressionLevel: string
  anxietyLevel: string
  showSeverity?: boolean
}

export function ScoreVisualization({
  phq9Score,
  parsScore,
  depressionLevel,
  anxietyLevel,
  showSeverity = false,
}: ScoreVisualizationProps) {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage < 25) return "text-primary"
    if (percentage < 50) return "text-yellow-500"
    if (percentage < 75) return "text-orange-500"
    return "text-red-500"
  }

  const getProgressColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage < 25) return "bg-primary"
    if (percentage < 50) return "bg-yellow-500"
    if (percentage < 75) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Depression Assessment (PHQ-9)
            <span className={`text-2xl font-bold ${getScoreColor(phq9Score, 18)}`}>{phq9Score}/18</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              {showSeverity && (
                <div className="flex justify-between text-sm mb-2">
                  <span>Severity Level</span>
                  <span className="font-medium">{depressionLevel}</span>
                </div>
              )}
              <Progress
                value={(phq9Score / 18) * 100}
                className="h-3"
                style={{
                  background: `linear-gradient(to right, ${getProgressColor(phq9Score, 18)} 0%, ${getProgressColor(phq9Score, 18)} 100%)`,
                }}
              />
            </div>
            {showSeverity ? (
              <p className="text-sm text-muted-foreground">
                Based on responses, this indicates {depressionLevel.toLowerCase()} depression symptoms.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your assessment results help us provide personalized support and recommendations.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Anxiety Assessment (PARS)
            <span className={`text-2xl font-bold ${getScoreColor(parsScore, 24)}`}>{parsScore}/24</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              {showSeverity && (
                <div className="flex justify-between text-sm mb-2">
                  <span>Severity Level</span>
                  <span className="font-medium">{anxietyLevel}</span>
                </div>
              )}
              <Progress
                value={(parsScore / 24) * 100}
                className="h-3"
                style={{
                  background: `linear-gradient(to right, ${getProgressColor(parsScore, 24)} 0%, ${getProgressColor(parsScore, 24)} 100%)`,
                }}
              />
            </div>
            {showSeverity ? (
              <p className="text-sm text-muted-foreground">
                Based on responses, this indicates {anxietyLevel.toLowerCase()} anxiety symptoms.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your assessment results help us provide personalized support and recommendations.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
