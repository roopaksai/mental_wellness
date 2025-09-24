import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">MindCare</h1>
          <p className="text-muted-foreground">Professional Mental Health Support Platform</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
