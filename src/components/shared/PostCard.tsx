import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle } from 'lucide-react'
import type { Post, SingleUserResponse } from '@/types'
import { userService } from '@/services/user-service';

interface PostCardProps {
    post: Post;
    onLike?: (postId: string) => void;
    onComment?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
    post,
    onLike,
    onComment,
}) => {
    const [author, setAuthor] = useState<SingleUserResponse>()
    
    useEffect(() => {
        userService.getUserById(post.userId).then((author) => setAuthor(author))
    }, [post.userId])
    

    return (
        <div className="w-full max-w-7xl mx-auto p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <Avatar>
                        <AvatarImage src={author?.image} alt={author?.username} />  
                        <AvatarFallback>
                            {author?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900 text-[15px] leading-5 hover:underline">
                            @{author?.username}
                        </span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500 text-[15px]">
                            {post.createdAt ? post.createdAt.toLocaleString() : new Date().toLocaleString()}
                        </span>
                    </div>

                    <div className="mb-3">
                        <p className="text-gray-900 text-[15px] leading-5 whitespace-pre-wrap">
                            {post.body}
                        </p>
                        {post.mediaUrl && (
                            <div className="mt-4 rounded-lg overflow-hidden">
                                <img
                                    src={post.mediaUrl}
                                    alt="Post image"
                                    className="w-full h-auto object-cover max-h-96 rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between max-w-md">
                        <button
                            onClick={() => onComment?.(post.id)}
                            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200 group"
                        >
                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors duration-200">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <span className="text-[13px]">{post.reactions.comments || 0}</span>
                        </button>

                        <button
                            onClick={() => onLike?.(post.id)}
                            className={`flex items-center space-x-2 hover:text-red-500 transition-colors duration-200 group ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                        >
                            <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors duration-200">
                                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            </div>
                            <span className="text-[13px]">{post.reactions.likes || 0}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;