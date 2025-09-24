"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { AvailableStudent } from "@/lib/booking-data"
import { Calendar, Clock, User, AlertTriangle } from "lucide-react"

interface BookingConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: AvailableStudent | null
  timeSlotId: string | null
  onConfirm: (notes: string) => void
}

export function BookingConfirmationDialog({
  open,
  onOpenChange,
  student,
  timeSlotId,
  onConfirm,
}: BookingConfirmationDialogProps) {
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const timeSlot = student?.availableSlots.find((slot) => slot.id === timeSlotId)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      onConfirm(notes)
      setNotes("")
    } finally {
      setIsLoading(false)
    }
  }

  if (!student || !timeSlot) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription>You are about to book a consultation session with this student.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Student Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{student.name}</span>
              {student.riskLevel === "high" && <AlertTriangle className="h-4 w-4 text-red-500" />}
            </div>
            <p className="text-sm text-muted-foreground">{student.email}</p>
          </div>

          {/* Session Details */}
          <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{new Date(timeSlot.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {timeSlot.startTime} - {timeSlot.endTime}
              </span>
            </div>
          </div>

          {/* Student Context */}
          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Assessment Scores:</p>
            <p>
              PHQ-9: {student.phq9Score}/18 | PARS: {student.parsScore}/24
            </p>
            {student.notes && (
              <>
                <p className="text-muted-foreground mt-2 mb-1">Student Notes:</p>
                <p className="text-sm">{student.notes}</p>
              </>
            )}
          </div>

          {/* Session Notes */}
          <div className="space-y-2">
            <Label htmlFor="session-notes">Session Notes (Optional)</Label>
            <Textarea
              id="session-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this session or preparation needed..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
