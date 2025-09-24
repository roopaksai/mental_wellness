export interface AvailableStudent {
  id: string
  name: string
  email: string
  riskLevel: "low" | "moderate" | "high"
  lastAssessment: Date | string | null
  phq9Score: number
  parsScore: number
  preferredContactMethod: "email" | "phone" | "video"
  availableSlots: TimeSlot[]
  notes?: string
}

export interface TimeSlot {
  id: string
  date: Date | string  
  startTime: string
  endTime: string
  isBooked: boolean
  bookedBy?: string
}

export interface Booking {
  id: string
  studentId: string
  supportStaffId: string
  timeSlotId: string
  date: Date | string
  startTime: string
  endTime: string
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  notes?: string
  createdAt: Date | string
}

export interface StudentData {
  id: string
  name: string
  email: string
  lastAssessment: Date | string | null
  phq9Score: number
  parsScore: number
  riskLevel: "low" | "moderate" | "high"
  totalAssessments: number
}