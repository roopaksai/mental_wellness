"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { emergencyResources } from "@/lib/chatbot"
import { AlertTriangle, Phone, MessageSquare } from "lucide-react"

export function EmergencyResources() {
  const handleContactClick = (contact: string) => {
    if (contact.includes("988")) {
      window.open("tel:988", "_blank")
    } else if (contact.includes("741741")) {
      alert("To use Crisis Text Line, text HOME to 741741 from your mobile device.")
    } else {
      window.open(`tel:${contact.replace(/[^\d]/g, "")}`, "_blank")
    }
  }

  return (
    <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
          Emergency Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          If you're in crisis or having thoughts of self-harm, please reach out for immediate help:
        </p>
        <div className="space-y-3">
          {emergencyResources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{resource.name}</h4>
                <p className="text-xs text-muted-foreground">{resource.description}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleContactClick(resource.contact)} className="ml-3">
                {resource.contact.includes("Text") ? (
                  <MessageSquare className="h-4 w-4 mr-2" />
                ) : (
                  <Phone className="h-4 w-4 mr-2" />
                )}
                {resource.contact.includes("Text") ? "Text" : "Call"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
