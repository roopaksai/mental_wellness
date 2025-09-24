"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Users, TrendingUp, AlertTriangle, Calendar } from "lucide-react"

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    try {
      const currentUser = getCurrentUser()
      console.log('Current user:', currentUser)
      
      if (!currentUser) {
        console.log('No user found, redirecting to login')
        router.push("/")
        return
      }

      if (currentUser.role !== "admin") {
        console.log('User is not admin, redirecting')
        router.push("/")
        return
      }

      setUser(currentUser)
    } catch (err) {
      console.error('Error in admin dashboard:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>

        {/* Simple Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Active in the system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Students</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">0</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Assessments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">In the last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Online</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">View Students</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Monitor student mental health status
                </p>
                <button className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">
                  View All Students
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Mental Health Trends</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  View assessment analytics
                </p>
                <button className="w-full px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm">
                  View Analytics
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">User Administration</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Manage users and permissions
                </p>
                <button className="w-full px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm">
                  Manage Users
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}