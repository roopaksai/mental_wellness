"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authenticateUser, registerUser, setCurrentUser } from "@/lib/auth-db"
import { AlertCircle } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      let user
      
      if (isSignUp) {
        // Register new student
        if (!name.trim()) {
          setError("Name is required for registration")
          return
        }
        user = await registerUser(email, password, name, 'student')
        if (!user) {
          setError("Registration failed. Email may already be in use.")
          return
        }
      } else {
        // Login existing user
        user = await authenticateUser(email, password)
        if (!user) {
          setError("Invalid email or password")
          return
        }
      }

      setCurrentUser(user)

      // Route based on user role
      if (user.role === 'admin') {
        router.push("/admin/dashboard")
      } else if (user.role === 'support') {
        router.push("/support/booking")
      } else if (user.role === 'student') {
        const existingResult = localStorage.getItem("latestTestResult")
        if (existingResult) {
          router.push("/student/report")
        } else {
          router.push("/student/test")
        }
      } else {
        setError("Invalid user role")
      }
    } catch (err) {
      setError(isSignUp ? "Registration failed. Please try again." : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome to MindCare</CardTitle>
        <CardDescription>
          {isSignUp 
            ? "Create your student account to access mental health support" 
            : "Sign in to access your mental health support platform"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

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
            {isLoading 
              ? (isSignUp ? "Creating Account..." : "Signing in...") 
              : (isSignUp ? "Create Student Account" : "Sign In")
            }
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError("")
              setName("")
            }}
            className="text-sm text-muted-foreground hover:text-primary underline"
          >
            {isSignUp 
              ? "Already have an account? Sign in" 
              : "New student? Create an account"
            }
          </button>
        </div>

        {/* <div className="mt-6 text-sm text-muted-foreground">
          <p className="font-medium mb-2">Demo Accounts:</p>
          <div className="space-y-1">
            <p>Student: student@test.com</p>
            <p>Admin: admin@test.com</p>
            <p>Support: support@test.com</p>
            <p className="text-xs mt-2">Password: password123</p>
          </div>
        </div> */}
      </CardContent>
    </Card>
  )
}
