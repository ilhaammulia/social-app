
import { useState, useEffect, useCallback } from 'react';
import { postService } from '@/services/post-service';
import { useAuthStore } from '@/stores/auth-store';

export const useUser = () => {
    const { user, setUser } = useAuthStore()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUserPosts = useCallback(async () => {
        if (!user?.username) {
            return
        }

        try {
            setLoading(true);
            setError(null);
            const posts = await postService.getPostsByUser(user.username)
            setUser({ ...user, posts: posts.data.length })
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch user');
        } finally {
            setLoading(false);  
        }

    }, [user?.username]);
    
    useEffect(() => {
        loadUserPosts();
    }, [loadUserPosts]);

    return { user, loading, error, loadUserPosts };
};