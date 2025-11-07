
import { useState, useEffect } from 'react';
import { userService } from '@/services/user-service'
import type { User } from '@/types';

export const useUser = (userId: string) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        let mounted = true;

        const loadUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const userData = await userService.getUserById(userId);
                if (mounted) {
                    setUser(userData);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch user');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadUser();

        return () => {
            mounted = false;
        };
    }, [userId]);

    return { user, loading, error };
};