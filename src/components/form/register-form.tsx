import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ApiError, RegisterFormData } from "@/types"
import { useForm } from "react-hook-form"
import { NavLink } from "react-router"

interface RegisterFormProps {
    className?: string;
    onSubmit: (data: RegisterFormData) => void;
    isLoading?: boolean;
    error?: ApiError;
}

export function SignupForm({ className, onSubmit, isLoading, error }: RegisterFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

    return (
        <Card className={cn("w-full max-w-sm", className)}>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input
                                id="username"
                                type="text"
                                placeholder="johndoe"
                                {...register('username', {
                                    required: 'Username is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9_]+$/,
                                        message: 'Invalid username',
                                    },
                                })}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm">
                                    {errors.username.message}
                                </p>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...register('email', {
                                    required: 'Email is required',
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">
                                    {errors.email.message}
                                </p>
                            )}
                            <FieldDescription>
                                We&apos;ll use this to contact you. We will not share your email
                                with anyone else.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters long',
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm">
                                    {errors.password.message}
                                </p>
                            )}
                            <FieldDescription>
                                Must be at least 8 characters long.
                            </FieldDescription>
                        </Field>
                        <FieldGroup>
                            <Field>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </Field>
                            {error && (
                                <p className="text-red-500 text-sm">
                                    {error.message}
                                </p>
                            )}
                            <Field>
                                <FieldDescription className="px-6 text-center">
                                    Already have an account? <NavLink to="/auth/login">Sign in</NavLink>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
