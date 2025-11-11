import { client } from '@/services/api'
import type { PostResponse, User, UserResponse } from '@/types'

export const userService = {
    getUsers: async (params: { limit: number; skip: number; }): Promise<UserResponse> => {
        const response = await client.get<UserResponse>("/users", { params });
        return response.data;
    },

    getUserById: async (userId: string): Promise<UserResponse> => {
        const response = await client.get<UserResponse>(`/users/${userId}`);
        return response.data;
    },

    updateUser: async (userData: Partial<User> & { avatarFile?: File }): Promise<UserResponse> => {
        const response = await client.put<UserResponse>(`/profile`, {
            ...userData,
            avatar: userData.avatarFile,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
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
        const response = await client.delete<UserResponse>(`/follows/${userId}`);
        return response.data;
    },
}