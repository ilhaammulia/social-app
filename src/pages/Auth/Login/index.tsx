import { LoginForm } from '@/components/form/login-form'
import { cn } from '@/lib/utils'

export default function Login({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex min-h-svh w-full items-center justify-center p-6 md:p-10", className)} {...props}>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}