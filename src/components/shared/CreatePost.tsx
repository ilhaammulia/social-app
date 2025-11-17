import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Smile, Image as ImageIcon, X } from 'lucide-react'
import type { PostFormData } from '@/types'

export interface CreatePostProps {
    currentUser: {
        username: string
        avatar?: string
    }
    onSubmit?: (postData: PostFormData, images: File[]) => void
    placeholder?: string
}

const CreatePost: React.FC<CreatePostProps> = ({
    currentUser,
    onSubmit,
    placeholder = 'What is happening?!',
}) => {
    const [content, setContent] = useState('')
    const [images, setImages] = useState<File[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [charCount, setCharCount] = useState(0)
    const maxChars = 280

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            setImages((prev) => [...prev, ...Array.from(files)])
        }
    }

    const handleSubmit = () => {
        if (content.trim() && charCount <= maxChars && charCount > 0) {
            onSubmit?.({
                content: content.trim(),
                media: '',
            }, images)
            setContent('')
            setImages([])
            setCharCount(0)
            setIsDialogOpen(false)
        }
    }

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value
        setContent(newContent)
        setCharCount(newContent.length)
    }

    const isSubmitDisabled = !content.trim() || charCount > maxChars || charCount === 0

    return (
        <>
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="lg"
                            className="rounded-full w-14 h-14 shadow-lg bg-blue-500 hover:bg-blue-600"
                        >
                            <span className="text-2xl font-light">+</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                        <PostForm
                            currentUser={currentUser}
                            content={content}
                            images={images}
                            charCount={charCount}
                            maxChars={maxChars}
                            isSubmitDisabled={isSubmitDisabled}
                            onContentChange={handleContentChange}
                            onImageChange={handleImageChange}
                            setImages={setImages}
                            onSubmit={handleSubmit}
                            onClose={() => setIsDialogOpen(false)}
                            placeholder={placeholder}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="hidden md:block w-full max-w-7xl mx-auto border-b border-gray-200 p-4">
                <PostForm
                    currentUser={currentUser}
                    content={content}
                    images={images}
                    charCount={charCount}
                    maxChars={maxChars}
                    isSubmitDisabled={isSubmitDisabled}
                    onContentChange={handleContentChange}
                    onImageChange={handleImageChange}
                    setImages={setImages}
                    onSubmit={handleSubmit}
                    placeholder={placeholder}
                />
            </div>
        </>
    )
}

interface PostFormProps {
    currentUser: {
        username: string
        avatar?: string
    }
    content: string
    images: File[]
    charCount: number
    maxChars: number
    isSubmitDisabled: boolean
    onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    setImages: React.Dispatch<React.SetStateAction<File[]>>
    onSubmit: () => void
    onClose?: () => void
    placeholder?: string
}

const PostForm: React.FC<PostFormProps> = ({
    currentUser,
    content,
    images,
    charCount,
    maxChars,
    isSubmitDisabled,
    onContentChange,
    onImageChange,
    setImages,
    onSubmit,
    onClose,
    placeholder = 'What is happening?!',
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    return (
        <div>
            {onClose && (
                <div className="flex items-center justify-between mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 rounded-full"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-blue-500 text-blue-500 hover:bg-blue-50"
                    >
                        Drafts
                    </Button>
                </div>
            )}

            <div className="flex space-x-3">
                <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                        {currentUser.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <Textarea
                        value={content}
                        onChange={onContentChange}
                        placeholder={placeholder}
                        className="min-h-[120px] border-0 shadow-none text-lg resize-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                    />

                    {images.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index}`}
                                        className="rounded-lg object-cover h-28 w-full border"
                                    />
                                    <button
                                        onClick={() => {
                                            const newImages = [...images]
                                            newImages.splice(index, 1)
                                            setImages(newImages)
                                        }}
                                        className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="h-4 w-4 text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer Controls */}
                    <div className="flex items-center justify-between pt-3 border-t mt-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                ref={fileInputRef}
                                className="hidden"
                                onChange={onImageChange}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-9 w-9 text-blue-500 hover:bg-blue-50 rounded-full"
                            >
                                <ImageIcon className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-blue-500 hover:bg-blue-50 rounded-full"
                            >
                                <Smile className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex items-center space-x-4">
                            {charCount > 0 && (
                                <div className="flex items-center space-x-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${charCount > maxChars
                                                ? 'bg-red-100 text-red-600'
                                                : charCount > maxChars * 0.8
                                                    ? 'bg-yellow-100 text-yellow-600'
                                                    : 'bg-transparent text-gray-500'
                                            }`}
                                    >
                                        {maxChars - charCount}
                                    </div>
                                    <div className="w-px h-6 bg-gray-300"></div>
                                </div>
                            )}

                            <Button
                                onClick={onSubmit}
                                disabled={isSubmitDisabled}
                                className="rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed px-4"
                            >
                                Post
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost
