import React, { useEffect } from 'react'
import { Navigate, useLocation, Outlet } from 'react-router'
import { useAuthStore } from "@/stores/auth-store"
import { Spinner } from '@/components/ui/spinner'

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            checkAuth();
        }
    }, [isAuthenticated, isLoading, checkAuth]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner className="size-12" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute