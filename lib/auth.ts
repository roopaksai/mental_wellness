export type UserRole = "student" | "admin" | "support"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

// Mock users for testing
const mockUsers: User[] = [
  { id: "1", email: "student@test.com", name: "Alex Student", role: "student" },
  { id: "2", email: "admin@test.com", name: "Sarah Admin", role: "admin" },
  { id: "3", email: "support@test.com", name: "Dr. Mike Support", role: "support" },
  { id: "4", email: "student2@test.com", name: "Jamie Student", role: "student" },
]

export const authenticateUser = (email: string, password: string): User | null => {
  // Simple mock authentication
  if (password === "password123") {
    return mockUsers.find((user) => user.email === email) || null
  }
  return null
}

export const getCurrentUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("currentUser")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export const setCurrentUser = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}

export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}
