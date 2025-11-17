import { client } from '@/services/api'
import type { UploadResponse } from '@/types'

export const uploadService = {
    upload: async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        const response = await client.post<UploadResponse>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    }
}