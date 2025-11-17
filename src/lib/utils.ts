import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const processAvatarUrl = (avatarUrl: string): string => {
    if (avatarUrl.startsWith('http')) {
        return avatarUrl;
    }
    
    if (avatarUrl.startsWith('/')) {
        avatarUrl = avatarUrl.replace('/api', '');
        return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${avatarUrl}`;
    }
    
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/uploads/avatars/${avatarUrl}`;
};
