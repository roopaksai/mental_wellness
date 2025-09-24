"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AnalyticsChartsProps {
  riskDistribution: { low: number; moderate: number; high: number }
  averageScores: { phq9: number; pars: number }
}

export function AnalyticsCharts({ riskDistribution, averageScores }: AnalyticsChartsProps) {
  const riskData = [
    { name: "Low Risk", value: riskDistribution.low, color: "#10b981" },
    { name: "Moderate Risk", value: riskDistribution.moderate, color: "#f59e0b" },
    { name: "High Risk", value: riskDistribution.high, color: "#ef4444" },
  ]

  const scoreData = [
    { name: "PHQ-9 (Depression)", score: averageScores.phq9, maxScore: 18 },
    { name: "PARS (Anxiety)", score: averageScores.pars, maxScore: 24 },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Risk Level Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Assessment Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
