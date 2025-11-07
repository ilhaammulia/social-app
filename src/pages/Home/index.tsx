import PostCard from '@/components/shared/PostCard'
import CreatePost from '@/components/shared/CreatePost'
import ProfileCard from '@/components/shared/ProfileCard'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Search } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { usePosts } from '@/hooks/usePost'
import { useEffect } from 'react'

function Home() {
    const { user, logout } = useAuthStore()
    const { posts, loading, error, refetch } = usePosts()

    useEffect(() => {
        refetch()
    }, [refetch])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <>
            <div className="w-full flex min-h-screen justify-center">
                <div className="hidden xl:block w-[20%] sticky top-0 h-screen">
                    <div className="h-full overflow-y-auto p-2">
                        <ProfileCard
                            user={{
                                username: user?.username || '',
                                avatar: user?.image || '',
                                bio: user?.bio || '',
                                posts: user?.posts || 0,
                                following: user?.followings || 0,
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
                        <div className="p-4">
                            <InputGroup>
                                <InputGroupInput placeholder="Search..." />
                                <InputGroupAddon>
                                    <Search />
                                </InputGroupAddon>
                                <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
                            </InputGroup>
                        </div>
                    </div>

                    <div className="h-[calc(100vh-73px)] overflow-y-auto">
                        <div className="p-4 border-b border-gray-200">
                            <CreatePost
                                currentUser={{
                                    username: user?.username || '',
                                    avatar: user?.image || '',
                                }}
                                onSubmit={(content) => console.log(content)}
                            />
                        </div>

                        <div>
                            {posts.length > 0 &&
                                posts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
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
