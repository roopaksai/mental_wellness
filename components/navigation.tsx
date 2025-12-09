"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getCurrentUser, logout } from "@/lib/auth-db"
import { LogOut, User } from "lucide-react"

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const currentUser = getCurrentUser()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!currentUser) return null

  // Determine current view based on path
  const isAdminView = pathname?.startsWith('/admin')
  const isSupportView = pathname?.startsWith('/support')
  const isStudentView = pathname?.startsWith('/student')

  // Get actual role from URL or user's primary role
  const currentRole = isAdminView ? 'admin' : isSupportView ? 'support' : 'student'

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary">MindCare</h1>
            <span className="text-sm text-muted-foreground capitalize">{currentRole} Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>{currentUser.name}</span>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
