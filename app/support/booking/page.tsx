"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-db"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { StudentCard } from "@/components/student-card"
import { BookingConfirmationDialog } from "@/components/booking-confirmation-dialog"
import { Search, Users, Calendar, AlertTriangle } from "lucide-react"

export default function SupportBookingPage() {
  const [students, setStudents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [autoRefreshing, setAutoRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const router = useRouter()
  const user = getCurrentUser()

  useEffect(() => {
    if (!user || user.role !== "support") {
      router.push("/")
      return
    }
    
    fetchAvailableStudents()
    
    // Set up auto-refresh every 30 seconds to catch new registrations
    const interval = setInterval(() => {
      fetchAvailableStudents(true)
    }, 30000)
    
    return () => clearInterval(interval)
  }, [router])

  const fetchAvailableStudents = async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setAutoRefreshing(true)
      } else {
        setLoading(true)
      }
      
      const response = await fetch('/api/available-students')
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students)
        setLastRefresh(new Date())
      } else {
        console.error('Failed to fetch available students')
      }
    } catch (error) {
      console.error('Error fetching available students:', error)
    } finally {
      if (isAutoRefresh) {
        setAutoRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

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

  const handleConfirmBooking = async (notes: string) => {
    if (!selectedStudent || !selectedTimeSlotId || !user) return

    try {
      const timeSlot = selectedStudent.availableSlots.find((slot: any) => slot.id === selectedTimeSlotId)
      if (!timeSlot) return

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          supportStaffId: user.id,
          timeSlotId: selectedTimeSlotId,
          date: timeSlot.date,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          notes
        })
      })

      if (response.ok) {
        // Refresh the data from server to get the most up-to-date state
        await fetchAvailableStudents(false)

        setShowConfirmDialog(false)
        setSelectedStudent(null)
        setSelectedTimeSlotId(null)

        // Show success message
        alert(
          `Successfully booked session with ${selectedStudent.name} on ${new Date(timeSlot.date).toLocaleDateString()} at ${timeSlot.startTime}`,
        )
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create booking')
      }
    } catch (error) {
      console.error("Booking failed:", error)
      alert(`Failed to book session: ${error instanceof Error ? error.message : 'Please try again.'}`)
    }
  }

  const totalAvailableSlots = students.reduce(
    (total: number, student: any) => total + student.availableSlots.filter((slot: any) => !slot.isBooked).length,
    0,
  )

  const highRiskStudents = students.filter((student) => student.riskLevel === "high").length

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Student Booking System</h1>
              <p className="text-muted-foreground">Schedule consultation sessions with students who need support</p>
            </div>
            <div className="flex items-center gap-2">
              {autoRefreshing && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-primary"></div>
                  Auto-refreshing...
                </div>
              )}
              {lastRefresh && !autoRefreshing && (
                <div className="text-xs text-muted-foreground">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </div>
              )}
              <Button
                onClick={() => fetchAvailableStudents(false)}
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
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
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">Loading available students...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredStudents.map((student: any) => (
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
          </>
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
