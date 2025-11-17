import PostCard from '@/components/shared/PostCard'
import CreatePost from '@/components/shared/CreatePost'
import ProfileCard from '@/components/shared/ProfileCard'
import { usePosts } from '@/hooks/usePost'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { Post, PostFormData, PostResponse } from '@/types'
import { postService } from '@/services/post-service'
import { useUser } from '@/hooks/useUser'
import CommentPostCard from '@/components/shared/CommentPostCard'
import { uploadService } from '@/services/upload-service'

function Home() {
    const { user, logout } = useAuth()
    const { posts, loading, error, refetch, setError } = usePosts()
    const { loadUserPosts } = useUser()
    const [currentPost, setCurrentPost] = useState<Post | null>(null)
    const [showCommentPostCard, setShowCommentPostCard] = useState(false)

    useEffect(() => {
        loadUserPosts()
    }, [loadUserPosts])

    useEffect(() => {
        refetch()
    }, [refetch])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    const handleCreatePost = async (postData: PostFormData, images: File[]) => {
        try {
            if (images.length > 0) {
                const media = await uploadService.upload(images[0])
                postData.media = media.data?.url || ''
            }
            await postService.createPost(postData)
        } catch (error) {
            setError((error as PostResponse).message || 'Failed to create post')
        } finally {
            refetch()
            loadUserPosts()
        }
    }

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
                        <div className="p-4">
                            <h1 className="text-xl font-semibold">Home</h1>
                        </div>
                    </div>

                    <div className="h-[calc(100vh-73px)] overflow-y-auto">
                        <div className="p-4 border-b border-gray-200">
                            <CreatePost
                                currentUser={{
                                    username: user?.username || '',
                                    avatar: user?.avatar || '',
                                }}
                                onSubmit={handleCreatePost}
                            />
                        </div>

                        <div>
                            {posts.length > 0 &&
                                posts.map((post) => (
                                    <PostCard key={post.id} post={post} onComment={() => { setCurrentPost(post); setShowCommentPostCard(true) }} />
                                ))}
                                <CommentPostCard post={currentPost} isOpen={showCommentPostCard} onClose={() => setShowCommentPostCard(false)} onReply={() => {}} />
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

export default Home
