import { client } from "@/services/api"
import type { PostResponse } from "@/types"

export const postService = {
    getPosts: async (): Promise<PostResponse> => {
        const response = await client.get<PostResponse>("/posts")
        return response.data
    },

    searchPosts: async (query: string): Promise<PostResponse> => {
        const response = await client.get<PostResponse>(`/posts/search?q=${query}`)
        return response.data
    },
}