import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"
import { authService } from "@/services/auth-service"

interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
}

interface AuthActions {
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void
    checkAuth: () => Promise<void>
    refreshToken: () => Promise<void>
    logout: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            isAuthenticated: false,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setLoading: (loading) => set({ isLoading: loading }),

            logout: () => {
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                set({ user: null, isAuthenticated: false })
            },

            refreshToken: async () => {
                const storedRefresh = localStorage.getItem("refreshToken")
                if (!storedRefresh) return

                try {
                    const { accessToken, refreshToken } = await authService.refreshToken(storedRefresh)
                    localStorage.setItem("accessToken", accessToken)
                    localStorage.setItem("refreshToken", refreshToken)
                } catch {
                    get().logout()
                }
            },

            checkAuth: async () => {
                const token = localStorage.getItem("accessToken")
                const refreshToken = localStorage.getItem("refreshToken")

                if (!token && !refreshToken) {
                    set({ isAuthenticated: false, user: null, isLoading: false })
                    return
                }

                set({ isLoading: true })

                try {
                    const user = await authService.getCurrentUser()
                    set({ user, isAuthenticated: true, isLoading: false })
                } catch (error: any) {
                    if (error.response?.status === 401 && refreshToken) {
                        await get().refreshToken()
                        const newToken = localStorage.getItem("accessToken")
                        if (newToken) {
                            const user = await authService.getCurrentUser()
                            set({ user, isAuthenticated: true })
                        } else {
                            get().logout()
                        }
                    } else {
                        get().logout()
                    }
                    set({ isLoading: false })
                }
            },
        }),
        {
            name: "auth-store",
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
