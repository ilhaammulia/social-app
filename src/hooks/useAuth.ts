import { useAuthStore } from "@/stores/auth-store"

export const useAuth = () => {
    const { user, setUser, isAuthenticated, logout } = useAuthStore();

    return {
        user,
        setUser,
        isAuthenticated,
        logout,
    };
};