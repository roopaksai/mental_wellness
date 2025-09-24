"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { StudentTable } from "@/components/student-table"
import { AddAdminDialog } from "@/components/add-admin-dialog"
import { getCurrentUser } from "@/lib/auth-db"
// Removed mock data imports - now using API calls
import { Users, TrendingUp, AlertTriangle, Calendar } from "lucide-react"

export default function AdminDashboardPage() {
  const [analyticsData, setAnalyticsData] = useState({
    totalStudents: 0,
    riskDistribution: { low: 0, moderate: 0, high: 0 },
    averageScores: { phq9: 0, pars: 0 },
    recentAssessments: 0
  })
  const [studentsData, setStudentsData] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const user = getCurrentUser()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch analytics data
      const analyticsResponse = await fetch('/api/analytics')
      if (analyticsResponse.ok) {
        const analytics = await analyticsResponse.json()
        setAnalyticsData(analytics)
      }

      // Fetch students data
      const studentsResponse = await fetch('/api/students')
      if (studentsResponse.ok) {
        const students = await studentsResponse.json()
        setStudentsData(students.students)
      }

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor student mental health and manage the platform</p>
          </div>
          <AddAdminDialog />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Active in the system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Students</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{analyticsData.riskDistribution.high}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Assessments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.recentAssessments}</div>
              <p className="text-xs text-muted-foreground">In the last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Depression Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.averageScores.phq9}</div>
              <p className="text-xs text-muted-foreground">PHQ-9 average (out of 18)</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="mb-8">
          <AnalyticsCharts
            riskDistribution={analyticsData.riskDistribution}
            averageScores={analyticsData.averageScores}
          />
        </div>

        {/* Student Table */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <StudentTable students={studentsData} />
        )}
      </div>
    </div>
  )
}
