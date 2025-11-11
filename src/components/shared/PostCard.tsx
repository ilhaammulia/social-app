import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, UserIcon } from 'lucide-react'
import type { Post } from '@/types'
import { postService } from '@/services/post-service';
import { userService } from '@/services/user-service';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth-service';

interface PostCardProps {
    post: Post;
    onComment?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
    post,
    onComment,
}) => {
    const { user, setUser } = useAuth()
    const [isLiked, setIsLiked] = useState(post.is_liked)
    const [isFollowed, setIsFollowed] = useState(post.user.is_followed)
    const [likesCount, setLikesCount] = useState(post.likes_count || 0)

    const handleLike = async (postId: string) => {
        if (isLiked) {
            await postService.unlikePost(postId)
            setIsLiked(false)
            setLikesCount(likesCount - 1)
        } else {
            await postService.likePost(postId)
            setIsLiked(true)
            setLikesCount(likesCount + 1)
        }
    }

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
                        <AvatarImage src={post.user?.avatar || ''} alt={post.user?.username || 'User'} />  
                        <AvatarFallback>{post.user?.username?.[0].toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900 text-[15px] leading-5 hover:underline">
                                @{post.user?.username || 'anonymouse'}
                            </span>
                            <span className="text-gray-500">·</span>
                            <span className="text-gray-500 text-[15px]">
                                {post.created_at ? new Date(post.created_at).toLocaleString() : new Date().toLocaleString()}
                            </span>
                        </div>
                        {String(post.user?.id) !== String(user?.id) && (
                            <Button className="text-xs rounded-full px-4" variant={`${isFollowed ? "outline" : "default"}`} onClick={() => handleFollow(post.user?.id || '')}>
                                {isFollowed ? 'Unfollow' : 'Follow'}
                            </Button>
                        )}
                    </div>

                    <div className="mb-3">
                        <p className="text-gray-900 text-[15px] leading-5 whitespace-pre-wrap">
                            {post.content}
                        </p>
                        {post.media_url && (
                            <div className="mt-4 rounded-lg overflow-hidden">
                                <img
                                    src={post.media_url}
                                    alt="Post image"
                                    className="w-full h-auto object-cover max-h-96 rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between max-w-md">
                        <button
                            onClick={() => onComment?.()}
                            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200 group"
                        >
                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors duration-200">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <span className="text-[13px]">{post.comments_count || 0}</span>
                        </button>

                        <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-2 hover:text-red-500 transition-colors duration-200 group ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                        >
                            <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors duration-200">
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                            </div>
                            <span className="text-[13px]">{likesCount}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;