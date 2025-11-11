import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import type { Post, Comment } from "@/types"
import { Send } from "lucide-react"
import PostCard from "@/components/shared/PostCard"
import { useEffect, useState } from "react"
import { postService } from "@/services/post-service"
import { useAuth } from "@/hooks/useAuth"
import CommentCard from "@/components/shared/CommentCard"

interface CommentPostCardProps {
    post: Post | null;
    isOpen: boolean;
    onClose: () => void;
    onReply: (comment: Post) => void;
}

function CommentPostCard({ post, isOpen, onClose }: CommentPostCardProps) {
    const { user } = useAuth()
    const [currentPost, setCurrentPost] = useState<Post | null>(null)
    const [commentContent, setCommentContent] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [comments, setComments] = useState<Comment[]>([])

    const getPostById = async (postId: string) => {
        if (!postId) return
        setIsLoading(true)
        try {
            const response = await postService.getPostById(postId)
            setCurrentPost(response.data as Post)
        } catch (err) {
            console.error("Error fetching post:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const getComments = async () => {
        if (!post) return
        setIsLoading(true)
        try {
            const response = await postService.getCommentsByPost(post.id)
            const commentsWithUser = response.data.map(comment => {
                return {
                    ...comment,
                    content: comment.body,
                    user: comment.user,
                }
            })
            setComments(commentsWithUser)
        } catch (err) {
            console.error("Error fetching comments:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (post?.id) {
            getPostById(post.id)
            console.log(currentPost)
        }
        getComments()
    }, [post?.id])

    const handleSubmit = async () => {
        if (!post || commentContent.trim() === "") return

        setIsLoading(true)
        try {
            await postService.createComment(post.id, {
                content: commentContent,
            })
            await getComments()
            setCommentContent("")
        } catch (err) {
            console.error("Error creating comment:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="flex items-center justify-between">
                        <span>Post Replies</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-shrink-0">
                    {currentPost && <PostCard post={currentPost} />}
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                    {isLoading ? (
                        <div className="text-center text-gray-500">Loading comments...</div>
                    ) : comments.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            No comments yet. Be the first to comment!
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <CommentCard key={comment.id} comment={comment} />
                        ))
                    )}
                </div>

                <div className="flex-shrink-0 pt-4">
                    <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={user?.avatar || ''} />
                            <AvatarFallback>{user?.username?.[0].toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <Textarea   
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Write a comment..."
                                className="min-h-[60px] resize-none"
                            />

                            <div className="flex justify-between items-center mt-2">
                                <div className="text-sm text-gray-500">
                                    Press Enter to send
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={!commentContent.trim()}
                                    size="sm"
                                    className="flex items-center space-x-2"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Comment</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentPostCard