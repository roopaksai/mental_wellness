export interface AvailableStudent {
  id: string
  name: string
  email: string
  riskLevel: "low" | "moderate" | "high"
  lastAssessment: Date
  phq9Score: number
  parsScore: number
  preferredContactMethod: "email" | "phone" | "video"
  availableSlots: TimeSlot[]
  notes?: string
}

export interface TimeSlot {
  id: string
  date: Date
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
  date: Date
  startTime: string
  endTime: string
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  notes?: string
  createdAt: Date
}

// Mock available students who have opted for support
export const mockAvailableStudents: AvailableStudent[] = [
  {
    id: "s2",
    name: "Michael Chen",
    email: "m.chen@university.edu",
    riskLevel: "high",
    lastAssessment: new Date("2024-01-14"),
    phq9Score: 15,
    parsScore: 18,
    preferredContactMethod: "video",
    notes: "Experiencing high anxiety levels, prefers evening sessions",
    availableSlots: [
      {
        id: "slot1",
        date: new Date("2024-01-20"),
        startTime: "14:00",
        endTime: "15:00",
        isBooked: false,
      },
      {
        id: "slot2",
        date: new Date("2024-01-21"),
        startTime: "16:00",
        endTime: "17:00",
        isBooked: false,
      },
      {
        id: "slot3",
        date: new Date("2024-01-22"),
        startTime: "18:00",
        endTime: "19:00",
        isBooked: false,
      },
    ],
  },
  {
    id: "s5",
    name: "Lisa Thompson",
    email: "l.thompson@university.edu",
    riskLevel: "high",
    lastAssessment: new Date("2024-01-11"),
    phq9Score: 18,
    parsScore: 22,
    preferredContactMethod: "phone",
    notes: "Dealing with depression, flexible with timing",
    availableSlots: [
      {
        id: "slot4",
        date: new Date("2024-01-19"),
        startTime: "10:00",
        endTime: "11:00",
        isBooked: false,
      },
      {
        id: "slot5",
        date: new Date("2024-01-20"),
        startTime: "11:00",
        endTime: "12:00",
        isBooked: false,
      },
      {
        id: "slot6",
        date: new Date("2024-01-23"),
        startTime: "15:00",
        endTime: "16:00",
        isBooked: false,
      },
    ],
  },
  {
    id: "s7",
    name: "Maria Garcia",
    email: "m.garcia@university.edu",
    riskLevel: "high",
    lastAssessment: new Date("2024-01-09"),
    phq9Score: 13,
    parsScore: 16,
    preferredContactMethod: "email",
    notes: "First-time seeking support, may need extra encouragement",
    availableSlots: [
      {
        id: "slot7",
        date: new Date("2024-01-21"),
        startTime: "13:00",
        endTime: "14:00",
        isBooked: false,
      },
      {
        id: "slot8",
        date: new Date("2024-01-24"),
        startTime: "14:00",
        endTime: "15:00",
        isBooked: false,
      },
    ],
  },
  {
    id: "s1",
    name: "Emma Johnson",
    email: "emma.j@university.edu",
    riskLevel: "moderate",
    lastAssessment: new Date("2024-01-15"),
    phq9Score: 8,
    parsScore: 12,
    preferredContactMethod: "video",
    notes: "Regular check-ins, good progress",
    availableSlots: [
      {
        id: "slot9",
        date: new Date("2024-01-22"),
        startTime: "10:00",
        endTime: "11:00",
        isBooked: false,
      },
      {
        id: "slot10",
        date: new Date("2024-01-25"),
        startTime: "16:00",
        endTime: "17:00",
        isBooked: false,
      },
    ],
  },
  {
    id: "s4",
    name: "David Rodriguez",
    email: "d.rodriguez@university.edu",
    riskLevel: "moderate",
    lastAssessment: new Date("2024-01-12"),
    phq9Score: 11,
    parsScore: 14,
    preferredContactMethod: "phone",
    notes: "Academic stress, prefers morning sessions",
    availableSlots: [
      {
        id: "slot11",
        date: new Date("2024-01-23"),
        startTime: "09:00",
        endTime: "10:00",
        isBooked: false,
      },
      {
        id: "slot12",
        date: new Date("2024-01-24"),
        startTime: "09:30",
        endTime: "10:30",
        isBooked: false,
      },
    ],
  },
]

export const mockBookings: Booking[] = [
  {
    id: "b1",
    studentId: "s2",
    supportStaffId: "support1",
    timeSlotId: "slot1",
    date: new Date("2024-01-18"),
    startTime: "14:00",
    endTime: "15:00",
    status: "completed",
    notes: "Good session, student showed improvement",
    createdAt: new Date("2024-01-15"),
  },
]

export const bookTimeSlot = (
  studentId: string,
  timeSlotId: string,
  supportStaffId: string,
  notes?: string,
): Booking => {
  const student = mockAvailableStudents.find((s) => s.id === studentId)
  const timeSlot = student?.availableSlots.find((slot) => slot.id === timeSlotId)

  if (!student || !timeSlot) {
    throw new Error("Student or time slot not found")
  }

  const booking: Booking = {
    id: `b${Date.now()}`,
    studentId,
    supportStaffId,
    timeSlotId,
    date: timeSlot.date,
    startTime: timeSlot.startTime,
    endTime: timeSlot.endTime,
    status: "scheduled",
    notes,
    createdAt: new Date(),
  }

  // Mark slot as booked
  timeSlot.isBooked = true
  timeSlot.bookedBy = supportStaffId

  return booking
}
