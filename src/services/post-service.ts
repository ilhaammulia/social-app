import { client } from "@/services/api"
import type { CommentResponse, PostFormData, PostResponse } from "@/types"

export const postService = {
    getPosts: async (): Promise<PostResponse> => {
        const response = await client.get<PostResponse>("/posts")
        return response.data
    },

    searchPosts: async (query: string): Promise<PostResponse> => {
        const response = await client.get<PostResponse>(`/posts/search?q=${query}`)
        return response.data
    },

    createPost: async (postData: PostFormData): Promise<PostResponse> => {
        const response = await client.post<PostResponse>("/posts", postData)
        return response.data
    },

    getPostsByUser: async (username: string): Promise<PostResponse> => {
        const response = await client.get<PostResponse>(`/users/${username}/posts`)
        return response.data
    },

    getCommentsByPost: async (postId: string): Promise<CommentResponse> => {
        const response = await client.get<CommentResponse>(`/posts/${postId}/comments`)
        return response.data
    },

    createComment: async (postId: string, commentData: { content: string }): Promise<PostResponse> => {
        const response = await client.post<PostResponse>(`/posts/${postId}/comments`, commentData)
        return response.data
    },

    likePost: async (postId: string): Promise<PostResponse> => {
        const response = await client.post<PostResponse>(`/posts/${postId}/likes`)
        return response.data
    },

    unlikePost: async (postId: string): Promise<PostResponse> => {
        const response = await client.post<PostResponse>(`/posts/${postId}/likes`)
        return response.data
    },
}