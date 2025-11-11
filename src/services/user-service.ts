import { client } from '@/services/api'
import type { PostResponse, UserResponse } from '@/types'

export const userService = {
    getUsers: async (params: { limit: number; skip: number; }): Promise<UserResponse> => {
        const response = await client.get<UserResponse>("/users", { params });
        return response.data;
    },

    getUserById: async (userId: string): Promise<UserResponse> => {
        const response = await client.get<UserResponse>(`/users/${userId}`);
        return response.data;
    },

    searchUsers: async (query: string): Promise<UserResponse> => {
        const response = await client.get<UserResponse>("/users/search", { params: { q: query } });
        return response.data;
    },

    getUserPosts: async (username: string): Promise<PostResponse> => {
        const response = await client.get<PostResponse>(`/users/${username}/posts`);
        return response.data;
    },

    followUser: async (userId: string): Promise<UserResponse> => {
        const response = await client.post<UserResponse>(`/follows/${userId}`);
        return response.data;
    },

    unfollowUser: async (userId: string): Promise<UserResponse> => {
        const response = await client.post<UserResponse>(`/follows/${userId}`);
        return response.data;
    },
}