"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { StudentCard } from "@/components/student-card"
import { BookingConfirmationDialog } from "@/components/booking-confirmation-dialog"
import { getCurrentUser } from "@/lib/auth"
import { mockAvailableStudents, bookTimeSlot, type AvailableStudent } from "@/lib/booking-data"
import { Search, Users, Calendar, AlertTriangle } from "lucide-react"

export default function SupportBookingPage() {
  const [students, setStudents] = useState(mockAvailableStudents)
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [selectedStudent, setSelectedStudent] = useState<AvailableStudent | null>(null)
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const router = useRouter()
  const user = getCurrentUser()

  useEffect(() => {
    if (!user || user.role !== "support") {
      router.push("/")
    }
  }, [user, router])

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRisk = riskFilter === "all" || student.riskLevel === riskFilter

    return matchesSearch && matchesRisk
  })

  const handleBookSlot = (studentId: string, timeSlotId: string) => {
    const student = students.find((s) => s.id === studentId)
    if (student) {
      setSelectedStudent(student)
      setSelectedTimeSlotId(timeSlotId)
      setShowConfirmDialog(true)
    }
  }

  const handleConfirmBooking = (notes: string) => {
    if (!selectedStudent || !selectedTimeSlotId || !user) return

    try {
      const booking = bookTimeSlot(selectedStudent.id, selectedTimeSlotId, user.id, notes)

      // Update the students state to reflect the booked slot
      setStudents((prev) =>
        prev.map((student) =>
          student.id === selectedStudent.id
            ? {
                ...student,
                availableSlots: student.availableSlots.map((slot) =>
                  slot.id === selectedTimeSlotId ? { ...slot, isBooked: true, bookedBy: user.id } : slot,
                ),
              }
            : student,
        ),
      )

      setShowConfirmDialog(false)
      setSelectedStudent(null)
      setSelectedTimeSlotId(null)

      // Show success message
      alert(
        `Successfully booked session with ${selectedStudent.name} on ${booking.date.toLocaleDateString()} at ${booking.startTime}`,
      )
    } catch (error) {
      console.error("Booking failed:", error)
      alert("Failed to book session. Please try again.")
    }
  }

  const totalAvailableSlots = students.reduce(
    (total, student) => total + student.availableSlots.filter((slot) => !slot.isBooked).length,
    0,
  )

  const highRiskStudents = students.filter((student) => student.riskLevel === "high").length

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Booking System</h1>
          <p className="text-muted-foreground">Schedule consultation sessions with students who need support</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">Students seeking support</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk Students</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{highRiskStudents}</div>
              <p className="text-xs text-muted-foreground">Require priority attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAvailableSlots}</div>
              <p className="text-xs text-muted-foreground">Open time slots</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="moderate">Moderate Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Student Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} onBookSlot={handleBookSlot} />
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No students found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
          </div>
        )}

        {/* Booking Confirmation Dialog */}
        <BookingConfirmationDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          student={selectedStudent}
          timeSlotId={selectedTimeSlotId}
          onConfirm={handleConfirmBooking}
        />
      </div>
    </div>
  )
}
