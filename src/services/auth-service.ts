import { client } from '@/services/api'
import type { LoginResponse, User } from '@/types'

export const authService = {
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const response = await client.post<LoginResponse>("/auth/login", {
            username,
            password,
        });

        if (response.data.accessToken && response.data.refreshToken) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
        }

        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await client.get<User>("/auth/me");
        return response.data;
    },

    refreshToken: async (token: string): Promise<LoginResponse> => {
        const response = await client.post<LoginResponse>("/auth/refresh", {
            refreshToken: token,
        });

        return response.data;
    }
};