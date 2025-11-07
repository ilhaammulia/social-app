import { client } from '@/services/api'
import type { SingleUserResponse, UserResponse } from '@/types'

export const userService = {
    getUsers: async (params: { limit: number; skip: number; }): Promise<UserResponse> => {
        const response = await client.get<UserResponse>("/users", { params });
        return response.data;
    },

    getUserById: async (userId: string): Promise<SingleUserResponse> => {
        const response = await client.get<SingleUserResponse>(`/users/${userId}`);
        return response.data;
    },

    searchUsers: async (query: string): Promise<UserResponse> => {
        const response = await client.get<UserResponse>("/users/search", { params: { q: query } });
        return response.data;
    },
}