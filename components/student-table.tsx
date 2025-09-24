"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StudentData } from "@/lib/mock-data"
import { Search, Eye, AlertTriangle } from "lucide-react"

interface StudentTableProps {
  students: StudentData[]
}

export function StudentTable({ students }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("all")

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRisk = riskFilter === "all" || student.riskLevel === riskFilter

    return matchesSearch && matchesRisk
  })

  const getRiskBadgeColor = (riskLevel: StudentData["riskLevel"]) => {
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

  const handleViewDetails = (studentId: string) => {
    // In a real app, this would navigate to detailed student view
    alert(`Viewing details for student ID: ${studentId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Student Reports
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-muted-foreground">
              {students.filter((s) => s.riskLevel === "high").length} high-risk students
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="moderate">Moderate Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Last Assessment</TableHead>
                <TableHead>PHQ-9</TableHead>
                <TableHead>PARS</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Total Tests</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.lastAssessment
                      ? new Date(student.lastAssessment).toLocaleDateString()
                      : 'No assessment'}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">{student.phq9Score}/18</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">{student.parsScore}/24</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskBadgeColor(student.riskLevel)}>
                      {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.totalAssessments}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(student.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No students found matching your search criteria.</div>
        )}
      </CardContent>
    </Card>
  )
}
