// Mock student data for admin dashboard
export interface StudentData {
  id: string
  name: string
  email: string
  lastAssessment: Date
  phq9Score: number
  parsScore: number
  riskLevel: "low" | "moderate" | "high"
  totalAssessments: number
}

export const mockStudentData: StudentData[] = [
  {
    id: "s1",
    name: "Emma Johnson",
    email: "emma.j@university.edu",
    lastAssessment: new Date("2024-01-15"),
    phq9Score: 8,
    parsScore: 12,
    riskLevel: "moderate",
    totalAssessments: 3,
  },
  {
    id: "s2",
    name: "Michael Chen",
    email: "m.chen@university.edu",
    lastAssessment: new Date("2024-01-14"),
    phq9Score: 15,
    parsScore: 18,
    riskLevel: "high",
    totalAssessments: 2,
  },
  {
    id: "s3",
    name: "Sarah Williams",
    email: "s.williams@university.edu",
    lastAssessment: new Date("2024-01-13"),
    phq9Score: 4,
    parsScore: 6,
    riskLevel: "low",
    totalAssessments: 5,
  },
  {
    id: "s4",
    name: "David Rodriguez",
    email: "d.rodriguez@university.edu",
    lastAssessment: new Date("2024-01-12"),
    phq9Score: 11,
    parsScore: 14,
    riskLevel: "moderate",
    totalAssessments: 1,
  },
  {
    id: "s5",
    name: "Lisa Thompson",
    email: "l.thompson@university.edu",
    lastAssessment: new Date("2024-01-11"),
    phq9Score: 18,
    parsScore: 22,
    riskLevel: "high",
    totalAssessments: 4,
  },
  {
    id: "s6",
    name: "James Wilson",
    email: "j.wilson@university.edu",
    lastAssessment: new Date("2024-01-10"),
    phq9Score: 3,
    parsScore: 5,
    riskLevel: "low",
    totalAssessments: 2,
  },
  {
    id: "s7",
    name: "Maria Garcia",
    email: "m.garcia@university.edu",
    lastAssessment: new Date("2024-01-09"),
    phq9Score: 13,
    parsScore: 16,
    riskLevel: "high",
    totalAssessments: 3,
  },
  {
    id: "s8",
    name: "Robert Brown",
    email: "r.brown@university.edu",
    lastAssessment: new Date("2024-01-08"),
    phq9Score: 7,
    parsScore: 9,
    riskLevel: "moderate",
    totalAssessments: 6,
  },
]

export const getAnalyticsData = () => {
  const totalStudents = mockStudentData.length
  const riskDistribution = mockStudentData.reduce(
    (acc, student) => {
      acc[student.riskLevel]++
      return acc
    },
    { low: 0, moderate: 0, high: 0 },
  )

  const averageScores = {
    phq9: Math.round(mockStudentData.reduce((sum, student) => sum + student.phq9Score, 0) / totalStudents),
    pars: Math.round(mockStudentData.reduce((sum, student) => sum + student.parsScore, 0) / totalStudents),
  }

  const recentAssessments = mockStudentData.filter(
    (student) => new Date().getTime() - student.lastAssessment.getTime() < 7 * 24 * 60 * 60 * 1000,
  ).length

  return {
    totalStudents,
    riskDistribution,
    averageScores,
    recentAssessments,
  }
}

export const mockAdmins = [
  { id: "a1", name: "Dr. Sarah Admin", email: "admin@university.edu", role: "admin" as const },
  { id: "a2", name: "Prof. John Manager", email: "manager@university.edu", role: "admin" as const },
]
