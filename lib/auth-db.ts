export type UserRole = "student" | "admin" | "support"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

// Client-side authentication functions
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      return data.user
    }
    
    return null
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export const registerUser = async (email: string, password: string, name: string, role: UserRole = 'student'): Promise<User | null> => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, role }),
    })

    if (response.ok) {
      const data = await response.json()
      return data.user
    }
    
    return null
  } catch (error) {
    console.error('Registration error:', error)
    return null
  }
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