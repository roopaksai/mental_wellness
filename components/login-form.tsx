"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authenticateUser, setCurrentUser } from "@/lib/auth"
import { AlertCircle } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = authenticateUser(email, password)

      if (user) {
        setCurrentUser(user)

        // Role-based routing
        switch (user.role) {
          case "student":
            const existingResult = localStorage.getItem("latestTestResult")
            if (existingResult) {
              router.push("/student/report")
            } else {
              router.push("/student/test")
            }
            break
          case "admin":
            router.push("/admin/dashboard")
            break
          case "support":
            router.push("/support/booking")
            break
          default:
            setError("Invalid user role")
        }
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome to MindCare</CardTitle>
        <CardDescription>Sign in to access your mental health support platform</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-muted-foreground">
          <p className="font-medium mb-2">Demo Accounts:</p>
          <div className="space-y-1">
            <p>Student: student@test.com</p>
            <p>Admin: admin@test.com</p>
            <p>Support: support@test.com</p>
            <p className="text-xs mt-2">Password: password123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
