export interface Post {
    id: string;
    content: string;
    media_url?: string;
    comments_count?: number;
    likes_count?: number;
    user: {
        id: string;
        username: string;
        avatar: string;
    };
    isLiked?: boolean;
    isFollowed?: boolean;
    created_at?: Date;
}

export interface Comment {
    id: string;
    body: string;
    content?: string;
    user?: {
        id: string;
        username: string;
        avatar: string;
    };
    userId: string;
    post: Post;
    created_at?: Date;
}

export interface User {
    id: number;
    username: string;
    email: string;
    avatar: string;
    bio: string;
    followers: number;
    following: number;
    created_at?: Date;
}

export interface UserWithData extends User {
    posts?: number;
}

export interface LoginFormData {
    username: string;
    password: string;
}

export interface RegisterFormData extends LoginFormData {
    email: string;
}

export interface PostFormData {
    content: string;
    media: string | null;
}

export interface CommentFormData {
    post_id: string;
    content: string;
}

export interface UserResponse extends Response{
    data: UserWithData;
}


export interface PostResponse extends Response {
    data: Post[]
}

export interface CommentResponse extends Response {
    data: Comment[]
}

export interface LoginResponse extends Response {
    data: {
        user: User;
        expiresIn: string;
        token: string;
    };
}

export interface RegisterResponse extends Response {
    data: {
        user: User;
        expiresIn: string;
        token: string;
    };
}

export interface Response {
    statusCode: number;
    data: any | null;
    success: boolean;
    message: string;
}

export interface ApiError {
    message: string;
}