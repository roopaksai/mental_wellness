"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { AvailableStudent } from "@/lib/booking-data"
import { Calendar, Clock, Mail, Phone, Video, AlertTriangle } from "lucide-react"

interface StudentCardProps {
  student: AvailableStudent
  onBookSlot: (studentId: string, timeSlotId: string) => void
}

export function StudentCard({ student, onBookSlot }: StudentCardProps) {
  const getRiskBadgeColor = (riskLevel: AvailableStudent["riskLevel"]) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "moderate":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "high":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const getContactIcon = (method: AvailableStudent["preferredContactMethod"]) => {
    switch (method) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const availableSlots = student.availableSlots.filter((slot) => !slot.isBooked)

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{student.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{student.email}</p>
          </div>
          <div className="flex items-center gap-2">
            {student.riskLevel === "high" && <AlertTriangle className="h-4 w-4 text-red-500" />}
            <Badge className={getRiskBadgeColor(student.riskLevel)}>
              {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)} Risk
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Assessment Scores */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">PHQ-9:</span>
            <span className="ml-2 font-mono">{student.phq9Score}/18</span>
          </div>
          <div>
            <span className="text-muted-foreground">PARS:</span>
            <span className="ml-2 font-mono">{student.parsScore}/24</span>
          </div>
        </div>

        {/* Contact Preference */}
        <div className="flex items-center gap-2 text-sm">
          {getContactIcon(student.preferredContactMethod)}
          <span className="text-muted-foreground">Prefers {student.preferredContactMethod}</span>
        </div>

        {/* Last Assessment */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Last assessment: {student.lastAssessment
            ? new Date(student.lastAssessment).toLocaleDateString()
            : 'No assessment'}
        </div>

        {/* Notes */}
        {student.notes && (
          <div className="text-sm">
            <span className="text-muted-foreground">Notes:</span>
            <p className="mt-1 text-sm">{student.notes}</p>
          </div>
        )}

        {/* Available Slots or Registration Status */}
        <div>
          {(student as any).isRegisteredForSupport === false ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Not Registered for Peer Support
              </h4>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-sm text-orange-800 mb-2">
                  This student has a {student.riskLevel} risk level but hasn't registered for peer support.
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.open(`mailto:${student.email}?subject=Mental Health Support Available&body=Hi ${student.name},%0A%0AWe noticed you might benefit from our peer support program. Please consider registering for support through our platform.`, '_blank')
                  }}
                >
                  Send Support Email
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Available Slots ({availableSlots.length})
              </h4>
              {availableSlots.length > 0 ? (
                <div className="space-y-2">
                  {availableSlots.slice(0, 3).map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-2 border border-border rounded">
                      <div className="text-sm">
                        <div className="font-medium">{new Date(slot.date).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                      <Button size="sm" onClick={() => onBookSlot(student.id, slot.id)}>
                        Book
                      </Button>
                    </div>
                  ))}
                  {availableSlots.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{availableSlots.length - 3} more slots available</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No available slots</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
