import { LoginForm } from '@/components/form/login-form'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { authService } from '@/services/auth-service'
import { useAuthStore } from '@/stores/auth-store'
import type { ApiError, LoginFormData } from '@/types'
import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'

export default function Login({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError>()
  const { setUser } = useAuth()
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await authService.login(data.username, data.password)
      setUser({ ...response })
      navigate("/")
    } catch (err) {
      setError({ message: (err as any).response?.data?.message || "Unknown error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex min-h-svh w-full items-center justify-center p-6 md:p-10", className)} {...props}>
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={onSubmit} isLoading={isLoading} error={error} />
      </div>
    </div>
  )
}