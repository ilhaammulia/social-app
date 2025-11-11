import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserWithData } from "@/types"
import { authService } from "@/services/auth-service"

interface AuthState {
    user: UserWithData | null
    isLoading: boolean
    isAuthenticated: boolean
}

interface AuthActions {
    setUser: (user: UserWithData | null) => void
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
                localStorage.removeItem("token")
                set({ user: null, isAuthenticated: false })
            },

            refreshToken: async () => {
                try {
                    const data = await authService.refreshToken(get().user?.username || "",  "")
                    localStorage.setItem("token", data.data.token)
                } catch {
                    get().logout()
                }
            },

            checkAuth: async () => {
                const token = localStorage.getItem("token")

                if (!token) {
                    set({ isAuthenticated: false, user: null, isLoading: false })
                    return
                }

                set({ isLoading: true })

                try {
                    const user = await authService.getCurrentUser()
                    set({ user: user.data, isAuthenticated: true, isLoading: false })
                } catch (error: any) {
                    if (error.response?.status === 401 && error.response?.data?.token) {
                        await get().refreshToken()
                        const newToken = localStorage.getItem("token")
                        if (newToken) {
                            const user = await authService.getCurrentUser()
                            set({ user: user.data, isAuthenticated: true })
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
