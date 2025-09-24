"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Users, Heart, MessageCircle, CheckCircle } from "lucide-react"

export default function StudentSupportPage() {
  const [user, setUser] = useState<any>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    preferredName: "",
    contactMethod: "email",
    availability: "",
    supportGoals: "",
    experience: "",
  })
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (!currentUser || currentUser.role !== "student") {
      router.push("/")
      return
    }

    // Check if already registered
    const registered = localStorage.getItem(`peerSupport_${currentUser.id}`)
    if (registered) {
      setIsRegistered(true)
    }

    // Pre-fill form with user data
    setFormData((prev) => ({
      ...prev,
      preferredName: currentUser.name || "",
    }))
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleRegistration = async () => {
    if (!user) return

    setIsLoading(true)

    // Simulate registration process
    setTimeout(() => {
      localStorage.setItem(
        `peerSupport_${user.id}`,
        JSON.stringify({
          ...formData,
          registeredAt: new Date().toISOString(),
          status: "pending",
        }),
      )

      setIsRegistered(true)
      setIsLoading(false)
    }, 2000)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        </div>
      </div>
    )
  }

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto p-6">
          <Card className="text-center border-green-200 bg-green-50">
            <CardContent className="pt-8 pb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-700 mb-2">Registration Successful!</h1>
              <p className="text-green-600 mb-6">
                You've been successfully registered for our peer support network. You'll receive an email with next
                steps within 24 hours.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push("/student/report")}>Back to Report</Button>
                <Button variant="outline" onClick={() => router.push("/student/chatbot")}>
                  Chat with AI Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Join Peer Support Network</h1>
          <p className="text-muted-foreground">Connect with other students who understand your journey</p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Community Support</h3>
              <p className="text-sm text-muted-foreground">
                Connect with peers who share similar experiences and challenges
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Safe Environment</h3>
              <p className="text-sm text-muted-foreground">
                Share in a confidential, judgment-free space with trained facilitators
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Regular Meetings</h3>
              <p className="text-sm text-muted-foreground">Weekly virtual and in-person group sessions available</p>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Preferred Name</label>
              <Input
                value={formData.preferredName}
                onChange={(e) => handleInputChange("preferredName", e.target.value)}
                placeholder="How would you like to be addressed?"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Preferred Contact Method</label>
              <select
                className="w-full p-2 border border-input rounded-md bg-background"
                value={formData.contactMethod}
                onChange={(e) => handleInputChange("contactMethod", e.target.value)}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="text">Text Message</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Availability</label>
              <Input
                value={formData.availability}
                onChange={(e) => handleInputChange("availability", e.target.value)}
                placeholder="e.g., Weekday evenings, Weekend mornings"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">What are you hoping to gain from peer support?</label>
              <Textarea
                value={formData.supportGoals}
                onChange={(e) => handleInputChange("supportGoals", e.target.value)}
                placeholder="Share your goals and what you'd like to get out of this experience..."
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Previous Support Group Experience (Optional)</label>
              <Textarea
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                placeholder="Have you participated in support groups before? Any concerns or questions?"
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleRegistration}
                disabled={isLoading || !formData.preferredName.trim()}
                className="flex-1"
              >
                {isLoading ? "Registering..." : "Join Peer Support"}
              </Button>
              <Button variant="outline" onClick={() => router.push("/student/report")}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
