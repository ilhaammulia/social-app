import CommentPostCard from "@/components/shared/CommentPostCard";
import PostCard from "@/components/shared/PostCard";
import ProfileCard from "@/components/shared/ProfileCard";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePost";
import { processAvatarUrl } from "@/lib/utils";
import { userService } from "@/services/user-service";
import type { Post, User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";

function UserPage() {
    const { username } = useParams()
    const { user, logout } = useAuth()
    const { posts, loadPostsByUser } = usePosts()
    const [userProfile, setUserProfile] = useState<User | null>(null)
    const [currentPost, setCurrentPost] = useState<Post | null>(null)
    const [showCommentPostCard, setShowCommentPostCard] = useState(false)

    const loadUserProfile = async () => {
        try {
            if (username) {
                const response = await userService.getUserByUsername(username);
                setUserProfile(response.data);
            }
        } catch (error) {
            console.error("Error loading user profile:", error);
        }
    }

    useEffect(() => {
        if (username) {
            loadUserProfile();
            loadPostsByUser(username);
        }
    }, [username, loadPostsByUser]);

    return (
        <>
            <div className="w-full flex min-h-screen justify-center">
                <div className="hidden xl:block w-[20%] sticky top-0 h-screen">
                    <div className="h-full overflow-y-auto p-2">
                        <ProfileCard
                            user={{
                                id: user?.id || '',
                                username: user?.username || '',
                                email: user?.email || '',
                                bio: user?.bio || '',
                                avatar: user?.avatar || '',
                                posts: user?.posts || 0,
                                following: user?.following || 0,
                                followers: user?.followers || 0,
                            }}
                            onLogout={logout}
                        />
                    </div>
                </div>

                <div className="flex-1 max-w-2xl border-x border-gray-200 bg-white">
                    <div className="flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-200">
                        <div className="flex items-center gap-4 p-4">
                            <NavLink to={`/`} className="font-semibold text-gray-900 text-[15px] leading-5 hover:underline">
                                <ArrowLeft className="h-5 w-5" />
                            </NavLink>
                            <h1 className="text-xl font-semibold">Profile</h1>
                        </div>
                    </div>

                    <div className="h-[calc(100vh-73px)] overflow-y-auto">
                        <div className="border-b border-gray-200">
                            <div className="bg-white border-b border-gray-200">
                                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                                    <div className="absolute -bottom-16 left-4 pb-4">
                                        <Avatar className="h-12 w-12 flex-shrink-0">
                                            <AvatarImage src={processAvatarUrl(userProfile?.avatar || '')} alt={userProfile?.username} />
                                            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                                                {userProfile?.username?.charAt(0).toUpperCase() || ''}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>

                                <div className="pt-16 px-4 pb-4 flex justify-between">
                                    <div className="space-y-3">
                                        <div>
                                            <h1 className="text-2xl font-bold">@{userProfile?.username}</h1>
                                        </div>

                                        {userProfile?.bio && (
                                            <p className="text-gray-900 leading-relaxed">{userProfile?.bio}</p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                                            {userProfile?.created_at && (
                                                <div className="flex items-center">
                                                    <CalendarDays className="h-4 w-4 mr-1" />
                                                    Joined {new Date(userProfile?.created_at || '').toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-6 text-sm">
                                            <div className="flex items-center space-x-1 cursor-pointer hover:underline">
                                                <span className="font-bold text-gray-900">{userProfile?.following?.toLocaleString() || '0'}</span>
                                                <span className="text-gray-500">Following</span>
                                            </div>
                                            <div className="flex items-center space-x-1 cursor-pointer hover:underline">
                                                <span className="font-bold text-gray-900">{userProfile?.followers?.toLocaleString() || '0'}</span>
                                                <span className="text-gray-500">Followers</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            {posts.length > 0 &&
                                posts.map((post) => (
                                    <PostCard key={post.id} post={post} showFollowButton={false} onComment={() => { setCurrentPost(post); setShowCommentPostCard(true) }} />
                                ))}
                            <CommentPostCard post={currentPost} isOpen={showCommentPostCard} onClose={() => setShowCommentPostCard(false)} onReply={() => { }} />
                            {posts.length === 0 && (
                                <div className="text-center text-gray-500 py-8">
                                    No posts yet. Start by creating one!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="hidden xl:block w-[20%] sticky top-0 h-screen">
                    <div className="h-full overflow-y-auto p-4">
                        <div className="w-full">
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserPage;