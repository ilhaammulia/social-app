import { client } from '@/services/api'
import type { LoginResponse, RegisterFormData, RegisterResponse, UserResponse } from '@/types'

export const authService = {
    login: async (username: string, password: string): Promise<LoginResponse> => {
        const response = await client.post<LoginResponse>("/auth/login", {
            username,
            password,
        });

        if (response.data?.data?.token) {
            localStorage.setItem("token", response.data.data.token);
        }

        return response.data;
    },

    register: async (user: RegisterFormData): Promise<RegisterResponse> => {
        const response = await client.post<RegisterResponse>("/auth/register", user, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    getCurrentUser: async (): Promise<UserResponse> => {
        const response = await client.get<UserResponse>("/profile");
        return response.data;
    },

    refreshToken: async (username: string, password: string): Promise<LoginResponse> => {
        const response = await client.post<LoginResponse>("/auth/login", {
            username,
            password,
        }, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.data.data.token) {
            localStorage.setItem("token", response.data.data.token);
        }

        return response.data;
    }
};