import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserIcon } from 'lucide-react'
import { userService } from '@/services/user-service';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth-service';
import type { Comment } from '@/types';

interface CommentCardProps {
    comment: Comment;
    onComment?: () => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
    comment,
}) => {
    const { user, setUser } = useAuth()
    const [isFollowed, setIsFollowed] = useState(comment.user.is_followed)

    const handleFollow = async (userId: string) => {
        try {
            if (isFollowed) {
            await userService.unfollowUser(userId);
            } else {
            await userService.followUser(userId);
            }
            
            setIsFollowed(!isFollowed);
            
            const userResponse = await authService.getCurrentUser();
            if (userResponse.data) {
                if (user) {
                    setUser({
                        ...user,
                        followers: userResponse.data.followers,
                        following: userResponse.data.following,
                    });
                }
            }
        } catch (error) {
            setIsFollowed(isFollowed);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <Avatar>
                        <AvatarImage src={comment.user?.avatar || ''} alt={comment.user?.username || 'User'} />  
                        <AvatarFallback>{comment.user?.username?.[0].toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900 text-[15px] leading-5 hover:underline">
                                @{comment.user?.username || 'anonymouse'}
                            </span>
                            <span className="text-gray-500">·</span>
                            <span className="text-gray-500 text-[15px]">
                                {comment.created_at ? new Date(comment.created_at).toLocaleString() : new Date().toLocaleString()}
                            </span>
                        </div>
                        {String(comment.user?.id) !== String(user?.id) && (
                            <Button className="text-xs rounded-full px-4" variant={`${isFollowed ? "outline" : "default"}`} onClick={() => handleFollow(comment.user?.id || '')}>
                                {isFollowed ? 'Unfollow' : 'Follow'}
                            </Button>
                        )}
                    </div>

                    <div className="mb-3">
                        <p className="text-gray-900 text-[15px] leading-5 whitespace-pre-wrap">
                            {comment.body}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
