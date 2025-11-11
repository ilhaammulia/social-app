import { SignupForm } from '@/components/form/register-form'
import { authService } from '@/services/auth-service'
import { useAuthStore } from '@/stores/auth-store'
import type { ApiError, RegisterFormData } from '@/types'
import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'

export default function Register() {
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError>()
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await authService.register({ username: data.username, password: data.password, email: data.email })
      navigate("/auth/login")
    } catch (err) {
      setError({ message: (err as any).response?.data?.message || "Unknown error" })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm onSubmit={onSubmit} isLoading={isLoading} error={error} />
      </div>
    </div>
  )
}
